import React, { useState } from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="h-20 w-full border-b-2 border-dashed border-zinc-400 px-8 flex items-center justify-between shrink-0 bg-primarybackground z-30 relative">
        {/* Mobile Logo */}
        <div className="md:hidden font-instrument text-2xl font-bold text-zinc-900">
          Sketchr.
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-1/3">
          <input
            type="text"
            placeholder="Search boards..."
            className="w-full bg-white border-2 border-zinc-800 rounded-[40px] px-6 py-2 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins placeholder:text-zinc-500"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => setIsJoinOpen(true)}
            className="hidden md:block px-6 py-2 bg-white border-2 border-zinc-800 rounded-[40px] font-bold text-zinc-900 hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all duration-200"
          >
            Join via Code
          </button>

          <button
            onClick={() => setIsNewBoardOpen(true)}
            className="px-6 py-2 bg-blue-100 border-2 border-zinc-800 rounded-[40px] font-bold text-zinc-900 shadow-[4px_4px_0px_#27272a] hover:shadow-[8px_8px_0px_#27272a] hover:-translate-y-1 transition-all duration-200"
          >
            + New Board
          </button>

          {/* Avatar & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-10 w-10 bg-green-100 border-2 border-zinc-800 rounded-full shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] transition-all flex items-center justify-center overflow-hidden"
            >
              <span className="font-instrument font-bold text-zinc-900">A</span>
            </button>

            {/* Profile Popover */}
            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-56 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[8px_8px_0px_#27272a] p-2 flex flex-col z-50">
                <div className="px-4 py-3 border-b-2 border-dashed border-zinc-300 mb-2">
                  <p className="font-bold text-zinc-900 font-poppins text-sm truncate">
                    Alex UI/UX
                  </p>
                  <p className="text-xs text-zinc-500 font-poppins truncate">
                    alex@sketchr.io
                  </p>
                </div>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-zinc-800 hover:bg-zinc-100 rounded-[16px] text-left transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-zinc-800 hover:bg-zinc-100 rounded-[16px] text-left transition-colors"
                >
                  Preferences
                </Link>
                <button className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[16px] text-left transition-colors mt-2">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Join via Code Modal */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-amber-100 border-2 border-zinc-800 rounded-[32px] p-8 w-full max-w-sm shadow-[12px_12px_0px_#27272a] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsJoinOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-white border-2 border-zinc-800 rounded-full font-bold text-zinc-900 hover:bg-zinc-100 hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-2">
              Join a Board
            </h3>
            <p className="text-sm font-poppins text-zinc-700 mb-6">
              Enter the 6-digit access code provided by your team.
            </p>

            <input
              type="text"
              placeholder="e.g. 8X9Y2Z"
              maxLength={6}
              className="w-full bg-white border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-center text-2xl font-bold font-instrument tracking-widest uppercase mb-6"
            />
            <button className="w-full py-3 bg-zinc-900 text-white font-bold font-poppins rounded-[24px] shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all">
              Join Now
            </button>
          </div>
        </div>
      )}

      {/* New Board Modal */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white border-2 border-zinc-800 rounded-[32px] p-8 w-full max-w-md shadow-[12px_12px_0px_#27272a] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsNewBoardOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-zinc-100 border-2 border-zinc-800 rounded-full font-bold text-zinc-900 hover:bg-zinc-200 hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6">
              Create New Board
            </h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-zinc-900 font-bold mb-2 text-sm font-poppins">
                  Board Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Product Roadmap Q4"
                  className="w-full bg-zinc-50 border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins"
                />
              </div>

              <div>
                <label className="block text-zinc-900 font-bold mb-2 text-sm font-poppins">
                  Workspace / Project
                </label>
                <select className="w-full bg-zinc-50 border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins appearance-none cursor-pointer">
                  <option>Personal Sandbox</option>
                  <option>Team Alpha</option>
                  <option>Design System</option>
                </select>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-200 border-2 border-zinc-900 text-zinc-900 font-bold font-poppins rounded-[24px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all">
              Create & Enter Room
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
