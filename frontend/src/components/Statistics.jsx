import React, { useState } from "react";

const Statistics = ({ stats, details }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the pop-up
  const [selectedValue, setSelectedValue] = useState("pH"); // Default value

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded overflow-hidden relative">
      {/* Dropdown menu on the left */}
      <div className="absolute top-0 left-0 mt-4 ml-4 z-10">
        <select
          value={selectedValue}
          onChange={handleChange}
          className="focus:outline-none bg-white rounded px-3 py-1 text-gray-700"
        >
          <option value="pH">pH</option>
          <option value="DO">DO</option>
          <option value="Conductivity">Conductivity</option>
          <option value="BOD">BOD</option>
          <option value="Nitrate">Nitrate</option>
        </select>
      </div>
      {/* More details dropdown */}
      <div className="absolute top-0 right-0 mt-4 mr-4 z-10">
        <button className="focus:outline-none" onClick={toggleDropdown}>
          <span className="text-black">...</span>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded overflow-hidden z-50">
            {/* Dropdown content */}
            <div className="p-2 hover:bg-gray-100">
              <a href="#" onClick={togglePopup}>
                More Details
              </a>
            </div>
          </div>
        )}
      </div>
      {/* Statistics content */}
      <div className="flex justify-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-700">Statistics</h1>{" "}
        {/* Centered title */}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="p-4 text-left font-medium text-gray-700">Mean</td>
            <td className="p-4 text-right">{stats.mean}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4 text-left font-medium text-gray-700">Std</td>
            <td className="p-4 text-right">{stats.std}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4 text-left font-medium text-gray-700">Min</td>
            <td className="p-4 text-right">{stats.min}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4 text-left font-medium text-gray-700">Max</td>
            <td className="p-4 text-right">{stats.max}</td>
          </tr>
        </tbody>
      </table>
      {/* Pop-up */}
      {/* Pop-up */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
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
                <tr>
                  <td className="p-2">Mean</td>
                  <td className="p-2">{stats.mean}</td>
                </tr>
                <tr>
                  <td className="p-2">Standard Deviation</td>
                  <td className="p-2">{stats.std}</td>
                </tr>
                <tr>
                  <td className="p-2">Minimum</td>
                  <td className="p-2">{stats.min}</td>
                </tr>
                <tr>
                  <td className="p-2">Maximum</td>
                  <td className="p-2">{stats.max}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white px-5 py-3 rounded-md shadow-md transition-colors duration-300"
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
