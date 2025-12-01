import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ session, setSession }) => {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileUsersOpen, setMobileUsersOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  const analyticsRef = useRef(null);
  const usersRef = useRef(null);
  const accountRef = useRef(null);
  const menuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analyticsRef.current && !analyticsRef.current.contains(event.target))
        setAnalyticsOpen(false);
      if (usersRef.current && !usersRef.current.contains(event.target))
        setUsersOpen(false);
      if (accountRef.current && !accountRef.current.contains(event.target))
        setAccountOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    if (path === "/" || path === "/dashboard") return "Company";
    if (path.includes("/employees")) return "Employees";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/products")) return "Products";
    if (path.includes("/users")) return "Users";
    if (path.includes("/attendance")) return "Attendance";
    return "Company";
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    setSession(null);
    navigate("/signup", { replace: true });
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setAnalyticsOpen(false);
    setUsersOpen(false);
    setAccountOpen(false);
    setMobileProjectsOpen(false);
    setMobileUsersOpen(false);
    setMobileAccountOpen(false);
  };

  if (!session) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-emerald-700 text-white shadow-lg rounded-b-xl transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Page Title */}
          <div
            onClick={() => handleNav("/dashboard")}
            className="flex-shrink-0 text-xl font-bold cursor-pointer hover:text-emerald-300 transition-colors"
          >
            {getPageTitle()}
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none text-white text-2xl cursor-pointer transition-transform duration-300 ease-in-out"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNav("/dashboard")}
              className={`transition-colors cursor-pointer ${
                isActive("/dashboard") ? "underline decoration-2 decoration-emerald-200" : "hover:text-emerald-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNav("/employees")}
              className={`transition-colors cursor-pointer ${
                isActive("/employees") ? "underline decoration-2 decoration-emerald-200" : "hover:text-emerald-300"
              }`}
            >
              Employees
            </button>

            {/* Projects Dropdown */}
            <div ref={analyticsRef} className="relative">
              <button
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>Projects</span>
                <FaChevronDown
                  className={`text-sm transition-transform duration-300 ${analyticsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute mt-2 w-44 bg-emerald-600 rounded-lg shadow-lg z-50 origin-top transition-all duration-300 ease-in-out transform ${
                  analyticsOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
                }`}
              >
                {["overview", "reports", "stats"].map((p, idx, arr) => (
                  <button
                    key={p}
                    onClick={() => handleNav(`/projects/${p}`)}
                    className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 transition cursor-pointer ${
                      idx === 0 ? "rounded-t-lg" : idx === arr.length - 1 ? "rounded-b-lg" : ""
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNav("/products")}
              className={`transition-colors cursor-pointer ${
                isActive("/products") ? "underline decoration-2 decoration-emerald-200" : "hover:text-emerald-300"
              }`}
            >
              Products
            </button>

            <button
              onClick={() => handleNav("/notifications")}
              className={`transition-colors cursor-pointer ${
                isActive("/notifications") ? "underline decoration-2 decoration-emerald-200" : "hover:text-emerald-300"
              }`}
            >
              Notifications
            </button>

            <button
              onClick={() => handleNav("/attendance")}
              className={`transition-colors cursor-pointer ${
                isActive("/attendance") ? "underline decoration-2 decoration-emerald-200" : "hover:text-emerald-300"
              }`}
            >
              Attendance
            </button>

            {/* User Profile */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="focus:outline-none rounded-full overflow-hidden w-10 h-10 border-2 border-emerald-500 hover:border-emerald-300 transition"
              >
                <img
                  src={session.user.avatar || "https://i.pravatar.cc/150?img=12"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 bg-emerald-600 rounded-lg shadow-lg z-50 origin-top transition-all duration-300 ease-in-out transform ${
                  accountOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
                }`}
              >
                <div className="px-4 py-3 border-b border-emerald-500">
                  <p className="text-sm font-semibold">{session.user.email}</p>
                  <p className="text-xs text-emerald-200">{session.user.role || "User"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-500 transition cursor-pointer rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden bg-emerald-600 overflow-hidden rounded-b-xl transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Dashboard */}
        <button
          onClick={() => handleNav("/dashboard")}
          className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 transition cursor-pointer ${
            isActive("/dashboard") ? "bg-emerald-500" : ""
          }`}
        >
          Dashboard
        </button>

        {/* Employees */}
        <button
          onClick={() => handleNav("/employees")}
          className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 transition cursor-pointer ${
            isActive("/employees") ? "bg-emerald-500" : ""
          }`}
        >
          Employees
        </button>

        {/* Projects */}
        <div className="border-t border-emerald-500">
          <button
            onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
            className="w-full flex justify-between items-center px-4 py-2 hover:bg-emerald-500 transition cursor-pointer"
          >
            <span>Projects</span>
            <FaChevronDown
              className={`transition-transform duration-300 ${mobileProjectsOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`bg-emerald-500 overflow-hidden transition-all duration-300 ease-in-out ${
              mobileProjectsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            } rounded-b-lg`}
          >
            {["overview", "reports", "stats"].map((p, idx, arr) => (
              <button
                key={p}
                onClick={() => handleNav(`/projects/${p}`)}
                className={`block w-full text-left px-6 py-2 hover:bg-emerald-400 transition cursor-pointer ${
                  idx === 0 ? "rounded-t-lg" : idx === arr.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <button
          onClick={() => handleNav("/products")}
          className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 border-t border-emerald-500 transition cursor-pointer ${
            isActive("/products") ? "bg-emerald-500" : ""
          }`}
        >
          Products
        </button>

        {/* Users */}
        <button
          onClick={() => handleNav("/notifications")}
          className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 border-t border-emerald-500 transition cursor-pointer ${
            isActive("/notifications") ? "bg-emerald-500" : ""
          }`}
        >
          Notifications
        </button>
        {/* Attendance */}
        <button
          onClick={() => handleNav("/attendance")}
          className={`block w-full text-left px-4 py-2 hover:bg-emerald-500 border-t border-emerald-500 transition cursor-pointer ${
            isActive("/attendance") ? "bg-emerald-500" : ""
          }`}
        >
          Attendance
        </button>

        {/* Account */}
        <div className="border-t border-emerald-500">
          <button
            onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
            className="w-full flex justify-between items-center px-4 py-2 hover:bg-emerald-500 transition cursor-pointer"
          >
            <span>Account</span>
            <FaChevronDown
              className={`transition-transform duration-300 ${mobileAccountOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`bg-emerald-500 overflow-hidden transition-all duration-300 ease-in-out ${
              mobileAccountOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            } rounded-b-lg`}
          >
            <div className="px-4 py-2 border-b border-emerald-400">
              <p className="text-sm font-semibold">{session.user.email}</p>
              <p className="text-xs text-emerald-200">{session.user.role || "User"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-emerald-400 transition cursor-pointer rounded-b-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
