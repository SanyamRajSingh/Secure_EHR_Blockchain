import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaPlusCircle,
  FaFolderOpen,
  FaShieldAlt
} from "react-icons/fa";

function Sidebar() {

  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${
      location.pathname === path
        ? "bg-blue-600 shadow-md"
        : "hover:bg-gray-700 hover:translate-x-1"
    }`;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col justify-between p-6 shadow-xl">

      {/* Logo / Title */}
      <div>
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Secure EHR
        </h2>

        <nav className="flex flex-col gap-3">

          <Link to="/" className={linkStyle("/")}>
            <FaChartPie />
            Dashboard
          </Link>

          <Link to="/add" className={linkStyle("/add")}>
            <FaPlusCircle />
            Add Record
          </Link>

          <Link to="/records" className={linkStyle("/records")}>
            <FaFolderOpen />
            View Records
          </Link>

          <Link to="/verify" className={linkStyle("/verify")}>
            <FaShieldAlt />
            Verify Integrity
          </Link>

          <Link to="/add-patient" className={linkStyle("/add-patient")}>
            Add Patient
          </Link>

        </nav>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-400 border-t border-gray-700 pt-4">
        <p>Blockchain Status</p>
        <p className="text-green-400 font-semibold">
          ● Connected
        </p>
      </div>

    </div>
  );
}

export default Sidebar;