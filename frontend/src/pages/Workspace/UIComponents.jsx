import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import settingIcon from "../../assets/setting.png";
import leftArrow from "../../assets/leftarrow.png";
import leftcurveIcon from "../../assets/leftcurve.png";
import rightcurveIcon from "../../assets/rightcurve.png";
import uprightIcon from "../../assets/upright.png";
import handraiseIcon from "../../assets/handraise.png";
import pencilIcon from "../../assets/pencil.png";
import soapIcon from "../../assets/soap.png";
import circleIcon from "../../assets/circle.png";
import stickyIcon from "../../assets/sticky.png";
import sparklesIcon from "../../assets/sparkles.png";
import callmeIcon from "../../assets/callme.png";
import videocallIcon from "../../assets/videocallicon.png";
import Laptopicon from "../../assets/laptop.png";
import mic from "../../assets/mic.png";
import camera from "../../assets/camera.png";
import mute from "../../assets/mute.png";

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
    <div className="absolute top-24 right-6 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[6px_6px_0px_#27272a] p-4 flex flex-col gap-4 z-40 ui-panel font-poppins pointer-events-auto max-md:top-20 max-md:right-2 max-md:p-2 max-md:gap-2 max-md:shadow-[4px_4px_0px_#27272a] max-md:scale-90 max-md:origin-top-right">
      <div className="grid grid-cols-3 gap-2 max-md:gap-1.5">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setActiveColor(c)}
            style={{ backgroundColor: c }}
            className={`w-8 h-8 rounded-full border-2 transition-all max-md:w-6 max-md:h-6 ${activeColor === c ? "border-zinc-900 scale-110 shadow-[2px_2px_0px_#27272a] max-md:shadow-[1px_1px_0px_#27272a]" : "border-zinc-300 hover:scale-110"}`}
          />
        ))}
      </div>
      <div className="w-full h-[2px] bg-zinc-200"></div>
      <div className="flex gap-2 justify-between max-md:gap-1">
        {sizes.map((s) => (
          <button
            key={s.id}
            onClick={() => setStrokeWidth(s.value)}
            className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg border-2 transition-all max-md:w-6 max-md:h-6 max-md:text-xs ${strokeWidth === s.value ? "bg-amber-200 border-zinc-800 shadow-[2px_2px_0px_#27272a] max-md:shadow-[1px_1px_0px_#27272a]" : "bg-transparent border-transparent text-zinc-600 hover:bg-zinc-100"}`}
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
    {
      id: "cursor",
      icon: (
        <img src={callmeIcon} alt="Cursor" className="w-5 h-5 object-contain" />
      ),
      shortcut: "V",
    },
    {
      id: "hand",
      icon: (
        <img
          src={handraiseIcon}
          alt="Hand"
          className="w-5 h-5 object-contain"
        />
      ),
      shortcut: "H",
    },
    {
      id: "pen",
      icon: (
        <img src={pencilIcon} alt="Pen" className="w-5 h-5 object-contain" />
      ),
      shortcut: "P",
    },
    {
      id: "eraser",
      icon: (
        <img src={soapIcon} alt="Eraser" className="w-5 h-5 object-contain" />
      ),
      shortcut: "E",
    },
    { id: "square", icon: "⬜", shortcut: "R" },
    {
      id: "circle",
      icon: (
        <img src={circleIcon} alt="Circle" className="w-5 h-5 object-contain" />
      ),
      shortcut: "O",
    },
    {
      id: "arrow",
      icon: (
        <img src={uprightIcon} alt="Arrow" className="w-5 h-5 object-contain" />
      ),
      shortcut: "A",
    },
    {
      id: "text",
      icon: <span className="font-bold text-lg font-instrument">T</span>,
      shortcut: "T",
    },
    {
      id: "sticky",
      icon: (
        <img src={stickyIcon} alt="Sticky" className="w-5 h-5 object-contain" />
      ),
      shortcut: "S",
    },
    {
      id: "ai",
      icon: (
        <img src={sparklesIcon} alt="AI" className="w-5 h-5 object-contain" />
      ),
      shortcut: "G",
    },
  ];
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-40 ui-panel font-poppins pointer-events-auto max-md:bottom-4 max-md:gap-2 max-md:w-[95%]">
      <div className="flex gap-2 bg-white border-2 border-zinc-800 rounded-full px-4 py-2 shadow-[4px_4px_0px_#27272a] max-md:py-1 max-md:px-2 max-md:shadow-[2px_2px_0px_#27272a]">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors max-md:w-6 max-md:h-6 ${!canUndo ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-100"}`}
          title="Undo (Ctrl+Z)"
        >
          <img
            src={rightcurveIcon}
            alt="Undo"
            className="w-4 h-4 object-contain max-md:w-3 max-md:h-3"
          />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors max-md:w-6 max-md:h-6 ${!canRedo ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-100"}`}
          title="Redo (Ctrl+Y)"
        >
          <img
            src={leftcurveIcon}
            alt="Redo"
            className="w-4 h-4 object-contain max-md:w-3 max-md:h-3"
          />
        </button>
      </div>
      <div className="flex gap-2 bg-white border-2 border-zinc-800 rounded-[24px] shadow-[6px_6px_0px_#27272a] p-2 overflow-x-auto max-md:w-full max-md:shadow-[4px_4px_0px_#27272a] max-md:rounded-[16px] max-md:py-1 max-md:px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {mainTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`relative w-12 h-12 shrink-0 flex items-center justify-center rounded-[16px] border-2 transition-all duration-200 text-xl max-md:w-10 max-md:h-10 max-md:rounded-[12px] max-md:text-lg ${activeTool === tool.id ? "bg-amber-200 border-zinc-800 shadow-[4px_4px_0px_#27272a] -translate-y-1 max-md:shadow-[2px_2px_0px_#27272a]" : "bg-transparent border-transparent hover:border-zinc-800 hover:bg-zinc-50"}`}
            title={`Shortcut: ${tool.shortcut}`}
          >
            {tool.icon}
            <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-zinc-500 opacity-60 pointer-events-none max-md:hidden">
              {tool.shortcut}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ZoomControls = ({ zoom, setZoom }) => (
  <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white border-2 border-zinc-800 rounded-full px-4 py-2 shadow-[4px_4px_0px_#27272a] z-40 ui-panel font-poppins pointer-events-auto max-md:bottom-24 max-md:right-4 max-md:scale-75 max-md:origin-bottom-right max-md:shadow-[2px_2px_0px_#27272a]">
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
  boardName,
  activeUsers,
  onBack,
  isChatOpen,
  setIsChatOpen,
  setIsInviteOpen,
  setIsShareOpen,
  setIsSettingsOpen,
}) => {
  const displayLimit = 3;
  const visibleUsers = activeUsers.slice(0, displayLimit);
  const extraUsersCount = activeUsers.length - displayLimit;

  return (
    <header
      className={`room-header h-20 w-full border-b-2 border-zinc-800 px-6 flex items-center justify-between shadow-[0px_4px_0px_#27272a] shrink-0 pointer-events-auto z-50 max-md:h-16 max-md:px-3 max-md:shadow-[0px_2px_0px_#27272a] ${theme === "dark" ? "bg-zinc-800" : "bg-[#f4f4f5]"}`}
    >
      <div className="flex items-center gap-4 max-md:gap-2 overflow-hidden">
        <button
          onClick={onBack}
          className="p-2 border-2 border-zinc-800 bg-white rounded-full hover:shadow-[2px_2px_0px_#27272a] hover:-translate-y-0.5 transition-all flex items-center justify-center shrink-0 max-md:p-1.5"
          title="Back to Dashboard"
        >
          <img
            src={leftArrow}
            alt="Back"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />
        </button>
        <div className="min-w-0">
          <h1
            className={`font-instrument text-2xl font-bold leading-none max-md:text-lg max-md:truncate max-md:max-w-[120px] ${theme === "dark" ? "text-white" : "text-zinc-900"}`}
          >
            {boardName}
          </h1>
          <span className="text-xs font-bold text-green-600 tracking-wide uppercase flex items-center gap-1 mt-1 max-md:text-[10px] max-md:tracking-normal">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="max-md:hidden">Live Session</span>
            <span className="hidden max-md:inline">Live</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 max-md:gap-2 shrink-0">
        <div
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center -space-x-3 mr-2 cursor-pointer group max-md:mr-0 max-md:-space-x-2"
          title="Open Chat"
        >
          {visibleUsers.map((u, index) => (
            <div
              key={u.id}
              className={`w-10 h-10 rounded-full border-2 border-zinc-900 flex items-center justify-center font-bold text-sm text-white shadow-[2px_2px_0px_#27272a] relative transition-transform hover:-translate-y-1 max-md:w-8 max-md:h-8 max-md:text-xs max-md:shadow-[1px_1px_0px_#27272a]`}
              style={{
                zIndex: 30 - index,
                backgroundColor: u.id === "local" ? "#3f3f46" : u.color,
              }}
              title={u.name}
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
          ))}

          {extraUsersCount > 0 && (
            <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-white flex items-center justify-center font-bold text-sm text-zinc-900 shadow-[2px_2px_0px_#27272a] relative z-0 group-hover:-translate-y-1 transition-transform max-md:w-8 max-md:h-8 max-md:text-xs max-md:shadow-[1px_1px_0px_#27272a]">
              +{extraUsersCount}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 bg-white text-zinc-900 border-2 border-zinc-900 rounded-[32px] font-bold hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 max-md:px-2 max-md:py-1 max-md:gap-0 max-md:rounded-[12px] max-md:shadow-[2px_2px_0px_#27272a]"
        >
          <span className="text-lg leading-none max-md:text-base max-md:px-1">
            +
          </span>
          <span className="max-md:hidden">Invite</span>
        </button>
        <button
          onClick={() => setIsShareOpen(true)}
          className="px-6 py-2 bg-zinc-900 text-white border-2 border-zinc-900 rounded-[32px] font-bold hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all duration-200 max-md:px-3 max-md:py-1 max-md:text-xs max-md:rounded-[12px] max-md:shadow-[2px_2px_0px_#fcd34d]"
        >
          Share
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 border-2 border-zinc-800 bg-white rounded-full hover:shadow-[2px_2px_0px_#27272a] hover:-translate-y-0.5 transition-all flex items-center justify-center max-md:p-1.5"
          title="Settings"
        >
          <img
            src={settingIcon}
            alt="Settings"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />
        </button>
      </div>
    </header>
  );
};

export const InviteModal = ({ isOpen, onClose, roomId }) => {
  const inviteLink = `${window.location.origin}/room/${roomId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto max-md:p-4"
          onPointerDown={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-md w-full relative text-zinc-900 max-md:p-5 max-md:rounded-[24px] max-md:shadow-[4px_4px_0px_#27272a]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none max-md:top-4 max-md:right-4"
            >
              ✕
            </button>
            <h2 className="font-instrument text-3xl font-bold mb-4 max-md:text-2xl max-md:pr-6">
              Invite Collaborators
            </h2>
            <p className="text-zinc-600 mb-6 font-poppins max-md:text-sm max-md:mb-4">
              Share this Room ID with your team to collaborate in real-time.
              They can join via the Dashboard.
            </p>
            <div className="flex gap-2 max-md:flex-col">
              <input
                readOnly
                value={roomId || "Loading..."}
                className="flex-1 border-2 border-zinc-900 rounded-xl px-4 py-2 outline-none bg-zinc-50 font-mono text-sm font-bold text-center tracking-widest max-md:w-full"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 border-2 border-zinc-900 rounded-xl font-bold shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all max-md:w-full ${copied ? "bg-green-400 text-zinc-900" : "bg-amber-200"}`}
              >
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-300">
              <p className="text-xs text-zinc-500 font-poppins text-center">
                Or share the direct link: <br />
                <span className="font-mono text-zinc-800 break-all select-all mt-1 block">
                  {inviteLink}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ChatPanel = ({
  isOpen,
  onClose,
  chatMessages,
  chatInput,
  setChatInput,
  onSendMessage,
  onStartVideoCall,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-24 right-6 w-80 bg-white border-2 border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#27272a] flex flex-col overflow-hidden z-[60] pointer-events-auto max-md:w-[calc(100%-2rem)] max-md:top-20 max-md:right-4 max-md:shadow-[4px_4px_0px_#27272a]"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-zinc-900 bg-[#f4f4f5] text-zinc-900 max-md:p-3">
          <h2 className="font-bold text-lg max-md:text-base">Room Chat</h2>
          <div className="flex gap-4 items-center max-md:gap-3">
            <button
              onClick={onStartVideoCall}
              className="hover:scale-110 transition-transform text-xl"
              title="Start Video Call"
            >
              <img
                src={videocallIcon}
                alt="Start Call"
                className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
              />
            </button>
            <button
              onClick={onClose}
              className="hover:text-red-500 font-bold text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white text-zinc-900 custom-scrollbar max-md:p-3 max-md:gap-2">
          {chatMessages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#27272a] text-sm max-md:p-2 ${
                m.isMe ? "bg-amber-200 self-end" : "bg-zinc-50 self-start"
              }`}
            >
              <span className="font-bold block mb-1 text-xs opacity-70">
                {m.sender}
              </span>
              {m.text}
            </div>
          ))}
        </div>
        <div className="p-4 border-t-2 border-zinc-900 bg-[#f4f4f5] flex gap-2 max-md:p-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatInput.trim()) {
                onSendMessage(chatInput.trim());
                setChatInput("");
              }
            }}
            className="flex-1 w-full border-2 border-zinc-900 rounded-xl px-3 py-2 outline-none focus:shadow-[2px_2px_0px_#27272a] transition-shadow bg-white text-zinc-900 font-poppins text-sm max-md:py-1.5"
            placeholder="Type a message..."
          />
          <button
            onClick={() => {
              if (chatInput.trim()) {
                onSendMessage(chatInput.trim());
                setChatInput("");
              }
            }}
            className="px-4 py-2 bg-amber-200 border-2 border-zinc-900 rounded-xl font-bold shadow-[2px_2px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all text-sm max-md:px-3"
          >
            Send
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const ShareModal = ({
  isOpen,
  onClose,
  onExportJSON,
  onExportImage,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto max-md:p-4"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-md w-full relative text-zinc-900 max-md:p-5 max-md:rounded-[24px] max-md:shadow-[4px_4px_0px_#27272a]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none max-md:top-4 max-md:right-4"
          >
            ✕
          </button>
          <h2 className="font-instrument text-3xl font-bold mb-4 max-md:text-2xl">
            Export Board
          </h2>
          <p className="text-zinc-600 mb-6 font-poppins text-sm max-md:mb-4 max-md:text-xs">
            Download a snapshot of your current view, or save the raw data file.
          </p>

          <div className="flex flex-col gap-3 max-md:gap-2">
            <button
              onClick={() => onExportImage("png")}
              className="w-full px-4 py-3 bg-white text-zinc-900 border-2 border-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-0.5 transition-all max-md:py-2 max-md:text-sm"
            >
              <img
                src={circleIcon}
                alt="PNG"
                className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
              />
              Export as PNG
            </button>
            <button
              onClick={() => onExportImage("jpeg")}
              className="w-full px-4 py-3 bg-white text-zinc-900 border-2 border-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-0.5 transition-all max-md:py-2 max-md:text-sm"
            >
              <img
                src={circleIcon}
                alt="JPEG"
                className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
              />
              Export as JPEG
            </button>
            <div className="w-full h-[2px] bg-zinc-200 my-2 max-md:my-1"></div>
            <button
              onClick={onExportJSON}
              className="w-full px-4 py-3 bg-zinc-900 text-white border-2 border-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all max-md:py-2 max-md:text-sm"
            >
              <img
                src={circleIcon}
                alt="File"
                className="w-5 h-5 object-contain max-md:w-4 max-md:h-4 filter invert"
              />
              Download .sketchr File
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const SettingsModal = ({ isOpen, onClose, theme, setTheme }) => (
  <AnimatePresence>
    {isOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto max-md:p-4"
        onPointerDown={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-sm w-full relative text-zinc-900 font-poppins max-md:p-5 max-md:rounded-[24px] max-md:shadow-[4px_4px_0px_#27272a]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none max-md:top-4 max-md:right-4"
          >
            ✕
          </button>
          <h2 className="font-instrument text-3xl font-bold mb-6 max-md:text-2xl max-md:mb-4">
            Settings
          </h2>
          <div className="flex items-center justify-between mb-4 flex-col gap-4 md:flex-row md:gap-0">
            <span className="font-bold text-lg max-md:text-base w-full">
              Canvas Theme
            </span>
            <div className="flex bg-zinc-100 border-2 border-zinc-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_#27272a] w-full md:w-auto">
              <button
                onClick={() => setTheme("light")}
                className={`px-4 py-2 font-bold transition-colors w-full md:w-auto max-md:text-sm max-md:py-1.5 ${theme === "light" ? "bg-amber-200 border-r-2 border-zinc-900" : "hover:bg-zinc-200 border-r-2 border-zinc-900"}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-4 py-2 font-bold transition-colors w-full md:w-auto max-md:text-sm max-md:py-1.5 ${theme === "dark" ? "bg-zinc-800 text-white" : "hover:bg-zinc-200"}`}
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

const VideoStream = ({ stream, isLocal, color, name, isVideoOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (isVideoOff || !stream) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center font-bold text-3xl text-white ${color}`}
      >
        {name ? name.charAt(0).toUpperCase() : "?"}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocal}
      className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
    />
  );
};

export const VideoCallModal = ({
  isOpen,
  onClose,
  localStream = null,
  peers = {},
  toggleVideo,
  toggleAudio,
  toggleScreenShare,
  isScreenSharing,
  stopStream,
  userName = "You",
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState("local");

  if (!isOpen) return null;

  const allParticipants = [
    {
      id: "local",
      name: userName,
      stream: localStream,
      isLocal: true,
      color: "bg-zinc-700",
      isVideoOff: isVideoOff,
    },
    ...Object.entries(peers).map(([peerId, data]) => ({
      id: peerId,
      name: data.name,
      stream: data.stream,
      isLocal: false,
      color: data.color,
      isVideoOff: false,
    })),
  ];

  const activeSpeaker =
    allParticipants.find((p) => p.id === activeSpeakerId) || allParticipants[0];

  const handleToggleAudio = () => {
    if (toggleAudio) setIsMuted(toggleAudio());
  };
  const handleToggleVideo = () => {
    if (toggleVideo) setIsVideoOff(toggleVideo());
  };

  const handleEndCall = () => {
    if (stopStream) stopStream();
    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag
      dragMomentum={false}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-24 left-6 w-[400px] min-w-[320px] min-h-[300px] max-w-[80vw] max-h-[80vh] resize overflow-hidden bg-white border-2 border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#27272a] flex flex-col z-[80] pointer-events-auto max-md:w-[calc(100%-2rem)] max-md:left-4 max-md:top-20 max-md:min-w-[280px] max-md:shadow-[4px_4px_0px_#27272a]"
    >
      <div className="flex justify-between items-center p-3 border-b-2 border-zinc-900 bg-[#f4f4f5] text-zinc-900 cursor-grab active:cursor-grabbing max-md:p-2">
        <h2 className="font-bold text-sm flex items-center gap-2 max-md:text-xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Huddle ({allParticipants.length})
        </h2>
        <button
          onClick={handleEndCall}
          className="hover:text-red-500 font-bold text-lg leading-none transition-colors max-md:text-base"
        >
          ✕
        </button>
      </div>

      <div className="bg-zinc-900 flex-1 min-h-[200px] flex items-center justify-center relative overflow-hidden max-md:min-h-[180px]">
        <VideoStream
          stream={activeSpeaker.stream}
          isLocal={activeSpeaker.isLocal && !isScreenSharing}
          color={activeSpeaker.color}
          name={activeSpeaker.name}
          isVideoOff={activeSpeaker.isVideoOff}
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-zinc-700 text-white text-xs font-poppins font-bold flex items-center gap-2 max-md:bottom-2 max-md:right-2 max-md:px-2 max-md:py-1 max-md:text-[10px]">
          {activeSpeaker.name}
          {activeSpeaker.isLocal && isMuted && (
            <img
              src={mute}
              alt="Muted"
              className="w-3 h-3 object-contain invert max-md:w-2 max-md:h-2"
            />
          )}
        </div>
      </div>

      <div className="bg-zinc-800 p-3 border-b-2 border-zinc-900 flex gap-3 overflow-x-auto custom-scrollbar min-h-[88px] shrink-0 max-md:p-2 max-md:gap-2 max-md:min-h-[72px]">
        {allParticipants.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveSpeakerId(p.id)}
            className={`relative shrink-0 w-24 h-16 rounded-xl border-2 overflow-hidden transition-all max-md:w-20 max-md:h-14 max-md:rounded-lg ${activeSpeakerId === p.id ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.3)] -translate-y-1" : "border-zinc-600 hover:border-zinc-400 hover:-translate-y-0.5"}`}
          >
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center pointer-events-none">
              <VideoStream
                stream={p.stream}
                isLocal={p.isLocal && !isScreenSharing}
                color={p.color}
                name={p.name}
                isVideoOff={p.isVideoOff}
              />
            </div>
            <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-white truncate max-w-[calc(100%-8px)] max-md:text-[8px] max-md:px-1">
              {p.name}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#f4f4f5] flex justify-center gap-4 shrink-0 max-md:p-3 max-md:gap-2">
        <button
          onClick={handleToggleAudio}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] max-md:w-10 max-md:h-10 max-md:rounded-[12px] max-md:shadow-[1px_1px_0px_#27272a] ${isMuted ? "bg-red-200" : "bg-white"}`}
        >
          <img
            src={isMuted ? mute : mic}
            alt="Mic"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />
        </button>
        <button
          onClick={handleToggleVideo}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] max-md:w-10 max-md:h-10 max-md:rounded-[12px] max-md:shadow-[1px_1px_0px_#27272a] ${isVideoOff ? "bg-red-200" : "bg-white"}`}
        >
          <img
            src={camera}
            alt="Camera"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />
        </button>
        <button
          onClick={() => {
            if (toggleScreenShare) toggleScreenShare();
          }}
          className={`w-12 h-12 rounded-[16px] border-2 border-zinc-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] max-md:w-10 max-md:h-10 max-md:rounded-[12px] max-md:shadow-[1px_1px_0px_#27272a] ${isScreenSharing ? "bg-amber-200" : "bg-white"}`}
        >
          <img
            src={Laptopicon}
            alt="Screen Share"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />
        </button>
        <button
          onClick={handleEndCall}
          className="w-12 h-12 rounded-[16px] border-2 border-zinc-900 bg-red-500 text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#27272a] max-md:w-10 max-md:h-10 max-md:rounded-[12px] max-md:shadow-[1px_1px_0px_#27272a]"
        >
          <img
            src={callmeIcon}
            alt="End Call"
            className="w-5 h-5 object-contain filter invert max-md:w-4 max-md:h-4"
          />
        </button>
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-1 pointer-events-none opacity-50">
        <svg viewBox="0 0 10 10" width="10" height="10">
          <path
            d="M 8 10 L 10 10 L 10 8 M 4 10 L 10 4 M 0 10 L 10 0"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export const AIModal = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) onGenerate(prompt);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 pointer-events-auto max-md:p-4"
      onPointerDown={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onPointerDown={(e) => e.stopPropagation()}
        className="bg-purple-100 border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-lg w-full relative text-zinc-900 font-poppins max-md:p-5 max-md:rounded-[24px] max-md:shadow-[4px_4px_0px_#27272a]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 font-bold hover:text-red-500 text-xl leading-none max-md:top-4 max-md:right-4"
        >
          ✕
        </button>
        <h2 className="font-instrument text-3xl font-bold mb-2 flex items-center gap-2 max-md:text-2xl max-md:pr-6">
          <img
            src={sparklesIcon}
            alt="AI"
            className="w-5 h-5 object-contain max-md:w-4 max-md:h-4"
          />{" "}
          AI Canvas Generation
        </h2>
        <p className="text-zinc-700 text-sm mb-6 max-md:text-xs max-md:mb-4">
          Describe a flowchart, architecture, or mindmap. The AI will draw it
          instantly.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A user authentication flow with login, register, and database validation..."
            className="w-full bg-white border-2 border-zinc-900 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins mb-4 resize-none h-32 max-md:h-24 max-md:py-2 max-md:text-sm"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 bg-zinc-900 text-white font-bold rounded-[24px] shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-md:py-2 max-md:text-sm max-md:shadow-[2px_2px_0px_#fcd34d]"
          >
            {isGenerating ? "Generating Architecture..." : "Draw Flowchart"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
