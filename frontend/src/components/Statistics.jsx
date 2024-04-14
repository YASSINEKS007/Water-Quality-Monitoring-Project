import React, { useEffect, useState } from "react";

const Statistics = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedValue, setSelectedValue] = useState("PH");
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedValue]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md relative">
      {/* Dropdown menu */}
      <div className="relative">
        <select
          value={selectedValue}
          onChange={handleChange}
          className="focus:outline-none bg-gray-200 text-gray-800 rounded px-3 py-2 text-sm w-40"
        >
          {Object.keys(statistics).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      {/* More details button */}
      <button
        className="absolute top-0 right-0 mt-2 mr-3 text-gray-800 focus:outline-none"
        onClick={toggleDropdown}
      >
        <span className="text-sm">...</span>
      </button>
      {/* Statistics content */}
      <div className="mt-4">
        <h1 className="text-xl font-bold">{selectedValue} Statistics</h1>
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <tbody>
            <tr className="bg-gray-200">
              <td className="px-4 py-2 text-sm font-semibold">Statistic</td>
              <td className="px-4 py-2 text-sm font-semibold">Value</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-4 py-2">Mean</td>
              <td className="px-4 py-2">
                {statistics[selectedValue]?.mean !== undefined
                  ? statistics[selectedValue]?.mean
                  : ""}
              </td>
            </tr>

            <tr className="bg-gray-100">
              <td className="px-4 py-2">Std</td>
              <td className="px-4 py-2">
                {statistics[selectedValue]?.std !== undefined
                  ? statistics[selectedValue]?.std
                  : ""}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-4 py-2">Min</td>
              <td className="px-4 py-2">
                {statistics[selectedValue]?.min !== undefined
                  ? statistics[selectedValue]?.min
                  : ""}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-4 py-2">Max</td>
              <td className="px-4 py-2">
                {statistics[selectedValue]?.max !== undefined
                  ? statistics[selectedValue]?.max
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* More details dropdown */}
      {showDropdown && (
        <div className="absolute top-0 right-0 mt-10 mr-3 z-50">
          <div className="bg-gray-200 shadow-md rounded overflow-hidden">
            <div className="p-2 hover:bg-gray-300">
              <a
                href="#"
                onClick={togglePopup}
                className="text-gray-800 hover:text-gray-600"
              >
                More Details
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Pop-up */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white rounded-lg p-8 text-center"
            style={{ width: "400px" }}
          >
            <h2 className="text-xl font-bold mb-4">More Details</h2>
            <table className="mx-auto">
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Statistic</td>
                  <td className="p-2 font-medium">Value</td>
                </tr>
                {Object.keys(statistics[selectedValue] || {}).map((key) => (
                  <tr key={key}>
                    <td className="p-2">{key}</td>
                    <td className="p-2">{statistics[selectedValue][key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white px-5 py-3 rounded-md shadow-md transition-colors duration-300 mt-4"
              onClick={togglePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
