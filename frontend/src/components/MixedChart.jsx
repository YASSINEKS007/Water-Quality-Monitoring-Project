import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const MixedChart = () => {
  const [selectedValue, setSelectedValue] = useState("Conductivity");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2012");
  const [startDate, setStartDate] = useState("2014-10-05");
  const [endDate, setEndDate] = useState("2014-12-31");
  const [tempStartDate, setTempStartDate] = useState("2014-10-05");
  const [tempEndDate, setTempEndDate] = useState("2014-12-31");
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedValue]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/mixedChart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setTempStartDate(`${year}-01-01`);
    setTempEndDate(`${year}-12-31`);
  };

  const handleDateChange = (e, type) => {
    const value = e.target.value;
    if (type === "start") {
      setTempStartDate(value);
    } else if (type === "end") {
      setTempEndDate(value);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const applyDateRange = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    togglePopup();
  };

  // Filter data for selected measure and date range
  const selectedData = data.find((entry) => entry.label === selectedValue);
  let filteredData = {};
  if (selectedData && selectedData.data) {
    const selectedDataEntries = Object.entries(selectedData.data);
    filteredData = selectedDataEntries.reduce((acc, [date, value]) => {
      if (date >= startDate && date <= endDate) {
        acc[date] = value;
      }
      return acc;
    }, {});
  }

  // Prepare labels and datasets
  const labels = Object.keys(filteredData);
  const dataset = {
    labels: labels,
    datasets: [
      {
        label: selectedValue,
        data: Object.values(filteredData),
        backgroundColor: "rgba(128, 0, 128, 0.6)",
        borderColor: "rgba(87, 121, 234, 0.6)",
        barPercentage: 1,
        categoryPercentage: 1,
        order: 1,
      },
      {
        label: "Line",
        data: Object.values(filteredData),
        backgroundColor: "transparent",
        borderColor: "purple", // Replace with the actual color value
        borderWidth: 3,
        fill: false,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 5,
        type: "line",
        order: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 3000,
      easing: "easeInBounce",
    },
    title: {
      display: true,
      text: "Mixed Chart",
      position: "top",
      align: "center",
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        scaleLabel: {
          display: true,
          labelString: "Months",
        },
        stacked: true,
      },
      y: {
        scaleLabel: {
          display: true,
          labelString: "Values",
        },
        stacked: true,
      },
    },
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
          <option value="Temperature">Temperature</option>
          <option value="pH">pH</option>
          <option value="D.O.">DO</option>
          <option value="Conductivity">Conductivity</option>
          <option value="B.O.D.">B.O.D</option>
          <option value="Nitrate">Nitrate</option>
          <option value="Fecal Coliform">Fecal Coliform</option>
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
      {/* Popup for selecting year and date range */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4 text-center">Select Year</h2>
            <select
              className="border rounded px-3 py-1 mb-4 w-full"
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="2014">2014</option>
              {[2013, 2012].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {selectedYear && (
              <>
                <div className="flex items-center mb-2">
                  <label className="mr-2 text-sm">Start Date:</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={tempStartDate}
                    onChange={(e) => handleDateChange(e, "start")}
                    min={`${selectedYear}-01-01`}
                    max={`${selectedYear}-12-31`}
                  />
                </div>
                <div className="flex items-center mb-4">
                  <label className="mr-2 text-sm">End Date:</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={tempEndDate}
                    onChange={(e) => handleDateChange(e, "end")}
                    min={`${selectedYear}-01-01`}
                    max={`${selectedYear}-12-31`}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-purple-200 hover:bg-purple-300 focus:bg-purple-300 text-purple-800 px-5 py-3 rounded-md shadow-md transition-colors duration-300 mr-4"
                    onClick={togglePopup}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white px-5 py-3 rounded-md shadow-md transition-colors duration-300"
                    onClick={applyDateRange}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedYear && (
        <div className="flex justify-center p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-700 mt-8">
            {selectedValue} distribution from{" "}
            {new Date(startDate).toLocaleDateString("en-GB")} to{" "}
            {new Date(endDate).toLocaleDateString("en-GB")}
          </h1>{" "}
        </div>
      )}

      <Bar data={dataset} options={options} />
    </div>
  );
};

export default MixedChart;
