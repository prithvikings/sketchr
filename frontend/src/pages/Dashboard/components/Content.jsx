import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import RoomList from "../RoomList";
import api from "../../../services/api";

const Content = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from your backend
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

  // GSAP Entrance Animation
  useLayoutEffect(() => {
    if (isLoading) return; // Wait for DOM to render before animating

    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".board-card",
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
        ".header-text",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, boards.length]);

  // Helper to assign random brutalist colors
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

  // Grab the 4 most recent boards for the top grid
  const recentBoards = boards.slice(0, 4);

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* Header */}
      <div className="mb-10 header-text">
        <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2">
          Recent Boards
        </h2>
        <p className="text-zinc-600 font-poppins text-lg">
          Pick up right where you left off.
        </p>
      </div>

      {isLoading ? (
        <div className="font-instrument text-xl animate-pulse text-zinc-500 mb-10">
          Loading workspace...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recentBoards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/room/${board._id}`)}
              className={`board-card cursor-pointer ${getBoardColor(board._id)} border-2 border-zinc-800 rounded-[32px] p-6 h-56 flex flex-col justify-between shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200`}
            >
              <div className="w-full h-1/2 bg-white/40 border-2 border-dashed border-zinc-800/20 rounded-[16px] mb-4"></div>
              <div>
                <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight mb-1 truncate pr-2">
                  {board.name}
                </h3>
                <p className="text-sm font-poppins text-zinc-600">
                  Updated {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pass the fetched data down to RoomList */}
      <RoomList rooms={boards} isLoading={isLoading} />
    </main>
  );
};

export default Content;
