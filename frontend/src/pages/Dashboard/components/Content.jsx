import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import RoomList from "../RoomList";

const Content = () => {
  const containerRef = useRef(null);

  const boards = [
    {
      id: 1,
      title: "Q3 Marketing Site",
      time: "Updated 2h ago",
      color: "bg-amber-100",
    },
    {
      id: 2,
      title: "App Architecture",
      time: "Updated 5h ago",
      color: "bg-blue-100",
    },
    {
      id: 3,
      title: "User Flow Brainstorm",
      time: "Updated 1d ago",
      color: "bg-pink-100",
    },
    {
      id: 4,
      title: "Design System V2",
      time: "Updated 2d ago",
      color: "bg-green-100",
    },
  ];

  // GSAP Entrance Animation
  useLayoutEffect(() => {
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
          clearProps: "all", // Clears GSAP inline styles so Tailwind hover works after animation
        },
      );

      gsap.fromTo(
        ".header-text",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup!
  }, []);

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

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`board-card cursor-pointer ${board.color} border-2 border-zinc-800 rounded-[32px] p-6 h-56 flex flex-col justify-between shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200`}
          >
            <div className="w-full h-1/2 bg-white/40 border border-zinc-800/20 rounded-[16px] mb-4 dashed-bg"></div>
            <div>
              <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight mb-1">
                {board.title}
              </h3>
              <p className="text-sm font-poppins text-zinc-600">{board.time}</p>
            </div>
          </div>
        ))}
      </div>
      <RoomList />
    </main>
  );
};

export default Content;
