import React, { useState, useEffect } from "react";
import "../css/Gauge.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Gauge3() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [wqi, setWQI] = useState(0);
  const [wqc, setWQC] = useState("");
  const [dates, setDates] = useState([]);
  const [stopColorFirst, setStopColorFirst] = useState("#e3edf7");
  const [stopColorSecond, setStopColorSecond] = useState("#e3edf7");

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch("/api/dates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        const dateObjects = responseData.map((date) => new Date(date));
        setDates(dateObjects);
        setSelectedDate(dateObjects[dateObjects.length - 1]); // Set selected date as the last date in the array
      } catch (error) {
        console.error("Error fetching gauge dates:", error);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const disabledDates = {
    minDate: new Date(Math.min.apply(null, dates)),
    maxDate: new Date(Math.max.apply(null, dates)),
    includeDates: dates, 
  };

  function colorSetUp(wqc_value) {
    if (wqc_value === "good") {
      setStopColorFirst("#4caf50");
      setStopColorSecond("#1b5e20");
    }
    if (wqc_value === "poor") {
      setStopColorFirst("#ff9800");
      setStopColorSecond("#e65100");
    }
    if (wqc_value === "unsuitable") {
      setStopColorFirst("#f44336");
      setStopColorSecond("#b71c1c");
    }
  }

  const fetchData = (date) => {
    fetch(`/api/gauge?specified_date=${date.toISOString().slice(0, 10)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setWQC(data.wqc);
        setWQI(parseFloat(data.wqi));
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  useEffect(() => {
    if (wqc) {
      colorSetUp(wqc);
    }
  }, [wqc]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const updateWQIandWQC = () => {
    fetchData(selectedDate);
    togglePopup();
  };

  return (
    <>
      <div className="custom-bg-white rounded-lg shadow-md p-6 custom-d-flex custom-flex-column">
        <div
          className="text-center mb-3 custom-d-flex custom-justify-content-between custom-align-items-center"
          style={{
            borderBottom: "1px solid #000",
            width: "100%",
            position: "relative",
          }}
        >
          <h2
            className="text-xl font-bold custom-title"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            WQI
          </h2>
          <button
            className="date-selector-button ml-auto"
            onClick={togglePopup}
            style={{ marginBottom: "3px" }}
          >
            ...
          </button>
        </div>

        <div className="custom-skill">
          <div className="custom-outer">
            <div className="custom-inner">
              <div className="text-center">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {wqi.toFixed(2)}
                  </div>
                  <div className="text-lg font-normal">{wqc}</div>
                </div>
              </div>
            </div>
          </div>
          <svg
            id="custom-svg"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="160px"
            height="160px"
          >
            <defs>
              <linearGradient id="custom-GradientColor">
                <stop
                  offset="0%"
                  stopColor={stopColorFirst}
                />
                <stop
                  offset="100%"
                  stopColor={stopColorSecond}
                />
              </linearGradient>
            </defs>
            <circle
              id="custom-circle"
              cx="80"
              cy="80"
              r="70"
              strokeLinecap="round"
              fill="url(#custom-GradientColor)"
            />
          </svg>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white p-6 rounded shadow-md w-80"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 className="text-lg font-bold mb-4 text-center">Select Date</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              {...disabledDates}
              className="border rounded px-2 py-1 mb-4 w-full"
              style={{ margin: "0 auto" }}
            />
            <div className="flex justify-center">
              <button
                className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white px-5 py-3 rounded-md shadow-md transition-colors duration-300"
                onClick={updateWQIandWQC}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gauge3;
