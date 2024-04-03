import React, { useState } from "react";
import { MdDashboard, MdDarkMode, MdLightMode } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function NavBar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navBackgroundColor = darkMode ? "bg-black dark:bg-gray-900" : "bg-white";
  const linkTextColor = darkMode ? "text-white" : "text-black";
  const hoverBackground = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <nav className={`border-gray-200 py-2.5 ${navBackgroundColor}`}>
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-6 mr-3 sm:h-9" alt="Logo" />
          <span className={`text-xl font-semibold whitespace-nowrap ${linkTextColor}`}>
            Landwind
          </span>
        </Link>
        <div className="flex items-center lg:order-2">
          <button
            className={`text-black bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 ${hoverBackground}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? <MdLightMode className="text-white" /> : <MdDarkMode />}
          </button>
        </div>
        <div className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <NavItem darkMode={darkMode} icon={<MdDashboard />} text="Dashboard" to="/" />
            <NavItem darkMode={darkMode} icon={<CiBoxList />} text="Measurements" to="/measurements" />
          </ul>
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ darkMode, icon, text, to }) => {
  const linkTextColor = darkMode ? "text-white" : "text-black";
  const hoverBackground = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center py-2 pl-3 pr-4 ${linkTextColor} rounded lg:bg-transparent lg:text-purple-700 lg:p-0 ${hoverBackground}`}
        aria-current="page"
      >
        {text}
        {icon && <span className="ml-1">{icon}</span>}
      </Link>
    </li>
  );
};

export default NavBar;
