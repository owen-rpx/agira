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

@app.route('/api/data', methods = ['GET'])
def getData():
    if request.method == 'GET':
        dataPath = os.path.join(app.root_path, 'data')
        print(dataPath)
        df = pd.read_csv(dataPath +'/demo.csv', header=0, sep=',', encoding = 'ISO-8859-1')
        json_response = df['Component/s'].value_counts().to_json()
        print(json_response)
        return Response(json_response)


# ======== Main ============================================================== #
if __name__ == "__main__":
    app.secret_key = os.urandom(12)  # Generic key for dev purposes only
    app.run(debug=True, use_reloader=True)
