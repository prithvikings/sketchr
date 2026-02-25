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
  const [filter, setFilter] = useState("all");

  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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

  const filteredBoards = boards.filter((board) => {
    if (filter === "all") return true;
    if (filter === "shared") return board.hostId !== user?.id;
    return true;
  });

  useLayoutEffect(() => {
    if (isLoading) return;

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
  }, [isLoading, filteredBoards.length, filter]);

  const handleCreateRoomSubmit = async () => {
    setIsCreating(true);
    try {
      const name = newBoardName.trim() || "Untitled Board";
      const response = await api.post("/rooms", {
        name,
        maxParticipants: 10,
      });
      const roomId = response.data._id;

      setIsNewBoardOpen(false);
      setNewBoardName("");
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert(error.response?.data?.error || "Failed to create board");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (e, boardId, isHost) => {
    e.stopPropagation();

    if (!isHost) {
      alert("Only the owner can delete this board.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this board? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/rooms/${boardId}`);
      setBoards((prevBoards) => prevBoards.filter((b) => b._id !== boardId));
    } catch (error) {
      console.error("Failed to delete board:", error);
      alert("Failed to delete board.");
    }
  };

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
    <>
      <main
        ref={containerRef}
        className="flex-1 p-8 overflow-y-auto relative bg-primarybackground h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:p-4 max-md:pb-32"
      >
        <div className="mb-10 header-anim flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-md:mb-6 max-md:gap-4">
          <div>
            <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2 max-md:text-3xl">
              My Boards
            </h2>
            <p className="text-zinc-600 font-poppins text-lg max-md:text-sm">
              Organize and manage your workspaces.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 max-md:gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-[24px] font-bold transition-all max-md:px-4 max-md:py-1.5 max-md:text-sm ${
                filter === "all"
                  ? "bg-white border-2 border-zinc-800 text-zinc-900 shadow-[4px_4px_0px_#27272a]"
                  : "bg-transparent border-2 border-dashed border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-900"
              }`}
            >
              All Boards
            </button>
            <button
              onClick={() => setFilter("shared")}
              className={`px-5 py-2 rounded-[24px] font-bold transition-all max-md:px-4 max-md:py-1.5 max-md:text-sm ${
                filter === "shared"
                  ? "bg-white border-2 border-zinc-800 text-zinc-900 shadow-[4px_4px_0px_#27272a]"
                  : "bg-transparent border-2 border-dashed border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-900"
              }`}
            >
              Shared with me
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-20 max-md:py-10">
            <span className="font-instrument text-2xl font-bold animate-pulse text-zinc-500 max-md:text-lg">
              Loading boards...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12 max-md:gap-4 max-md:pb-6">
            {filter === "all" && (
              <div
                onClick={() => setIsNewBoardOpen(true)}
                className="board-item cursor-pointer bg-zinc-50 border-2 border-dashed border-zinc-400 rounded-[32px] p-6 h-64 flex flex-col items-center justify-center hover:bg-zinc-100 hover:border-zinc-800 hover:border-solid hover:shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 transition-all duration-200 group max-md:h-48 max-md:p-4"
              >
                <div className="h-16 w-16 bg-blue-100 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-200 shadow-[4px_4px_0px_#27272a] transition-colors max-md:h-12 max-md:w-12 max-md:mb-2">
                  <span className="text-3xl font-bold text-zinc-900 max-md:text-2xl">
                    +
                  </span>
                </div>
                <h3 className="font-instrument text-xl font-bold text-zinc-900 max-md:text-lg">
                  New Board
                </h3>
                <p className="text-sm font-poppins text-zinc-500 mt-2 max-md:text-xs max-md:mt-1">
                  Start from scratch
                </p>
              </div>
            )}

            {filteredBoards.map((board) => {
              const isHost = board.hostId === user?.id;

              return (
                <div
                  key={board._id}
                  onClick={() => navigate(`/room/${board._id}`)}
                  className={`board-item relative cursor-pointer ${getBoardColor(board._id)} border-2 border-zinc-800 rounded-[32px] p-6 h-64 flex flex-col justify-between shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200 group max-md:h-56 max-md:p-4 max-md:shadow-[4px_4px_0px_#27272a]`}
                >
                  {isHost && (
                    <button
                      onClick={(e) => handleDeleteBoard(e, board._id, isHost)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white border-2 border-zinc-900 rounded-full flex items-center justify-center text-red-500 font-bold opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:scale-110 transition-all z-10 shadow-[2px_2px_0px_#27272a] max-md:opacity-100 max-md:top-2 max-md:right-2"
                      title="Delete Board"
                    >
                      ✕
                    </button>
                  )}

                  <div className="w-full h-1/2 bg-white/50 border-2 border-zinc-800/20 rounded-[16px] mb-4 relative overflow-hidden group-hover:border-zinc-800/50 transition-colors max-md:mb-2">
                    <div className="absolute top-3 left-3 w-10 h-10 bg-white border-2 border-zinc-800 rounded-[8px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)] max-md:w-8 max-md:h-8 max-md:top-2 max-md:left-2"></div>
                    <div className="absolute top-8 left-16 w-16 h-6 bg-zinc-800 border-2 border-zinc-800 rounded-[4px] shadow-[2px_2px_0px_rgba(39,39,42,0.3)] max-md:top-6 max-md:left-12 max-md:w-12 max-md:h-4"></div>
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-2 max-md:mb-1">
                      <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight truncate pr-2 max-md:text-xl">
                        {board.name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-xs font-poppins text-zinc-600 font-bold">
                        {new Date(board.createdAt).toLocaleDateString()}
                      </p>
                      <span className="text-[10px] font-bold font-poppins bg-white border-2 border-zinc-800 px-2 py-1 rounded-[12px] shadow-[2px_2px_0px_#27272a] uppercase">
                        {isHost ? "Owner" : "Guest"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filter === "shared" && filteredBoards.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center max-md:py-8">
                <div className="w-16 h-16 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-full flex items-center justify-center text-2xl mb-4 opacity-50 max-md:w-12 max-md:h-12 max-md:mb-2">
                  👻
                </div>
                <h3 className="font-instrument text-xl font-bold text-zinc-900 mb-2 max-md:text-lg">
                  Nothing here yet
                </h3>
                <p className="text-zinc-500 font-poppins text-sm max-w-sm max-md:text-xs">
                  When teammates invite you to their boards, they will appear
                  here.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* New Board Modal Overlay */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white border-2 border-zinc-800 rounded-[32px] p-8 w-full max-w-md shadow-[12px_12px_0px_#27272a] relative max-md:p-6 max-md:shadow-[6px_6px_0px_#27272a]">
            <button
              onClick={() => setIsNewBoardOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-zinc-100 border-2 border-zinc-800 rounded-full font-bold text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              ✕
            </button>
            <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6 max-md:text-xl max-md:mb-4">
              Create New Board
            </h3>
            <div className="space-y-4 mb-8 max-md:mb-6">
              <div>
                <label className="block text-zinc-900 font-bold mb-2 text-sm font-poppins">
                  Board Name
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g. Project Q1"
                  className="w-full bg-zinc-50 border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins max-md:py-2"
                />
              </div>
            </div>
            <button
              onClick={handleCreateRoomSubmit}
              disabled={isCreating}
              className="w-full py-3 bg-blue-200 border-2 border-zinc-900 text-zinc-900 font-bold font-poppins rounded-[24px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-md:py-2 max-md:shadow-[2px_2px_0px_#27272a]"
            >
              {isCreating ? "Creating..." : "Create & Enter Room"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBoards;
