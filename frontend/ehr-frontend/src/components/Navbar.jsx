import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">

      {/* Left side */}
      <div className="text-lg font-semibold text-gray-700">
        Secure EHR Management System
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6 text-gray-600">

        <div className="cursor-pointer hover:text-black">
          <FaBell size={18} />
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-black">
          <FaUserCircle size={20} />
          <span className="text-sm font-medium">
            Admin
          </span>
        </div>

      </div>

    </div>
  );
}

export default Navbar;