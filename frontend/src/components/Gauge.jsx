import React, { useState, useEffect } from "react";
import "../css/Gauge.css";

const Gauge = () => {
  const [counter, setCounter] = useState(0);
  const [quality, setQuality] = useState("");
  let animationDuration = 0; 
  let value = 56;

  useEffect(() => {
    const difference = Math.abs(value - counter);
    animationDuration = 2000 * (difference / value); // Assign value to animationDuration
    const updateInterval = Math.min(30, animationDuration / difference); // Calculate update interval dynamically

    if (counter < value) {
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => Math.min(prevCounter + 1, value));
      }, updateInterval);

      return () => clearInterval(intervalId);
    }

    if (value <= 33) {
      setQuality("Bad");
    } else if (value > 33 && value <= 66) {
      setQuality("Good");
    } else {
      setQuality("Very Good");
    }
  }, [counter, value]);

  return (
    <div className="custom-bg-white rounded-lg shadow-md p-6 custom-d-flex custom-justify-content-center custom-align-items-center">
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold">WQI</h2>
      </div>

      <div className="custom-gauge skill">
        <div className="custom-gauge outer">
          <div className="custom-gauge inner ">
            <div className="text-center">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{counter}</div>
                <div className="text-lg font-normal">{quality}</div>
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
            style={{
              strokeDasharray: 472,
              strokeDashoffset: 500 - (472 * Math.min(counter, 100)) / 100,
              animationDuration: `${animationDuration}ms`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Gauge;
