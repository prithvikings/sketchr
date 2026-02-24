import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  // Changed to an array of objects to map names to actual paths
  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "My Boards", path: "/dashboard/boards" }, // Placeholder path
    { name: "Templates", path: "/dashboard/templates" }, // Placeholder path
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <aside className="w-72 h-full bg-secondarybackground border-r-1 border-dashed border-zinc-400 p-6 flex flex-col justify-between z-20">
      <div>
        <div className="mb-12 px-2">
          <Link
            to="/dashboard"
            className="font-instrument text-4xl font-medium tracking-tight text-zinc-900"
          >
            Sketchr.
          </Link>
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              // 'end' prevents /dashboard (Home) from staying active when on child routes like /dashboard/settings
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `block w-full text-left px-6 py-3 rounded-[32px] border-2 border-zinc-800 font-poppins font-medium transition-all duration-200 
                ${
                  isActive
                    ? "bg-amber-200 shadow-[4px_4px_0px_#27272a] -translate-y-0.5 text-zinc-900"
                    : "bg-transparent hover:bg-zinc-100 hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 text-zinc-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Upgrade Card */}
      <div className="bg-pink-100 border-2 border-zinc-800 rounded-[32px] p-6 shadow-[6px_6px_0px_#27272a]">
        <h3 className="font-instrument text-xl font-bold mb-2">Go Pro!</h3>
        <p className="text-sm text-zinc-600 mb-4">
          Unlock unlimited boards and team members.
        </p>
        <button className="w-full bg-zinc-900 text-white rounded-[32px] py-2 font-bold hover:shadow-[4px_4px_0px_#fcd34d] transition-all">
          Upgrade
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
