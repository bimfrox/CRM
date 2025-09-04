import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  UserPlus,
  CheckSquare,
  Users,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import logo from "../assets/logo/bimfroxlogo1.png";

const Sidepanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 🌟 Top Navbar */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 md:px-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto md:h-10" />
          
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden sm:block text-gray-600 text-sm md:text-base font-medium">
            {today}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1 md:px-4 md:py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 shadow-md transition"
          >
            <LogOut size={18} className="md:hidden" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* 🌟 Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-20 left-4 z-50 md:hidden bg-green-600 text-white p-2 rounded-lg shadow-lg hover:bg-green-700 transition"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* 🌟 Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-xl p-6 transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
        >

          <ul className="space-y-2">
            {[
              { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
              { to: "/list", label: "List", icon: <List size={20} /> },
              { to: "/task", label: "Tasks", icon: <CheckSquare size={20} /> },
              { to: "/team", label: "Team", icon: <Users size={20} /> },
              { to: "/reminder", label: "Reminders", icon: <Bell size={20} /> },

            ].map((item, index) => (  
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "bg-green-600 text-white shadow-md scale-[1.02]"
                        : "text-green-800 hover:bg-green-50 hover:text-green-900"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 🌟 Main Content */}
        <div className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto rounded-tl-2xl md:rounded-none shadow-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidepanel;
