import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../services/api";

const Topbar = () => {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ADDED: State to track the input value properly
  const [newBoardName, setNewBoardName] = useState("");

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      // CHANGED: Use the React state instead of document.getElementById
      const name = newBoardName.trim() || "Untitled Board";
      const response = await api.post("/rooms", { name, maxParticipants: 10 });
      const roomId = response.data._id;

      setIsNewBoardOpen(false);
      setNewBoardName(""); // Reset input for next time
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert(error.response?.data?.error || "Failed to create board");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const roomId = e.target.roomCode.value.trim();
    if (roomId) {
      setIsJoinOpen(false);
      navigate(`/room/${roomId}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Backend logout failed, proceeding with local logout");
    } finally {
      logout();
      navigate("/auth");
    }
  };

  return (
    <>
      <header className="h-20 w-full border-b-2 border-dashed border-zinc-400 px-8 flex items-center justify-between shrink-0 bg-primarybackground z-30 relative">
        <div className="md:hidden font-instrument text-2xl font-bold text-zinc-900">
          Sketchr.
        </div>

        <div className="hidden md:flex items-center w-1/3">
          <input
            type="text"
            placeholder="Search boards..."
            className="w-full bg-white border-2 border-zinc-800 rounded-[40px] px-6 py-2 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins placeholder:text-zinc-500"
          />
        </div>

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

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-10 w-10 bg-green-100 border-2 border-zinc-800 rounded-full shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] transition-all flex items-center justify-center overflow-hidden"
            >
              <span className="font-instrument font-bold text-zinc-900 uppercase">
                {user?.fullName?.charAt(0) || "U"}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-56 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[8px_8px_0px_#27272a] p-2 flex flex-col z-50">
                <div className="px-4 py-3 border-b-2 border-dashed border-zinc-300 mb-2">
                  <p className="font-bold text-zinc-900 font-poppins text-sm truncate">
                    {user?.fullName || "Sketchr User"}
                  </p>
                  <p className="text-xs text-zinc-500 font-poppins truncate">
                    {user?.email || "user@example.com"}
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
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[16px] text-left transition-colors mt-2"
                >
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
          <form
            onSubmit={handleJoinRoom}
            className="bg-amber-100 border-2 border-zinc-800 rounded-[32px] p-8 w-full max-w-sm shadow-[12px_12px_0px_#27272a] relative"
          >
            <button
              type="button"
              onClick={() => setIsJoinOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-white border-2 border-zinc-800 rounded-full font-bold text-zinc-900 hover:bg-zinc-100 transition-transform"
            >
              ✕
            </button>
            <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-2">
              Join a Board
            </h3>
            <p className="text-sm font-poppins text-zinc-700 mb-6">
              Enter access code.
            </p>
            <input
              type="text"
              name="roomCode"
              placeholder="e.g. 64a7b8f..."
              required
              className="w-full bg-white border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-center text-xl font-bold font-poppins mb-6"
            />
            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 text-white font-bold font-poppins rounded-[24px] shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all"
            >
              Join Now
            </button>
          </form>
        </div>
      )}

      {/* New Board Modal */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white border-2 border-zinc-800 rounded-[32px] p-8 w-full max-w-md shadow-[12px_12px_0px_#27272a] relative">
            <button
              onClick={() => setIsNewBoardOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-zinc-100 border-2 border-zinc-800 rounded-full font-bold text-zinc-900 hover:bg-zinc-200 transition-colors"
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
                  value={newBoardName} // CHANGED: Tied to state
                  onChange={(e) => setNewBoardName(e.target.value)} // CHANGED: Tied to state
                  placeholder="e.g. Project Q1"
                  className="w-full bg-zinc-50 border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins"
                />
              </div>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full py-3 bg-blue-200 border-2 border-zinc-900 text-zinc-900 font-bold font-poppins rounded-[24px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create & Enter Room"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
