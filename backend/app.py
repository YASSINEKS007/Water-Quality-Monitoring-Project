from flask import Flask, jsonify
import pandas as pd
import json
from collections import defaultdict
from datetime import datetime
import calendar
from aquasentinel import predict_wqi, get_wqc 
import numpy as np
from scipy.stats import zscore
from sklearn.preprocessing import StandardScaler
from flask import request




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

@app.route('/statistics', methods=['GET'])
def send_statistics():
    json_data = data.describe().to_json(orient="columns")
    parsed_json = json.loads(json_data)
    return jsonify(parsed_json)


def calculate_monthly_mean(data):
    yearly_monthly_data = defaultdict(lambda: defaultdict(list))

    for date_str, value in data.items():
        date = datetime.strptime(date_str, "%Y-%m-%d")
        year = date.year
        month = date.month
        yearly_monthly_data[year][month].append(value)

    mean_data = {}
    for year, monthly_data in yearly_monthly_data.items():
        mean_data[year] = {}
        for month, values in monthly_data.items():
            month_name = calendar.month_name[month]
            mean_data[year][month_name] = sum(values) / len(values)

    return mean_data


@app.route('/lineChart', methods=['GET'])
def send_lineChart():    
    # Calculate monthly means for each measurement type
    dict_temp = dict(zip(dates, data["Temp"].values))
    dict_temp = calculate_monthly_mean(dict_temp)
    
    dict_do = dict(zip(dates, data["D.O. (mg/l)"].values))
    dict_do = calculate_monthly_mean(dict_do)
    
    dict_ph = dict(zip(dates, data["PH"].values))
    dict_ph = calculate_monthly_mean(dict_ph)
    
    dict_conductivity = dict(zip(dates, data["CONDUCTIVITY (Âµmhos/cm)"].values))
    dict_conductivity = calculate_monthly_mean(dict_conductivity)
    
    dict_bod = dict(zip(dates, data["B.O.D. (mg/l)"].values))
    dict_bod = calculate_monthly_mean(dict_bod)
    
    dict_nitra = dict(zip(dates, data["NITRATENAN N+ NITRITENANN (mg/l)"].values))
    dict_nitra = calculate_monthly_mean(dict_nitra)
    
    dict_fecal = dict(zip(dates, data["FECAL COLIFORM (MPN/100ml)"].values))
    dict_fecal = calculate_monthly_mean(dict_fecal)
    
    # Prepare data for each measurement type
    data_array = [
        {"label": "Temperature", "data": dict_temp},
        {"label": "D.O.", "data": dict_do},
        {"label": "pH", "data": dict_ph},
        {"label": "Conductivity", "data": dict_conductivity},
        {"label": "B.O.D.", "data": dict_bod},
        {"label": "Nitrate", "data": dict_nitra},
        {"label": "Fecal Coliform", "data": dict_fecal}
    ]
    
    return jsonify(data_array)

@app.route('/mixedChart', methods=['GET'])
def send_mixedChart():    
    dict_temp = dict(zip(dates, data["Temp"].values))
    dict_do = dict(zip(dates, data["D.O. (mg/l)"].values))
    dict_ph = dict(zip(dates, data["PH"].values))
    dict_conductivity = dict(zip(dates, data["CONDUCTIVITY (Âµmhos/cm)"].values))
    dict_bod = dict(zip(dates, data["B.O.D. (mg/l)"].values))
    dict_nitra = dict(zip(dates, data["NITRATENAN N+ NITRITENANN (mg/l)"].values))
    dict_fecal = dict(zip(dates, data["FECAL COLIFORM (MPN/100ml)"].values))
    # Prepare data for each measurement type
    data_array = [
        {"label": "Temperature", "data": dict_temp},
        {"label": "D.O.", "data": dict_do},
        {"label": "pH", "data": dict_ph},
        {"label": "Conductivity", "data": dict_conductivity},
        {"label": "B.O.D.", "data": dict_bod},
        {"label": "Nitrate", "data": dict_nitra},
        {"label": "Fecal Coliform", "data": dict_fecal}
    ]
    
    return jsonify(data_array)
   

@app.route('/gauge', methods=['GET'])
def wqi_gauge():
    specified_date = request.args.get('specified_date')
    print(type(specified_date))
    df = data.copy()
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    
    # Convert specified_date to datetime if it's not already
    if not isinstance(specified_date, pd.Timestamp):
        specified_date = pd.to_datetime(specified_date)
        
    try: 
    
        index_of_date = df.index.get_loc(specified_date)
        
        df = df.drop(columns=["STATION CODE", "LOCATIONS", "STATE", "Temp", "year"])
        
        for column in df.columns:
            df[column] = pd.to_numeric(df[column], errors='coerce')
            
        df.fillna(df.median(), inplace=True)
        
        # Checking for outliers in the full dfset
        z_scores = df.apply(zscore)
        outliers_count = (z_scores.abs() > 3).sum()
        df_outliers = np.where(np.abs(z_scores) > 3)[0]
        df_filtered = df.drop(df.index[df_outliers])
        
        # Scale the df
        scaler = StandardScaler()
        X = df_filtered.values
        X_scaled = scaler.fit_transform(X)
        wqi = predict_wqi(X_scaled[index_of_date])
        print(wqi)
        print(type(wqi))
        wqc = get_wqc(wqi)
        
        # Return the data as JSON
        return jsonify({"wqi": round(wqi, 2), "wqc": wqc})
    
    except KeyError:
        return jsonify({"wqi": "0", "wqc": "No data is available"})


if __name__ == '__main__':
    app.run(debug=True)
