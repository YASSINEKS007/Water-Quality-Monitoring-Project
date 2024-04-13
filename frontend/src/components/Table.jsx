import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileAlt } from "react-icons/fa";

function Table() {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to update scroll position
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  // Effect to add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchInput.toLowerCase());
      } else if (typeof value === "number") {
        return value.toString().includes(searchInput);
      }
      return false;
    })
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const styling = {
    inputContainer: {
      width: "210px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(to bottom,rgb(227, 213, 255),rgb(255, 231, 231))",
      borderRadius: "30px",
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.075)",
    },
    input: {
      width: "200px",
      height: "40px",
      border: "none",
      outline: "none",
      caretColor: "rgb(255, 81, 0)",
      backgroundColor: "rgb(255, 255, 255)",
      borderRadius: "30px",
      paddingLeft: "15px",
      letterSpacing: "0.8px",
      color: "rgb(19, 19, 19)",
      fontSize: "13.4px",
    },
  };

  const paginationStyles = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    listStyle: "none",
    padding: 0,
  };

  const paginationItemStyles = {
    margin: "0 5px",
  };

  const paginationButtonStyles = {
    backgroundColor: "#D6BCFA", // Light purple color, matching the table header
    border: "1px solid #D1D5DB",
    color: "#4B5563",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease", // Smooth transition on background color
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
  };

  const activeButtonStyles = {
    backgroundColor: "#805AD5", // Darker purple for active state, matching the table header
    color: "#FFFFFF",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Slightly stronger shadow for active state
  };

  const disabledButtonStyles = {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
    cursor: "not-allowed",
  };


  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div style={styling.inputContainer} className="InputContainer flex">
        <input
          placeholder="Search.."
          style={styling.input}
          className="input"
          name="text"
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table
          id="report-table"
          className="min-w-full divide-y divide-gray-200 border-collapse"
          style={{
            width: "100%",
          }}
        >
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                date
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                STATION CODE
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                LOCATIONS
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                STATE
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                Temp
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                D.O. (mg/l)
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                PH
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                CONDUCTIVITY (Âµmhos/cm)
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                B.O.D. (mg/l)
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                NITRATENAN N+ NITRITENANN (mg/l)
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                FECAL COLIFORM (MPN/100ml)
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white"
                onClick={() => sortByHighestValue("salary")}
              >
                TOTAL COLIFORM (MPN/100ml)Mean
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer border border-white">
                year
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                  {item["date"]}
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <ul style={paginationStyles} className="pagination">
          <li
            style={paginationItemStyles}
            className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
          >
            <button
              style={paginationButtonStyles}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {/* Pagination Items */}
          {Array.from(
            { length: Math.ceil(filteredData.length / itemsPerPage) },
            (_, i) => i + 1
          ).map((pageNumber) => (
            <li
              key={pageNumber}
              style={paginationItemStyles}
              className={`pagination-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
            >
              <button
                style={{
                  ...paginationButtonStyles,
                  ...(pageNumber === currentPage ? activeButtonStyles : {}),
                }}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          {/* Pagination Next Button */}
          <li
            style={paginationItemStyles}
            className={`pagination-item ${
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
                ? "disabled"
                : ""
            }`}
          >
            <button
              style={paginationButtonStyles}
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
            >
              Next
            </button>
          </li>
        </ul>
      </div>

      <button
        className="bg-transparent border border-purple-600 text-purple-600 px-4 py-2 rounded-lg flex items-center justify-center absolute bottom-4 right-4 hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out focus:outline-none"
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}
        onClick={generateReport}
      >
        <FaFileAlt /> <span className="ml-2">Generate Report</span>
      </button>
    </div>
  );
}

export default Table;
