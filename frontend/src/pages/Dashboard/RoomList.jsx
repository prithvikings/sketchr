import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const RoomList = ({ rooms, isLoading }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isLoading || !rooms || rooms.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".room-item",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, rooms]);

  const getBoardColor = (id) => {
    const colors = [
      "bg-green-100",
      "bg-blue-100",
      "bg-amber-100",
      "bg-pink-100",
      "bg-purple-100",
    ];
    const charCode = id.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  if (isLoading || !rooms || rooms.length === 0) return null;

  const activeRooms = rooms.slice(0, 5);

  return (
    <div
      ref={containerRef}
      className="mt-16 w-full pb-12 max-md:mt-8 max-md:pb-6"
    >
      {/* Section Header with Dashed Divider */}
      <div className="flex items-end justify-between mb-8 border-b-1 border-dashed border-zinc-400 pb-4 max-md:mb-4 max-md:pb-2">
        <div>
          <h2 className="font-instrument text-3xl font-bold text-zinc-900 max-md:text-2xl">
            Active Rooms
          </h2>
          <p className="text-zinc-600 font-poppins text-lg mt-1 max-md:text-sm">
            Jump into a live session.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/boards")}
          className="hidden md:block px-5 py-2 bg-white border-2 border-zinc-800 rounded-[32px] font-bold text-zinc-800 shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-0.5 transition-all"
        >
          View All
        </button>
      </div>

      {/* Room List */}
      <div className="flex flex-col gap-6 max-md:gap-4">
        {activeRooms.map((room) => (
          <div
            key={room._id}
            className="room-item flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-2 border-zinc-800 rounded-[32px] shadow-[6px_6px_0px_#27272a] hover:shadow-[10px_10px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 max-md:p-4 max-md:shadow-[4px_4px_0px_#27272a]"
          >
            {/* Room Info */}
            <div className="flex items-center gap-5 mb-6 md:mb-0 max-md:gap-3 max-md:mb-4">
              <div
                className={`w-14 h-14 rounded-[20px] border-2 border-zinc-800 flex items-center justify-center shadow-[4px_4px_0px_#27272a] max-md:w-12 max-md:h-12 max-md:shadow-[2px_2px_0px_#27272a] ${getBoardColor(room._id)}`}
              >
                <span className="font-instrument text-2xl font-bold text-zinc-900 uppercase max-md:text-xl">
                  {room.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 font-poppins text-xl max-md:text-lg">
                  {room.name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 max-md:mt-0.5">
                  <span className="flex h-3 w-3 relative max-md:h-2 max-md:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-zinc-900 max-md:h-2 max-md:w-2"></span>
                  </span>
                  <span className="text-sm text-zinc-600 font-poppins font-medium max-md:text-xs">
                    Live • {room.participants?.length || 1} members
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate(`/room/${room._id}`)}
              className="w-full md:w-auto px-8 py-3 bg-zinc-900 text-white rounded-[32px] font-bold border-2 border-zinc-900 hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all max-md:py-2"
            >
              Join Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
