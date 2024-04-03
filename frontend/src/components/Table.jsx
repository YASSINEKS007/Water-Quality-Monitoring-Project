import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileAlt } from "react-icons/fa";

function Table() {
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Added state for sort order

  useEffect(() => {
    fetchTemperature();
  }, []);

  const fetchTemperature = async () => {
    try {
      const response = await fetch("/api/table", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  console.log(data);
  console.log(typeof data);

  const sortByHighestValue = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? -1 : 1; // Sort in descending order
      } else {
        return a[key] > b[key] ? 1 : -1; // Sort in ascending order
      }
    });
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const generateReport = () => {
    const table = document.getElementById("report-table");

    html2canvas(table)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190; // A4 size
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const doc = new jsPDF();
        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        doc.save("report.pdf");
      })
      .catch((error) => {
        console.error("Error generating report: ", error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table
          id="report-table"
          className="min-w-full divide-y divide-gray-200 border-collapse"
        >
          <thead className="bg-purple-600 text-white">
            <tr>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("name")}
              >
                STATION CODE
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("position")}
              >
                LOCATIONS
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("office")}
              >
                STATE
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("age")}
              >
                Temp
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("startDate")}
              >
                D.O. (mg/l)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                PH
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                CONDUCTIVITY (Âµmhos/cm)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                B.O.D. (mg/l)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                NITRATENAN N+ NITRITENANN (mg/l)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                FECAL COLIFORM (MPN/100ml)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                TOTAL COLIFORM (MPN/100ml)Mean
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                year
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["STATION CODE"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["LOCATIONS"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["STATE"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["Temp"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["D.O. (mg/l)"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["PH"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["CONDUCTIVITY (Âµmhos/cm)"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["B.O.D. (mg/l)"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["NITRATENAN N+ NITRITENANN (mg/l)"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["FECAL COLIFORM (MPN/100ml)"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["TOTAL COLIFORM (MPN/100ml)Mean"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["year"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["FECAL COLIFORM (MPN/100ml)"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="bg-transparent border border-purple-600 text-purple-600 px-4 py-2 rounded-lg flex items-center justify-center absolute bottom-0 right-4 hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out focus:outline-none"
        onClick={generateReport}
      >
        <FaFileAlt /> <span className="ml-2">Generate Report</span>
      </button>
    </div>
  );
}

export default Table;
