// Dashboard.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-primarybackground font-poppins text-zinc-900 overflow-hidden">
      {/* Sidebar hidden on small mobile, expandable/visible on md+ */}
      <div className="hidden md:block z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen relative z-10">
        <Topbar />
        {/* Outlet dynamically renders Content or Settings based on the route */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
