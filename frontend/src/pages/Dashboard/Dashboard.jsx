import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import homeIcon from "../../assets/home.png";
import clipboardIcon from "../../assets/clipboard.png";
import colourpalletIcon from "../../assets/colourpallet.png";
import settingIcon from "../../assets/setting.png";

const Dashboard = () => {
  const navItems = [
    { name: "Home", path: "/dashboard", icon: homeIcon },
    { name: "Boards", path: "/dashboard/boards", icon: clipboardIcon },
    { name: "Templates", path: "/dashboard/templates", icon: colourpalletIcon },
    { name: "Settings", path: "/dashboard/settings", icon: settingIcon },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-primarybackground font-poppins text-zinc-900 overflow-hidden relative">
      {/* Sidebar hidden on small mobile, expandable/visible on md+ */}
      <div className="hidden md:block z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen relative z-10 max-md:h-[calc(100vh-70px)]">
        <Topbar />
        {/* Outlet dynamically renders Content or Settings based on the route */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <Outlet />
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 w-full h-[70px] bg-white border-t-2 border-zinc-800 flex justify-around items-center z-50 px-2 pb-safe shadow-[0px_-4px_0px_rgba(39,39,42,1)]">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive
                  ? "text-zinc-900 font-bold scale-110 opacity-100"
                  : "text-zinc-500 hover:text-zinc-900 opacity-50 hover:opacity-100"
              }`
            }
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-5 h-5 mb-1 object-contain"
            />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
