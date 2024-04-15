import React, { useState, useEffect, useMemo } from "react";
import "../css/Gauge.css";

const Gauge2 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [counter, setCounter] = useState(0);
  const [wqi, setWQI] = useState(0);
  const [wqc, setWQC] = useState("");
  const [animationDuration, setAnimationDuration] = useState(2000);
  const [dates, setDates] = useState([]);

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
        setDates(responseData);
        setSelectedDate(responseData[responseData.length - 1]); // Set selected date as the last date in the array
        console.log(responseData);
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const inputProps = {
    type: "date",
    className: "border rounded px-2 py-1 mb-4 w-full",
    value: selectedDate,
    onChange: handleDateChange,
  };

  const disabledDates = dates.map((date) => (
    <option key={date} value={date} disabled={dates.includes(date) ? null : "disabled"}>
      {date}
    </option>
  ));

  const fetchData = (date) => {
    fetch(`/api/gauge?specified_date=${date}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setWQC(data.wqc);
        setWQI(parseFloat(data.wqi));
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  const updateWQIandWQC = () => {
    fetchData(selectedDate);
    togglePopup();
  };

  useEffect(() => {
    const difference = Math.abs(wqi - counter);
    const newAnimationDuration = 2000 * (difference / wqi);
    const updateInterval = Math.min(30, newAnimationDuration / difference);
    const direction = wqi > counter ? 1 : -1;
  
    if (counter !== wqi) {
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => {
          const nextCounter = prevCounter + direction;
          // If direction is positive (incrementing), ensure it doesn't exceed wqi
          if (direction > 0) {
            if (nextCounter >= wqi) {
              clearInterval(intervalId);
              return wqi; // Set counter to final wqi value
            } else {
              return nextCounter;
            }
          } else { // If direction is negative (decrementing), ensure it doesn't go below wqi
            if (nextCounter <= wqi) {
              clearInterval(intervalId);
              return wqi; // Set counter to final wqi value
            } else {
              return nextCounter;
            }
          }
        });
      }, updateInterval);
  
      return () => clearInterval(intervalId);
    }
  }, [counter, wqi]);
  

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const gaugeCircleStyle = useMemo(() => ({
    strokeDasharray: 472,
    strokeDashoffset: 500 - (472 * Math.min(counter, 100)) / 100,
    animationDuration: `${animationDuration}ms`,
    animationTimingFunction: "linear",
    animationFillMode: "forwards",
  }), [counter, animationDuration]);

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

        <div className="custom-gauge skill">
          <div className="custom-gauge outer">
            <div className="custom-gauge inner">
              <div className="text-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{counter.toFixed(2)}</div>
                  <div className="text-lg font-normal">{wqc}</div>
                </div>
              </div>
            </div>
          </div>
          <svg
            className="custom-svg-gauge"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="160px"
            height="160px"
          >
            <defs>
              <linearGradient id="custom-gauge-GradientColor">
                <stop offset="0%" stopColor="#e91e63" />
                <stop offset="100%" stopColor="#673ab7" />
              </linearGradient>
            </defs>
            <circle
              className="custom-gauge-circle"
              cx="80"
              cy="80"
              r="70"
              strokeLinecap="round"
              style={gaugeCircleStyle}
            />
          </svg>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4 text-center">Select Date</h2>
            <select {...inputProps}>
              {disabledDates}
            </select>
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
};

export default Gauge2;
