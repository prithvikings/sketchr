import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PropertiesPanel = ({
  activeColor,
  setActiveColor,
  strokeWidth,
  setStrokeWidth,
}) => {
  const colors = [
    "#18181b",
    "#71717a",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
  ];
  const sizes = [
    { id: "S", value: 4 },
    { id: "M", value: 8 },
    { id: "L", value: 16 },
    { id: "XL", value: 24 },
  ];
  return (
    <div className="absolute top-24 right-6 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[6px_6px_0px_#27272a] p-4 flex flex-col gap-4 z-40 ui-panel font-poppins pointer-events-auto">
      <div className="grid grid-cols-3 gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setActiveColor(c)}
            style={{ backgroundColor: c }}
            className={`w-8 h-8 rounded-full border-2 transition-all ${activeColor === c ? "border-zinc-900 scale-110 shadow-[2px_2px_0px_#27272a]" : "border-zinc-300 hover:scale-110"}`}
          />
        ))}
      </div>
      <div className="w-full h-[2px] bg-zinc-200"></div>
      <div className="flex gap-2 justify-between">
        {sizes.map((s) => (
          <button
            key={s.id}
            onClick={() => setStrokeWidth(s.value)}
            className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg border-2 transition-all ${strokeWidth === s.value ? "bg-amber-200 border-zinc-800 shadow-[2px_2px_0px_#27272a]" : "bg-transparent border-transparent text-zinc-600 hover:bg-zinc-100"}`}
          >
            {s.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export const BottomToolbar = ({
  activeTool,
  setActiveTool,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  const mainTools = [
    { id: "cursor", icon: "👆", shortcut: "V" },
    { id: "hand", icon: "🖐", shortcut: "H" },
    { id: "pen", icon: "✏️", shortcut: "P" },
    { id: "eraser", icon: "🧼", shortcut: "E" },
    { id: "square", icon: "⬜", shortcut: "R" },
    { id: "circle", icon: "⭕", shortcut: "O" },
    { id: "arrow", icon: "↗️", shortcut: "A" },
    { id: "text", icon: "T", shortcut: "T" },
    { id: "sticky", icon: "📝", shortcut: "S" },
  ];
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-40 ui-panel font-poppins pointer-events-auto">
      <div className="flex gap-2 bg-white border-2 border-zinc-800 rounded-full px-4 py-2 shadow-[4px_4px_0px_#27272a]">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${!canUndo ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-100"}`}
          title="Undo (Ctrl+Z)"
        >
          ↩️
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${!canRedo ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-100"}`}
          title="Redo (Ctrl+Y)"
        >
          ↪️
        </button>
      </div>
      <div className="flex gap-2 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[6px_6px_0px_#27272a] p-2 overflow-x-auto">
        {mainTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`relative w-12 h-12 shrink-0 flex items-center justify-center rounded-[16px] border-2 transition-all duration-200 text-xl ${activeTool === tool.id ? "bg-amber-200 border-zinc-800 shadow-[4px_4px_0px_#27272a] -translate-y-1" : "bg-transparent border-transparent hover:border-zinc-800 hover:bg-zinc-50"}`}
            title={`Shortcut: ${tool.shortcut}`}
          >
            {tool.icon}
            <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-zinc-500 opacity-60 pointer-events-none">
              {tool.shortcut}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ZoomControls = ({ zoom, setZoom }) => (
  <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white border-2 border-zinc-800 rounded-full px-4 py-2 shadow-[4px_4px_0px_#27272a] z-40 ui-panel font-poppins pointer-events-auto">
    <button
      onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
      className="w-8 h-8 flex items-center justify-center font-bold hover:bg-zinc-100 rounded-full transition-colors"
    >
      -
    </button>
    <span className="text-sm font-bold min-w-[4ch] text-center">
      {Math.round(zoom * 100)}%
    </span>
    <button
      onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
      className="w-8 h-8 flex items-center justify-center font-bold hover:bg-zinc-100 rounded-full transition-colors"
    >
      +
    </button>
  </div>
);

export const Header = ({
  theme,
  isChatOpen,
  setIsChatOpen,
  setIsInviteOpen,
  setIsShareOpen,
  setIsSettingsOpen,
}) => (
  <header
    className={`room-header h-20 w-full border-b-2 border-zinc-800 px-6 flex items-center justify-between shadow-[0px_4px_0px_#27272a] shrink-0 pointer-events-auto z-50 ${theme === "dark" ? "bg-zinc-800" : "bg-[#f4f4f5]"}`}
  >
    <div className="flex items-center gap-4">
      <button className="p-2 border-2 border-zinc-800 bg-white rounded-full hover:shadow-[2px_2px_0px_#27272a] hover:-translate-y-0.5 transition-all text-zinc-900">
        ⬅️
      </button>
      <div>
        <h1
          className={`font-instrument text-2xl font-bold leading-none ${theme === "dark" ? "text-white" : "text-zinc-900"}`}
        >
          Design Sync - Q4
        </h1>
        <span className="text-xs font-bold text-green-600 tracking-wide uppercase">
          Live Session
        </span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="flex items-center -space-x-3 mr-2 cursor-pointer group"
        title="Open Chat"
      >
        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-amber-200 flex items-center justify-center font-bold text-sm text-zinc-900 shadow-[2px_2px_0px_#27272a] relative z-30 group-hover:-translate-y-1 transition-transform">
          U1
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-blue-200 flex items-center justify-center font-bold text-sm text-zinc-900 shadow-[2px_2px_0px_#27272a] relative z-20 group-hover:-translate-y-1 transition-transform">
          U2
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-pink-200 flex items-center justify-center font-bold text-sm text-zinc-900 shadow-[2px_2px_0px_#27272a] relative z-10 group-hover:-translate-y-1 transition-transform">
          U3
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-white flex items-center justify-center font-bold text-sm text-zinc-900 shadow-[2px_2px_0px_#27272a] relative z-0 group-hover:-translate-y-1 transition-transform">
          +3
        </div>
      </div>
      <button
        onClick={() => setIsInviteOpen(true)}
        className="px-4 py-2 bg-white text-zinc-900 border-2 border-zinc-900 rounded-[32px] font-bold hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span> Invite
      </button>
      <button
        onClick={() => setIsShareOpen(true)}
        className="px-6 py-2 bg-zinc-900 text-white border-2 border-zinc-900 rounded-[32px] font-bold hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all duration-200"
      >
        Share
      </button>
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 border-2 border-zinc-800 bg-white rounded-full hover:shadow-[2px_2px_0px_#27272a] hover:-translate-y-0.5 transition-all text-zinc-900"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  </header>
);

export const ChatPanel = ({
  isOpen,
  onClose,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  onStartVideoCall,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-24 right-6 w-80 bg-white border-2 border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#27272a] flex flex-col overflow-hidden z-[60] pointer-events-auto"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-zinc-900 bg-[#f4f4f5] text-zinc-900">
          <h2 className="font-bold text-lg">Room Chat</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={onStartVideoCall}
              className="hover:scale-110 transition-transform text-xl"
              title="Start Video Call"
            >
              📹
            </button>
            <button
              onClick={onClose}
              className="hover:text-red-500 font-bold text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white text-zinc-900">
          {chatMessages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#27272a] text-sm ${m.sender === "You" ? "bg-amber-200 self-end" : "bg-zinc-50 self-start"}`}
            >
              <span className="font-bold block mb-1 text-xs opacity-70">
                {m.sender}
              </span>
              {m.text}
            </div>
          ))}
        </div>
        <div className="p-4 border-t-2 border-zinc-900 bg-[#f4f4f5]">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatInput.trim()) {
                setChatMessages([
                  ...chatMessages,
                  { sender: "You", text: chatInput.trim() },
                ]);
                setChatInput("");
              }
            }}
            className="w-full border-2 border-zinc-900 rounded-xl px-3 py-2 outline-none focus:shadow-[2px_2px_0px_#27272a] transition-shadow bg-white text-zinc-900"
            placeholder="Type a message..."
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const InviteModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-md w-full relative text-zinc-900"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none"
          >
            ✕
          </button>
          <h2 className="font-instrument text-3xl font-bold mb-4">
            Invite Collaborators
          </h2>
          <p className="text-zinc-600 mb-6 font-poppins">
            Share this link with your team to collaborate in real-time.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value="https://sketchr.app/room/sync-q4"
              className="flex-1 border-2 border-zinc-900 rounded-xl px-4 py-2 outline-none bg-zinc-50 font-mono text-sm"
            />
            <button className="px-4 py-2 bg-amber-200 border-2 border-zinc-900 rounded-xl font-bold shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all">
              Copy
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const ShareModal = ({ isOpen, onClose, onExport }) => (
  <AnimatePresence>
    {isOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-md w-full relative text-zinc-900"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none"
          >
            ✕
          </button>
          <h2 className="font-instrument text-3xl font-bold mb-4">
            Export Board
          </h2>
          <p className="text-zinc-600 mb-6 font-poppins">
            Download a local copy of your entire whiteboard to load later.
          </p>
          <button
            onClick={onExport}
            className="w-full px-4 py-3 bg-zinc-900 text-white border-2 border-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-0.5 transition-all"
          >
            Download .sketchr file ⬇️
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const SettingsModal = ({ isOpen, onClose, theme, setTheme }) => (
  <AnimatePresence>
    {isOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-sm w-full relative text-zinc-900 font-poppins"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none"
          >
            ✕
          </button>
          <h2 className="font-instrument text-3xl font-bold mb-6">Settings</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg">Canvas Theme</span>
            <div className="flex bg-zinc-100 border-2 border-zinc-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_#27272a]">
              <button
                onClick={() => setTheme("light")}
                className={`px-4 py-2 font-bold transition-colors ${theme === "light" ? "bg-amber-200 border-r-2 border-zinc-900" : "hover:bg-zinc-200 border-r-2 border-zinc-900"}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-4 py-2 font-bold transition-colors ${theme === "dark" ? "bg-zinc-800 text-white" : "hover:bg-zinc-200"}`}
              >
                Dark
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const VideoCallModal = ({ isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState("u1");

  // Mock participants data
  const participants = [
    { id: "u1", name: "You", initials: "U1", color: "bg-zinc-700" },
    { id: "u2", name: "Alice", initials: "AL", color: "bg-blue-500" },
    { id: "u3", name: "Bob", initials: "BO", color: "bg-pink-500" },
    { id: "u4", name: "Charlie", initials: "CH", color: "bg-amber-500" },
  ];

  if (!isOpen) return null;

  const activeSpeaker = participants.find((p) => p.id === activeSpeakerId);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag
      dragMomentum={false}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-24 left-6 w-96 bg-white border-2 border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#27272a] flex flex-col overflow-hidden z-[80] pointer-events-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b-2 border-zinc-900 bg-[#f4f4f5] text-zinc-900 cursor-grab active:cursor-grabbing">
        <h2 className="font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Huddle ({participants.length})
        </h2>
        <button
          onClick={onClose}
          className="hover:text-red-500 font-bold text-lg leading-none cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Video View */}
      <div className="bg-zinc-900 h-56 flex items-center justify-center relative overflow-hidden">
        {activeSpeaker.id === "u1" && isScreenSharing ? (
          <div className="text-white font-poppins font-bold flex flex-col items-center">
            <span className="text-5xl mb-3">💻</span>
            <span className="bg-amber-400 text-zinc-900 px-3 py-1 rounded-full text-sm">
              Sharing Screen
            </span>
          </div>
        ) : activeSpeaker.id === "u1" && isVideoOff ? (
          <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-3xl border-4 border-zinc-800">
            {activeSpeaker.initials}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`w-24 h-24 rounded-full ${activeSpeaker.color} flex items-center justify-center text-white font-bold text-3xl border-4 border-zinc-900 shadow-[6px_6px_0px_#000]`}
            >
              {activeSpeaker.initials}
            </div>
            <span className="text-white opacity-50 font-poppins text-sm mt-4 animate-pulse">
              Live Feed...
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-zinc-700 text-white text-xs font-poppins font-bold flex items-center gap-2">
          {activeSpeaker.name} {activeSpeaker.id === "u1" && isMuted && "🔇"}
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="bg-zinc-800 p-3 border-b-2 border-zinc-900 flex gap-3 overflow-x-auto custom-scrollbar">
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveSpeakerId(p.id)}
            className={`relative shrink-0 w-24 h-16 rounded-xl border-2 overflow-hidden transition-all ${
              activeSpeakerId === p.id
                ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.3)] -translate-y-1"
                : "border-zinc-600 hover:border-zinc-400 hover:-translate-y-0.5"
            }`}
          >
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
              {p.id === "u1" && isVideoOff ? (
                <span className="text-zinc-500 font-bold">{p.initials}</span>
              ) : (
                <div
                  className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {p.initials}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-white truncate max-w-[calc(100%-8px)]">
              {p.name}
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 bg-[#f4f4f5] flex justify-center gap-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 ${
            isMuted ? "bg-red-200" : "bg-white"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🎤"}
        </button>
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 ${
            isVideoOff ? "bg-red-200" : "bg-white"
          }`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? "🚫" : "📷"}
        </button>
        <button
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            if (!isScreenSharing) setActiveSpeakerId("u1"); // Auto-focus yourself when sharing
          }}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 ${
            isScreenSharing ? "bg-amber-200" : "bg-white"
          }`}
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          💻
        </button>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-[16px] border-2 border-zinc-900 bg-red-500 text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 hover:bg-red-600"
          title="Leave Call"
        >
          📞
        </button>
      </div>
    </motion.div>
  );
};
