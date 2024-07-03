import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function LineChart() {
  const [selectedValue, setSelectedValue] = useState("pH");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2012");
  const [newSelectedYear, setNewSelectedYear] = useState(selectedYear); 
  const [data, setData] = useState(null); 

  useEffect(() => {
    fetchData();
  }, [selectedValue]); 

  useEffect(() => {
    // Update selectedYear when the user clicks OK in the popup
    setSelectedYear(newSelectedYear);
  }, [newSelectedYear]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/lineChart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Filter data for the selected measure
      const selectedMeasureData = data.find(
        (item) => item.label === selectedValue
      )?.data;

      // Filter data for the selected year
      const selectedYearData =
        selectedMeasureData && selectedMeasureData[selectedYear];

      // Generate data object for chart
      if (selectedYearData) {
        const sortedMonths = Object.keys(selectedYearData).sort((a, b) => {
          // Convert month names to numbers for sorting
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return monthNames.indexOf(a) - monthNames.indexOf(b);
        });

        const chartData = {
          labels: sortedMonths,
          datasets: [
            {
              label: selectedValue,
              data: Object.values(selectedYearData),
              fill: false,
              tension: 0.4,
              borderColor: "purple",
              backgroundColor: "transparent",
            },
          ],
        };
        setData(chartData); // Update state with chart data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleYearChange = (year) => {
    setNewSelectedYear(year); // Update the newly selected year
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden relative">
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
      <div className="absolute top-4 right-4 z-10">
        <button className="focus:outline-none" onClick={toggleDropdown}>
          <span className="text-black">...</span>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-50">
            {/* Dropdown content */}
            <div className="p-2 hover:bg-gray-100">
              <button onClick={togglePopup} className="text-black">
                More Details
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Popup for selecting year */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-bold mb-4 text-center">Select Year</h2>
            <select
              className="border rounded px-3 py-1 mb-4 w-full"
              onChange={(e) => handleYearChange(e.target.value)}
              value={newSelectedYear} // Controlled component
            >
              <option value="2012">2012</option>
              {[2013, 2014].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              <button
                className="bg-purple-200 hover:bg-purple-300 focus:bg-purple-300 text-purple-800 px-5 py-3 rounded-md shadow-md transition-colors duration-300 mr-4"
                onClick={togglePopup}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white px-5 py-3 rounded-md shadow-md transition-colors duration-300"
                onClick={() => {
                  togglePopup(); // Close the popup
                  fetchData(); // Fetch data for the new year
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-700 overflow-hidden whitespace-nowrap mt-8">
          Time Series of {selectedValue} in {selectedYear}
        </h1>
      </div>
      {data && <Line className="lineChart" data={data} options={options} />}{" "}
    </div>
  );
}

export default LineChart;
