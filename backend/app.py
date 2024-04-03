from flask import Flask, jsonify
import pandas as pd
import json


app = Flask(__name__)

data = pd.read_csv("../backend/dataset/indian_water_physicochemical_parameters.csv", encoding='unicode_escape')
data = data.loc[:, ~data.columns.str.contains('^Unnamed')]
dates = data["date"].values

@app.route('/temperature', methods=['GET'])
def send_temperatures():
    temperatures = dict(zip(dates, data["Temp"].values))
    return jsonify(temperatures)

@app.route('/table', methods=['GET'])
def send_table():
    json_data = data.to_json(orient='records')
    parsed_json = json.loads(json_data)
    return jsonify(parsed_json)

if __name__ == '__main__':
    app.run(debug=True)
