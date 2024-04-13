import React, { useState, useEffect } from "react";

function Temperature() {
  const [temperature, setTemperature] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    fetchTemperature();
  }, []);

  const fetchTemperature = async () => {
    try {
      const response = await fetch("/api/temperature", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const latestTemperature = getLatestTemperature(data);
      setTemperature(latestTemperature);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const getLatestTemperature = (temperatureData) => {
    const temperatures = Object.values(temperatureData);
    const latestTemperatureIndex = temperatures.length - 1;
    return temperatures[latestTemperatureIndex];
  };

  const convertToFahrenheit = () => {
    if (isCelsius) {
      const fahrenheit = (temperature * 9) / 5 + 32;
      setTemperature(fahrenheit);
      setIsCelsius(false);
    }
  };

  const convertToCelsius = () => {
    if (!isCelsius) {
      setTemperature((temperature - 32) * (5 / 9));
      setIsCelsius(true);
    }
  };

  if (temperature === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">Temperature</h2>
          <div className="flex items-center justify-center mt-4">
            <span className="text-6xl font-bold">
              {temperature.toFixed(1)}&deg;
            </span>
            <span className="text-xl">{isCelsius ? "C" : "F"}</span>
          </div>
          <div className="mt-4">
            <button
              className={`text-blue-500 hover:text-blue-700 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isCelsius && "opacity-50 cursor-not-allowed"
              }`}
              onClick={convertToCelsius}
              disabled={isCelsius}
            >
              Celsius
            </button>
            <button
              className={`text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isCelsius && "opacity-50 cursor-not-allowed"
              }`}
              onClick={convertToFahrenheit}
              disabled={!isCelsius}
            >
              Fahrenheit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Temperature;