import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const generateReport = () => {
    const doc = new jsPDF();
    const tableRows = [];
    const tableColumns = [
      { title: "Date", dataKey: "date" },
      { title: "Station Code", dataKey: "STATION CODE" },
      { title: "Locations", dataKey: "LOCATIONS" },
      { title: "State", dataKey: "STATE" },
      { title: "Temp", dataKey: "Temp" },
      { title: "D.O. (mg/l)", dataKey: "D.O. (mg/l)" },
      { title: "PH", dataKey: "PH" },
      {
        title: "Conductivity (Âµmhos/cm)",
        dataKey: "CONDUCTIVITY (Âµmhos/cm)",
      },
      { title: "B.O.D. (mg/l)", dataKey: "B.O.D. (mg/l)" },
      {
        title: "NITRATENAN N+ NITRITENANN (mg/l)",
        dataKey: "NITRATENAN N+ NITRITENANN (mg/l)",
      },
      {
        title: "Fecal Coliform (MPN/100ml)",
        dataKey: "FECAL COLIFORM (MPN/100ml)",
      },
      {
        title: "Total Coliform (MPN/100ml)Mean",
        dataKey: "TOTAL COLIFORM (MPN/100ml)Mean",
      },
      { title: "Year", dataKey: "year" },
    ];

    data.forEach((row) => {
      const rowData = {};
      tableColumns.forEach((column) => {
        rowData[column.dataKey] = row[column.dataKey];
      });
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumns.map((column) => column.title)],
      body: tableRows.map((row) =>
        tableColumns.map((column) => row[column.dataKey])
      ),
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { top: 20, right: 10, bottom: 20, left: 10 },
      showHead: "firstPage",
      headStyles: {
        fillColor: [103, 58, 183],
        textColor: [255, 255, 255],
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: { textColor: [0, 0, 0], fontSize: 8, halign: "center" },
      columnStyles: { year: { fontStyle: "bold" } },
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        const header = "Water Quality Data";
        const pageWidth = doc.internal.pageSize.width;
        const textWidth =
          (doc.getStringUnitWidth(header) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const textOffset = (pageWidth - textWidth) / 2;
        doc.text(header, textOffset, 10);

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(12);
        const footer = pageCount + " page(s)";
        doc.text(footer, 10, doc.internal.pageSize.height - 10);
      },
    });

    doc.save("data.pdf");
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
    width: "50px", // Adjust as needed
    height: "40px", // Adjust as needed
    backgroundColor: "#D6BCFA", // Light purple color, matching the table header
    border: "1px solid #D1D5DB",
    margin: "3px",
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
      <div
        style={styling.inputContainer}
        className="InputContainer flex mb-4"
      >
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
              <tr
                key={index}
                className="hover:bg-gray-50"
              >
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

      <div className="flex items-center justify-center mt-4">
        {/* Previous Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev === 1 ? prev : prev - 1))
          }
          disabled={currentPage === 1}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center mr-4"
        >
          Prev
        </button>

        {/* Page Input */}
        <div className="relative">
          <input
            placeholder="Page"
            className="input appearance-none border border-gray-400 rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            name="text"
            min="1"
            max={Math.ceil(filteredData.length / itemsPerPage)}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              setCurrentPage(
                page > 0
                  ? page > Math.ceil(filteredData.length / itemsPerPage)
                    ? Math.ceil(filteredData.length / itemsPerPage)
                    : page
                  : 1
              );
            }}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev === Math.ceil(filteredData.length / itemsPerPage)
                ? prev
                : prev + 1
            )
          }
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center ml-4"
        >
          Next
        </button>
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
