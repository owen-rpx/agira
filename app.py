# -*- coding: utf-8 -*-

from scripts import tabledef
from scripts import forms
from scripts import helpers
from flask import Flask, redirect, url_for, render_template, request, Response, session, send_from_directory
import json
import sys
import os
import pandas as pd


app = Flask(__name__)


# ======== Routing =========================================================== #
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# -------- Login ------------------------------------------------------------- #


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')

# -------- Data API ---------------------------------------------------------- #


@app.route('/api/chart/<type>', methods=['GET', 'POST'])
def charts(type):
    return type + ' back'


@app.route('/api/data', methods=['GET'], defaults={'projects': 'ALLI,ALLE,ALWP', 'daterange': '2018-01-01,2018-12-31'})
@app.route('/api/data/<projects>/<daterange>', methods=['GET'])
def getData(projects, daterange):
    if request.method == 'GET':
        print(projects)
        print(daterange)
        projects_list = projects.split(',')
        projects_set = []
        for project in projects_list:
            projects_set.append(pick_data(project, daterange))

        charts_type = {'status': 'status', 'issue': 'issue',
                       'priority': 'priority', 'discover': 'discover', 'component': 'component', 'version': 'version'}
        res_dict = {}
        for res_type in charts_type:
            project_type_set = []
            for project_data in projects_set:
                project_type_set.append(project_data[res_type])
            ds = generate_axis_data(project_type_set)
            data = {
                'label': projects_list,
                'x_axis': ds['x_axis'],
                'data': ds['data']
            }
            res_dict[res_type] = data
        json_str = json.dumps(res_dict)
        return Response(json_str)


def get_x_axis(data_list):
    x_axis = []
    for data in data_list:
        x = list(data.keys())
        for xx in x:
            if xx not in x_axis:
                x_axis.append(xx)
    x_axis.sort()
    return x_axis


def generate_axis_data(data_list):
    x_axis = get_x_axis(data_list)
    # print(x_axis)
    l = len(data_list)
    gen_list = []
    for i in range(l):
        item = data_list[i]
        cur_x_axis = item.keys()
        for x in x_axis:
            if x not in cur_x_axis:
                item[x] = 0
        gen_list.append(item)
    return {'x_axis': x_axis, 'data': gen_list}

# def pick_data(type='ALWP',start= '2018-01-01',end= '2019-01-01'):
def pick_data(type, daterange):
    dataPath = os.path.join(app.root_path, 'data')
    inputfile_dir = {'ALLI': 'demo_lmi.csv',
                     'ALLE': 'demo_lme.csv', 'ALWP': 'demo_wp.csv'}
    iptdir = dataPath+'/'+inputfile_dir[type]
    df = pd.read_csv(iptdir, header=0, sep=',', encoding='ISO-8859-1',
                     low_memory=False, mangle_dupe_cols=True)

    cols = ['Issue key', 'Issue Type', 'Project key', 'Project name', 'Priority', 'Project lead', 'Status', 'Assignee', 'Reporter', 'Creator', 'Created', 'Updated',
            'Affects Version/s', 'Component/s', 'Environment', 'Original Estimate', 'Remaining Estimate', 'Time Spent', 'Custom field (Affected Customers)', 'Custom field (Discovered by)']
    df = df[cols]

    df['Created'] = pd.to_datetime(df['Created'])

    df = df.set_index('Created')
    # start = '2018-01-01'
    # end = '2019-01-01'
    drange = daterange.split(',')
    start = drange[0]
    end = drange[1]
    df = df[start:end]
    json_status_response = json.loads(df['Status'].value_counts().to_json())
    json_issue_response = json.loads(df['Issue Type'].value_counts().to_json())
    json_priority_response = json.loads(
        df['Priority'].value_counts().to_json())
    json_discover_response = json.loads(
        df['Custom field (Discovered by)'].value_counts().to_json())
    json_comp_response = json.loads(df['Component/s'].value_counts().to_json())
    json_version_response = json.loads(
        df['Affects Version/s'].value_counts().to_json())

    res = {
        'status': json_status_response,
        'issue': json_issue_response,
        'priority': json_priority_response,
        'discover': json_discover_response,
        'component': json_comp_response,
        'version': json_version_response,
    }
    return res


# ======== Main ============================================================== #
if __name__ == "__main__":
    app.secret_key = os.urandom(12)  # Generic key for dev purposes only
    app.run(host='0.0.0.0', debug=True, use_reloader=True)
