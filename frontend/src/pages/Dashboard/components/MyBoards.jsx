import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const MyBoards = () => {
  const containerRef = useRef(null);

  const boards = [
    {
      id: 1,
      title: "Q3 Marketing Site",
      updated: "2h ago",
      role: "Owner",
      color: "bg-amber-100",
    },
    {
      id: 2,
      title: "App Architecture",
      updated: "5h ago",
      role: "Editor",
      color: "bg-blue-100",
    },
    {
      id: 3,
      title: "User Flow Brainstorm",
      updated: "1d ago",
      role: "Owner",
      color: "bg-pink-100",
    },
    {
      id: 4,
      title: "Design System V2",
      updated: "2d ago",
      role: "Viewer",
      color: "bg-green-100",
    },
    {
      id: 5,
      title: "Client Pitch Deck",
      updated: "3d ago",
      role: "Owner",
      color: "bg-purple-100",
    },
  ];

  useLayoutEffect(() => {
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
  }, []);

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
            Starred
          </button>
          <button className="px-5 py-2 bg-transparent border-2 border-dashed border-zinc-400 rounded-[24px] font-bold text-zinc-600 hover:border-zinc-800 hover:text-zinc-900 transition-all">
            Shared with me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
        {/* Create New Board Card */}
        <div className="board-item cursor-pointer bg-zinc-50 border-2 border-dashed border-zinc-400 rounded-[32px] p-6 h-64 flex flex-col items-center justify-center hover:bg-zinc-100 hover:border-zinc-800 hover:border-solid hover:shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 transition-all duration-200 group">
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
            key={board.id}
            className={`board-item cursor-pointer ${board.color} border-2 border-zinc-800 rounded-[32px] p-6 h-64 flex flex-col justify-between shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200`}
          >
            {/* Abstract Thumbnail */}
            <div className="w-full h-1/2 bg-white/50 border-2 border-zinc-800/20 rounded-[16px] mb-4 relative overflow-hidden group-hover:border-zinc-800/50 transition-colors">
              <div className="absolute top-3 left-3 w-10 h-10 bg-white border-2 border-zinc-800 rounded-[8px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)]"></div>
              <div className="absolute top-8 left-16 w-16 h-6 bg-amber-200 border-2 border-zinc-800 rounded-[4px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)]"></div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight truncate pr-2">
                  {board.title}
                </h3>
                <button className="text-zinc-900 hover:text-white hover:bg-zinc-900 border-2 border-transparent hover:border-zinc-900 rounded-full w-8 h-8 flex items-center justify-center transition-colors shrink-0">
                  ⋮
                </button>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm font-poppins text-zinc-600">
                  Updated {board.updated}
                </p>
                <span className="text-xs font-bold font-poppins bg-white border-2 border-zinc-800 px-3 py-1 rounded-[16px] shadow-[2px_2px_0px_#27272a]">
                  {board.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MyBoards;
