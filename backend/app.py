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
import logging

app = Flask(__name__)

data = pd.read_csv(
    "../backend/dataset/indian_water_physicochemical_parameters.csv",
    encoding="unicode_escape",
)
data = data.loc[:, ~data.columns.str.contains("^Unnamed")]
# data = pd.read_csv("../backend/dataset/data_generation.csv")
dates = data["date"].values


@app.route("/temperature", methods=["GET"])
def send_temperatures():
    temperatures = dict(zip(dates, data["Temp"].values))
    return jsonify(temperatures)


@app.route("/table", methods=["GET"])
def send_table():
    json_data = data.to_json(orient="records")
    parsed_json = json.loads(json_data)
    return jsonify(parsed_json)


@app.route("/statistics", methods=["GET"])
def send_statistics():
    df_measures = data.drop(
        columns=["STATION CODE", "LOCATIONS", "STATE", "Temp", "year", "date"]
    )
    json_data = df_measures.describe().to_json(orient="columns")
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


@app.route("/lineChart", methods=["GET"])
def send_lineChart():
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

    data_array = [
        {"label": "Temperature", "data": dict_temp},
        {"label": "D.O.", "data": dict_do},
        {"label": "pH", "data": dict_ph},
        {"label": "Conductivity", "data": dict_conductivity},
        {"label": "B.O.D.", "data": dict_bod},
        {"label": "Nitrate", "data": dict_nitra},
        {"label": "Fecal Coliform", "data": dict_fecal},
    ]

    return jsonify(data_array)


@app.route("/mixedChart", methods=["GET"])
def send_mixedChart():
    dict_temp = dict(zip(dates, data["Temp"].values))
    dict_do = dict(zip(dates, data["D.O. (mg/l)"].values))
    dict_ph = dict(zip(dates, data["PH"].values))
    dict_conductivity = dict(zip(dates, data["CONDUCTIVITY (Âµmhos/cm)"].values))
    dict_bod = dict(zip(dates, data["B.O.D. (mg/l)"].values))
    dict_nitra = dict(zip(dates, data["NITRATENAN N+ NITRITENANN (mg/l)"].values))
    dict_fecal = dict(zip(dates, data["FECAL COLIFORM (MPN/100ml)"].values))
    data_array = [
        {"label": "Temperature", "data": dict_temp},
        {"label": "D.O.", "data": dict_do},
        {"label": "pH", "data": dict_ph},
        {"label": "Conductivity", "data": dict_conductivity},
        {"label": "B.O.D.", "data": dict_bod},
        {"label": "Nitrate", "data": dict_nitra},
        {"label": "Fecal Coliform", "data": dict_fecal},
    ]

    return jsonify(data_array)


@app.route("/gauge", methods=["GET"])
def wqi_gauge():
    specified_date = request.args.get("specified_date")
    df = data.copy()
    df.set_index("date", inplace=True)
    df.index = df.index.astype(str)
    df = df.drop(columns=["STATION CODE", "LOCATIONS", "STATE", "Temp", "year"])
    for column in df.columns[: len(df.columns) - 1]:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    scaler = StandardScaler()
    X = df.values
    X_scaled = scaler.fit_transform(X)
    index_number = df.index.get_loc(specified_date)
    wqi = predict_wqi(X_scaled[index_number])
    print("Predicted WQI:", wqi)

    wqc = get_wqc(wqi)
    return jsonify({"wqi": round(wqi, 2), "wqc": wqc})


logging.basicConfig(filename="flask.log", level=logging.DEBUG)


@app.route("/dates", methods=["GET"])
def test_wqi_gauge():
    df = data.copy()
    df = df.drop(columns=["STATION CODE", "LOCATIONS", "STATE", "Temp", "year"])
    for column in df.columns[: len(df.columns) - 1]:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    median_date_excluded = df.iloc[:, :-1].median()
    df.fillna(median_date_excluded, inplace=True)

    z_scores = df.iloc[:, :-1].apply(zscore)
    outlier_indices = np.where(np.abs(z_scores) > 3)
    df_filtered = df.drop(df.index[outlier_indices[0]])
    dates_ = pd.to_datetime(df_filtered["date"], errors="coerce").values
    str_dates = [np.datetime_as_string(i, timezone="UTC", unit="D") for i in dates_]

    return jsonify(str_dates)


if __name__ == "__main__":
    app.run(debug=True)
