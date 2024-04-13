import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { MdDashboard } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { FaQuestion } from "react-icons/fa";

const Navbar2 = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-purple-600 text-black hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300'
      : 'text-black hover:bg-purple-700 hover:text-white rounded-md px-3 py-2 flex items-center justify-center transition duration-300';

  return (
    <nav className='bg-white shadow-md'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <NavLink className='flex items-center' to='/'>
              <img className='h-10 w-auto' src={logo} alt='WQMS' />
              <span className='text-black-600 text-lg font-semibold ml-2'>Aqua Sentinel</span>
            </NavLink>
          </div>
          <div className='flex flex-grow justify-center'> {/* Utilize flex-grow to expand remaining space */}
            <div className='flex items-center'> {/* Nested div to separate links from span */}
              <NavLink to='/' className={linkClass}>
                <MdDashboard className="mr-1" /> Dashboard
              </NavLink>
              <NavLink to='/measurements' className={linkClass}>
                <CiBoxList className="mr-1" /> Measurements
              </NavLink>
            </div>
          </div>
          <div className='flex items-center justify-center'> {/* Center align the question icon */}
            <FaQuestion className='text-purple-600 text-2xl animate-bounce' />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar2;
