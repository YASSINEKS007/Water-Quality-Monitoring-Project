import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { MdDashboard } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { FaQuestion } from "react-icons/fa";
import { useState } from "react"; // Import useState hook

const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false); // State to track popup visibility
  const [isSecondPopupOpen, setSecondPopupOpen] = useState(false); // State to track second popup visibility

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-purple-600 text-white hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300"
      : "text-black hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300";

  const openModal = () => {
    setPopupOpen(true); // Function to open the popup
  };

  const closeModal = () => {
    setPopupOpen(false); // Function to close the popup
  };

  const openSecondModal = () => {
    setSecondPopupOpen(true); // Function to open the second popup
  };

  const closeSecondModal = () => {
    setSecondPopupOpen(false); // Function to close the second popup
  };

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const [activeTab2, setActiveTab2] = useState(0); // State to manage active tab index

  // Function to generate dummy dashboard cards data
  const generateDashboardCards = () => {
    const data = [
      {
        title: "Temperature Widget",
        description:
          "The Temperature widget provides users with real-time information about the current water temperature in Celsius. Users have the option to switch between Celsius and Fahrenheit measurements based on their preference, ensuring flexibility in viewing temperature data.",
      },
      {
        title: "WQI Widget",
        description:
          "The WQI (Water Quality Index) widget offers users a snapshot of the current water quality index. Utilizing advanced Machine Learning algorithms, specifically Multilayer Perceptron, the WQI is predicted rather than computed. Users can also explore historical WQI data by selecting a specific date from the drop-down menu on the top right of the widget.",
      },
      {
        title: "Statistics Widget",
        description:
          "The statistic widget provides users with an interactive interface to explore statistical data effortlessly. Users can select different statistical metrics from a dropdown menu, and the widget dynamically updates to display corresponding data. It also offers a feature to explore detailed statistics for each metric through a pop-up window, enhancing user engagement and facilitating in-depth data analysis.",
      },
      {
        title: "Time Series Widget",
        description:
          "The Time Series widget plots the yearly evolution of a selected water parameter, enabling users tovisualize trends and patterns over time. Users can explore various water parameters by selectingoptions from the drop-down menu at the top left of the widget, providing a comprehensive view oftemporal changes in water quality",
      },
      {
        title: "Distribution Widget",
        description:
          "The Distribution widget illustrates the evolution of a specific water parameter during a choseninterval, offering users insights into how the parameter fluctuates over time. Users can exploretrends in different water parameters by selecting options from the drop-down menu at the top left ofthe widget. Additionally, users can adjust the time interval displayed using the drop-down menu atthe top right, providing further customization and control over the visualization.",
      },
    ];
    return data;
  };

  const dashboardCards = generateDashboardCards();

  const [expandedCards, setExpandedCards] = useState(new Array(dashboardCards.length).fill(false));

  const toggleCardExpansion = (index) => {
    const newExpandedCards = [...expandedCards];
    newExpandedCards[index] = !newExpandedCards[index];
    setExpandedCards(newExpandedCards);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink className="flex items-center" to="/">
              <img className="h-10 w-auto" src={logo} alt="WQMS" />
              <span className="text-black-600 text-lg font-semibold ml-2">
                Aqua Sentinel
              </span>
            </NavLink>
          </div>
          <div className="absolute left-0 right-0 mx-auto flex justify-center">
            {" "}
            {/* Utilize absolute positioning */}
            <NavLink to="/" className={linkClass}>
              <MdDashboard className="mr-1" /> Dashboard
            </NavLink>
            <NavLink to="/measurements" className={linkClass}>
              <CiBoxList className="mr-1" /> Measurements
            </NavLink>
          </div>
          <div className="flex items-center">
            <FaQuestion
              className="text-purple-600 text-2xl animate-bounce cursor-pointer"
              onClick={openModal}
            />
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-white z-50">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl shadow-lg">
            {/* Tabs with Full Width */}
            <div className="w-full">
              <ul className="flex justify-center text-sm font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li className="me-2 flex-grow">
                  <button
                    className={`inline-block w-full py-4 transition duration-300 ${
                      activeTab === 0
                        ? "text-purple-600"
                        : "hover:text-purple-600 hover:bg-gray-100"
                    } focus:outline-none`}
                    onClick={() => setActiveTab(0)}
                  >
                    About Aqua Sentinel
                  </button>
                </li>
                <li className="me-2 flex-grow">
                  <button
                    className={`inline-block w-full py-4 transition duration-300 ${
                      activeTab === 1
                        ? "text-purple-600"
                        : "hover:text-purple-600 hover:bg-gray-100"
                    } focus:outline-none`}
                    onClick={() => setActiveTab(1)}
                  >
                    Our Mission
                  </button>
                </li>
                <li className="me-2 flex-grow">
                  <button
                    className={`inline-block w-full py-4 transition duration-300 ${
                      activeTab === 2
                        ? "text-purple-600"
                        : "hover:text-purple-600 hover:bg-gray-100"
                    } focus:outline-none`}
                    onClick={() => setActiveTab(2)}
                  >
                    Getting Started
                  </button>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="p-4">
              <div
                className={`mb-8 ${
                  activeTab !== 0 ? "hidden" : ""
                } text-center`}
              >
                {/* About Aqua Sentinel */}
                <h1 className="text-3xl font-semibold text-purple-600 mb-4">
                  Welcome to Aqua Sentinel
                </h1>
                <p className="text-lg leading-relaxed text-gray-600">
                  Aqua Sentinel is a web application designed to simplify water
                  quality monitoring using machine learning algorithms. With
                  Aqua Sentinel, you can access real-time predictions of the
                  water quality index (WQI) without the need for complex manual
                  analysis. Our platform offers a range of features aimed at
                  supporting users in effectively monitoring and analyzing water
                  quality data. Whether you're a researcher, environmentalist,
                  or water resource manager, Aqua Sentinel provides tools to
                  facilitate data visualization and trend analysis. Join us at
                  Aqua Sentinel and explore our user-friendly interface and
                  functionality for efficient water quality monitoring.
                </p>
              </div>

              <div
                className={`mb-8 ${
                  activeTab !== 1 ? "hidden" : ""
                } text-center`}
              >
                {/* Our Mission */}
                <h1 className="text-3xl font-semibold text-purple-600 mb-4">
                  Our Mission
                </h1>
                <p className="text-lg leading-relaxed text-gray-600">
                  At Aqua Sentinel, our mission is twofold: to provide advanced
                  tools for real-time water quality monitoring and to advocate
                  for the preservation of water resources. We understand the
                  critical importance of clean water for ecosystems,
                  agriculture, industry, and human health. By leveraging
                  cutting-edge technology, including machine learning
                  algorithms, we empower users to monitor water quality
                  efficiently and make informed decisions to protect and
                  conserve this vital resource. Our goal is to inspire action
                  towards sustainable water management practices, ensuring
                  access to clean and safe water for present and future
                  generations.
                </p>
              </div>

              <div
                className={`mb-8 ${
                  activeTab !== 2 ? "hidden" : ""
                } text-center`}
              >
                {/* Getting Started */}
                <h1 className="text-3xl font-semibold text-purple-600 mb-4">
                  Getting Started with Aqua Sentinel
                </h1>
                <p className="text-lg leading-relaxed text-gray-600">
                  Aqua Sentinel offers users two distinct methods to track water
                  physicochemical properties. The Dashboard tab provides a
                  dynamic interface equipped with multiple widgets, enabling
                  users to analyze and visualize fluctuations in water quality
                  over time. Here, users can access a comprehensive overview of
                  key parameters, facilitating quick and intuitive assessments
                  of water health. In contrast, the Measurements tab offers a
                  detailed list of explicit measurements, providing users with
                  specific data points for in-depth analysis and comparison
                </p>
                <div className="bg-white px-8 py-6 flex justify-center">
                  {" "}
                  {/* Modified this line */}
                  <button
                    onClick={openSecondModal}
                    className="text-lg font-medium text-purple-600 py-3 px-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-600 hover:text-white rounded"
                  >
                    Click here for more details
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white px-8 py-2 flex justify-end">
              <button
                onClick={closeModal}
                className="text-lg font-medium text-purple-600 py-3 px-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-600 hover:text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isSecondPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-gray-900 z-50">
        <div className="bg-white rounded-lg overflow-y-auto max-h-96 w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl shadow-lg">
            <div className="w-full">
              <ul className="flex justify-center text-sm font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li className="me-2 flex-grow">
                  <button
                    className={`inline-block w-full py-4 transition duration-300 ${
                      activeTab2 === 0
                        ? "text-purple-600"
                        : "hover:text-purple-600 hover:bg-gray-100"
                    } focus:outline-none`}
                    onClick={() => setActiveTab2(0)}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="me-2 flex-grow">
                  <button
                    className={`inline-block w-full py-4 transition duration-300 ${
                      activeTab2 === 1
                        ? "text-purple-600"
                        : "hover:text-purple-600 hover:bg-gray-100"
                    } focus:outline-none`}
                    onClick={() => setActiveTab2(1)}
                  >
                    Measurements
                  </button>
                </li>
              </ul>
            </div>
            <div className={`px-4 py-2 ${activeTab2 !== 0 ? "hidden" : ""}`}>
              <p className="mb-2">
                The Dashboard tab boasts five distinct data visualization
                widgets, each customizable to display various water parameters
                at different points and intervals in time. This feature allows
                users to tailor their analysis precisely to their monitoring
                requirements
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md transition duration-300"
                    onMouseEnter={() => setHoveredCardIndex(index)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {expandedCards[index]
                          ? card.description
                          : card.description.length > 150
                          ? `${card.description.substring(0, 150)}...`
                          : card.description}
                      </p>
                      {card.description.length > 150 && (
                        <button
                          className="text-purple-600 hover:underline mt-2 block"
                          onClick={() => toggleCardExpansion(index)}
                        >
                          {expandedCards[index] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`px-4 py-2 ${activeTab2 !== 1 ? "hidden" : ""}`}>
              <p>
                The Measurements tab within Aqua Sentinel presents users with a
                comprehensive list of explicit measurements, offering specific
                data points for thorough analysis and comparison. Users can
                navigate through the historical data using timestamps or
                keywords, facilitating efficient retrieval of relevant
                information. This functionality allows users to delve deeper
                into the dataset, uncovering trends and patterns over time.
                Additionally, users have the option to save the list of
                measurements in PDF format, enabling easy sharing and
                documentation of findings. With the Measurements tab, users can
                access detailed data and insights to support their water quality
                monitoring efforts effectively
              </p>
            </div>
            <div className="bg-white px-4 py-2 flex justify-end">
              <button
                onClick={closeSecondModal}
                className="text-sm font-medium text-purple-600 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-600 hover:text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
