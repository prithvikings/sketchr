import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";

const MyBoards = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/rooms");
        setBoards(response.data);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, []);

  useLayoutEffect(() => {
    if (isLoading) return; // Wait for data to load before animating

    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".board-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.5)",
          clearProps: "all",
        },
      );
      gsap.fromTo(
        ".header-anim",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, boards.length]);

  const handleCreateNew = async () => {
    try {
      const response = await api.post("/rooms", {
        name: "New Canvas",
        maxParticipants: 10,
      });
      navigate(`/room/${response.data._id}`);
    } catch (error) {
      alert("Failed to create board");
    }
  };

  // Helper to assign random brutalist colors to boards based on ID
  const getBoardColor = (id) => {
    const colors = [
      "bg-amber-100",
      "bg-blue-100",
      "bg-pink-100",
      "bg-green-100",
      "bg-purple-100",
    ];
    const charCode = id.charCodeAt(id.length - 1);
    return colors[charCode % colors.length];
  };

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* Header & Filters */}
      <div className="mb-10 header-anim flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2">
            My Boards
          </h2>
          <p className="text-zinc-600 font-poppins text-lg">
            Organize and manage your workspaces.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2 bg-white border-2 border-zinc-800 rounded-[24px] font-bold text-zinc-900 shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-0.5 transition-all">
            All Boards
          </button>
          <button className="px-5 py-2 bg-transparent border-2 border-dashed border-zinc-400 rounded-[24px] font-bold text-zinc-600 hover:border-zinc-800 hover:text-zinc-900 transition-all">
            Shared with me
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <span className="font-instrument text-2xl font-bold animate-pulse text-zinc-500">
            Loading boards...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
          {/* Create New Board Card */}
          <div
            onClick={handleCreateNew}
            className="board-item cursor-pointer bg-zinc-50 border-2 border-dashed border-zinc-400 rounded-[32px] p-6 h-64 flex flex-col items-center justify-center hover:bg-zinc-100 hover:border-zinc-800 hover:border-solid hover:shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 transition-all duration-200 group"
          >
            <div className="h-16 w-16 bg-blue-100 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-200 shadow-[4px_4px_0px_#27272a] transition-colors">
              <span className="text-3xl font-bold text-zinc-900">+</span>
            </div>
            <h3 className="font-instrument text-xl font-bold text-zinc-900">
              New Board
            </h3>
            <p className="text-sm font-poppins text-zinc-500 mt-2">
              Start from scratch
            </p>
          </div>

          {/* Existing Boards */}
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/room/${board._id}`)}
              className={`board-item cursor-pointer ${getBoardColor(board._id)} border-2 border-zinc-800 rounded-[32px] p-6 h-64 flex flex-col justify-between shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200`}
            >
              {/* Abstract Thumbnail */}
              <div className="w-full h-1/2 bg-white/50 border-2 border-zinc-800/20 rounded-[16px] mb-4 relative overflow-hidden group-hover:border-zinc-800/50 transition-colors">
                <div className="absolute top-3 left-3 w-10 h-10 bg-white border-2 border-zinc-800 rounded-[8px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)]"></div>
                <div className="absolute top-8 left-16 w-16 h-6 bg-zinc-800 border-2 border-zinc-800 rounded-[4px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)]"></div>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight truncate pr-2">
                    {board.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-xs font-poppins text-zinc-600 font-bold">
                    {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                  <span className="text-[10px] font-bold font-poppins bg-white border-2 border-zinc-800 px-2 py-1 rounded-[12px] shadow-[2px_2px_0px_#27272a] uppercase">
                    {board.hostId === user?.id ? "Owner" : "Guest"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyBoards;
