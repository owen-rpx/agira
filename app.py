# -*- coding: utf-8 -*-

from scripts import tabledef
from scripts import forms
from scripts import helpers
from flask import Flask, redirect, url_for, render_template, request, Response, session, send_from_directory
import json
import sys
import os
import pandas as pd
import io
sys.stdout = io.TextIOWrapper(
    sys.stdout.buffer, encoding='utf8')  # 改变标准输出的默认编码
app = Flask(__name__)


# ======== Routing =========================================================== #
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# -------- Login ------------------------------------------------------------- #


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')

@app.route('/world_geo_json')
def world_geo():
    file_path = os.path.join(app.root_path, 'static/vender/js/G2Map/data')
    return send_from_directory(file_path,'world.geo.json')

@app.route('/data_json')
def data_geo():
    file_path = os.path.join(app.root_path, 'static/vender/js/G2Map/data')
    return send_from_directory(file_path,'data.json')


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
                       'priority': 'priority', 'customer': 'customer', 'version': 'version', 'discover': 'discover', 'component': 'component', }
        res_dict = {}
        for res_type in charts_type:
            project_type_set = []
            for project_data in projects_set:
                project_type_set.append(project_data[res_type])
            if res_type == 'customer':
                project_type_set = clean_customers_data(project_type_set)
            if res_type == 'status' or res_type == 'version' or res_type == 'discover' or res_type == 'component':
                project_type_set = clean_version_data(project_type_set)
            ds = generate_axis_data(project_type_set)
            data = {
                'label': projects_list,
                'x_axis': ds['x_axis'],
                'data': ds['data']
            }
            res_dict[res_type] = data
        json_str = json.dumps(res_dict)
        return Response(json_str)


@app.route('/api/tickets/<projects>/<daterange>/<keys>', methods=['GET'])
def getTickets(projects, daterange, keys):
    print(projects)
    print(daterange)
    print(keys)
    keys_list = keys.split(',')
    projects_list = projects.split(',')
    projects_dict = {}
    for project in projects_list:
        projects_dict[project] = pick_tickets_data(
            project, daterange, keys_list)
    json_str = json.dumps(projects_dict)
    return Response(json_str)


@app.route('/api/data/period/<project>/<year>/<period>', methods=['GET'])
def getPeriod(project, year, period):
    projects_dict = {
        "customer": {
            "data": [
                {
                    "CVS Pharmacy Inc": 2,
                    "Cabela's Inc": 1,
                    "Centre d'Information RX Ltee": 14,
                    "PT Multipolar Technology Tbk": 8,
                    "United Overseas Bank Limited": 15
                },
                {
                    "CVS Pharmacy Inc": 1,
                    "Cabela's Inc": 2,
                    "Centre d'Information RX Ltee": 4,
                    "PT Multipolar Technology Tbk": 5,
                    "United Overseas Bank Limited": 2
                },
                {
                    "CVS Pharmacy Inc": 10,
                    "Cabela's Inc": 17,
                    "Centre d'Information RX Ltee": 9,
                    "PT Multipolar Technology Tbk": 10,
                    "United Overseas Bank Limited": 21
                },
            ],
            "label": [
                "Q2",
                "Q3",
                "Q4"
            ],
            "x_axis": [
                "CVS Pharmacy Inc",
                "Cabela's Inc",
                "Centre d'Information RX Ltee",
                "PT Multipolar Technology Tbk",
                "United Overseas Bank Limited"
            ]
        },
    }
    json_str = json.dumps(projects_dict)
    return Response(json_str)


def pick_tickets_data(type, daterange, keys_list):
    dataPath = os.path.join(app.root_path, 'data')
    inputfile_dir = {'ALLI': 'demo_lmi.csv',
                     'ALLE': 'demo_lme.csv', 'ALWP': 'demo_wp.csv'}
    iptdir = dataPath+'/'+inputfile_dir[type]
    df = pd.read_csv(iptdir, header=0, sep=',', encoding='ISO-8859-1',
                     low_memory=False, mangle_dupe_cols=True)

    cols = ['Issue key', 'Summary', 'Issue Type', 'Project key', 'Project name', 'Priority', 'Project lead', 'Status', 'Assignee', 'Reporter', 'Created', 'Updated',
            'Affects Version/s', 'Custom field (Affected Customers)', 'Component/s', 'Custom field (Discovered by)']
    df = df[cols]

    df['Created'] = pd.to_datetime(df['Created'])

    df = df.set_index('Created')
    # start = '2018-01-01'
    # end = '2019-01-01'
    drange = daterange.split(',')
    start = drange[0]
    end = drange[1]
    df = df[start:end]
    l = len(keys_list)
    ticket_dict = {}
    for k in range(l):
        key_col = keys_list[k]
        key_col_tickect = df['Issue key'][df['Custom field (Affected Customers)']
                                          == key_col]
        ticket_dict[key_col] = key_col_tickect.tolist()
    return ticket_dict


def get_x_axis(data_list):
    x_axis = []
    for data in data_list:
        x = list(data.keys())
        for xx in x:
            if xx not in x_axis:
                x_axis.append(xx)
    x_axis.sort()
    return x_axis


def clean_customers_data(data_list):
    min_val = 5
    limits = 7
    l = len(data_list)
    gen_list = []
    for i in range(l):
        item = data_list[i]
        new_item = {}
        cur_x_axis = item.keys()
        for x in cur_x_axis:
            if item[x] >= min_val:
                if (x.lower().find('internal') == -1) and (x.lower().find('unknown') == -1) and (x.lower().find('.doc') == -1) and (x.lower().find('aldon') == -1):
                    if len(new_item) < limits:
                        new_item[x] = item[x]
        gen_list.append(new_item)
    return gen_list


def clean_version_data(data_list):
    min_val = 5
    limits = 7
    l = len(data_list)
    gen_list = []
    for i in range(l):
        item = data_list[i]
        new_item = {}
        cur_x_axis = item.keys()
        for x in cur_x_axis:
            if item[x] >= min_val:
                if len(new_item) < limits:
                    new_item[x] = item[x]
        gen_list.append(new_item)
    return gen_list


def generate_axis_data(data_list):
    x_axis = get_x_axis(data_list)
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


def pick_data(type, daterange):
    dataPath = os.path.join(app.root_path, 'data')
    inputfile_dir = {'ALLI': 'demo_lmi.csv',
                     'ALLE': 'demo_lme.csv', 'ALWP': 'demo_wp.csv'}
    iptdir = dataPath+'/'+inputfile_dir[type]
    df = pd.read_csv(iptdir, header=0, sep=',', encoding='ISO-8859-1',
                     low_memory=False, mangle_dupe_cols=True)

    cols = ['Issue key', 'Summary', 'Issue Type', 'Project key', 'Project name', 'Priority', 'Project lead', 'Status', 'Assignee', 'Reporter', 'Created', 'Updated',
            'Affects Version/s', 'Custom field (Affected Customers)', 'Component/s', 'Custom field (Discovered by)']
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
    json_customer_response = json.loads(
        df['Custom field (Affected Customers)'].value_counts().to_json())
    json_comp_response = json.loads(df['Component/s'].value_counts().to_json())
    json_version_response = json.loads(
        df['Affects Version/s'].value_counts().to_json())
    json_discover_response = json.loads(
        df['Custom field (Discovered by)'].value_counts().to_json())

    # ke = df[['Issue key','Summary']][df['Custom field (Affected Customers)'] == 'United Overseas Bank Limited']
    # print(ke.to_json())
    # ke = df['Issue key'][df['Custom field (Affected Customers)']
    #                      == 'United Overseas Bank Limited']
    # print(ke.tolist())
    res = {
        'status': json_status_response,
        'issue': json_issue_response,
        'priority': json_priority_response,
        'customer': json_customer_response,
        'component': json_comp_response,
        'version': json_version_response,
        'discover': json_discover_response,
    }
    return res


# ======== Main ============================================================== #
if __name__ == "__main__":
    app.secret_key = os.urandom(12)  # Generic key for dev purposes only
    app.run(host='0.0.0.0', debug=True, use_reloader=True)
