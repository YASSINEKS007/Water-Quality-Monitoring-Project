import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { MdDashboard } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { FaQuestion } from "react-icons/fa";
import { useState } from "react"; // Import useState hook

const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false); // State to track popup visibility

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-purple-600 text-black hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300"
      : "text-black hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300";

  const openModal = () => {
    setPopupOpen(true); // Function to open the popup
  };

  const closeModal = () => {
    setPopupOpen(false); // Function to close the popup
  };

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index

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
            <div className="p-8">
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
              </div>
            </div>

            <div className="bg-white px-8 py-6 flex justify-end">
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
    </nav>
  );
};
export default Navbar;
