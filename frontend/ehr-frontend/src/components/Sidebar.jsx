import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaPlusCircle,
  FaFolderOpen,
  FaShieldAlt,
  FaUserPlus,
  FaCubes
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/dashboard",   icon: <FaChartPie />,    label: "Dashboard" },
  { to: "/records",     icon: <FaFolderOpen />,  label: "View Records" },
  { to: "/add",         icon: <FaPlusCircle />,  label: "Add Record" },
  { to: "/add-patient", icon: <FaUserPlus />,    label: "Patients" },
  { to: "/verify",      icon: <FaShieldAlt />,   label: "Verify Integrity" },
  { to: "/blockchain",  icon: <FaCubes />,       label: "Blockchain Log" },
];

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-[color:var(--bg-sidebar)] text-white h-screen flex flex-col justify-between p-6 shadow-xl sticky top-0 border-r border-[color:var(--border-color)]">

      {/* Logo */}
      <div>
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-wide text-white">Secure EHR</h2>
          <p className="text-xs text-[color:var(--text-muted)] mt-1">Blockchain-powered Health Records</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(to)
                  ? "bg-[color:var(--accent-primary)] text-white shadow-md"
                  : "text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-card)] hover:text-white hover:translate-x-1"}`}
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              {label}
            </Link>
          ))}

          {/* Explicit Logout Execution */}
          <button
              onClick={() => {
                localStorage.removeItem('ehr-role');
                localStorage.removeItem('ehr-username');
                window.location.href = '/login';
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mt-4 text-red-400 hover:bg-[color:var(--bg-card)] hover:text-red-300 w-full text-left"
          >
             <span className="text-base flex-shrink-0">⏏️</span>
             Logout
          </button>
        </nav>
      </div>

      {/* Theme & Footer Stack */}
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-[color:var(--bg-card)] p-3 rounded-xl border border-[color:var(--border-color)]">
          <span className="text-xs font-semibold text-[color:var(--text-primary)]">Theme</span>
          <ThemeToggle />
        </div>

        <div className="text-xs text-[color:var(--text-muted)] border-t border-[color:var(--border-color)] pt-4 space-y-1">
          <p className="font-semibold text-[color:var(--text-secondary)]">Blockchain Status</p>
          <p className="text-green-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Connected
          </p>
          <p className="text-[color:var(--text-muted)] mt-2 opacity-50">ehr_system • MySQL 8.0</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;