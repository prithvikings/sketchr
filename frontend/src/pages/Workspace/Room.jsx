import React, {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { getStroke } from "perfect-freehand";

import { useAuthStore } from "../../store/authStore";
import { useBoardStore } from "../../store/boardStore";
import { initSocket, getSocket } from "../../services/socket";
import { useWebRTC } from "../../hooks/network/useWebRTC";
import {
  getSvgPathFromStroke,
  getShapeAttributes,
  isIntersecting,
} from "../../utils/uitls";
import {
  PropertiesPanel,
  BottomToolbar,
  ZoomControls,
  Header,
  ChatPanel,
  InviteModal,
  ShareModal,
  SettingsModal,
  VideoCallModal,
} from "./UIComponents";

// --- CURSOR COMPONENT ---
const RemoteCursor = ({ x, y, color, name }) => (
  <div
    className="absolute pointer-events-none z-[100]"
    style={{
      transform: `translate(${x}px, ${y}px)`,
      transition: "transform 0.05s linear",
    }}
  >
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 2.30003L23.3637 20.01C24.1138 20.76 23.6538 22.01 22.6538 22.01H14.1538L12.0138 29.51C11.7538 30.41 10.4538 30.56 9.95376 29.71L1.15376 10.91C0.553757 9.41003 1.65376 7.80003 3.15376 8.00003L9.65376 9.00003L4.15376 3.50003C3.65376 3.00003 4.15376 2.00003 4.95376 2.00003C5.15376 2.00003 5.45376 2.10003 5.65376 2.30003Z"
        fill={color}
        stroke="white"
        strokeWidth="2.5"
      />
    </svg>
    <div
      className="absolute left-6 top-6 px-2 py-1 rounded-[8px] text-[10px] font-bold text-white whitespace-nowrap shadow-[2px_2px_0px_rgba(39,39,42,1)] border-2 border-zinc-900 font-poppins"
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  </div>
);

// --- ARROW COMPONENT ---
const ArrowSVG = ({ shape, width, height }) => {
  const isFlippedX = shape.currentX < shape.startX;
  const isFlippedY = shape.currentY < shape.startY;
  const x1 = isFlippedX ? width : 0;
  const y1 = isFlippedY ? height : 0;
  const x2 = isFlippedX ? 0 : width;
  const y2 = isFlippedY ? 0 : height;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = shape.strokeWidth * 3;
  const p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);

  return (
    <g
      stroke={shape.color}
      strokeWidth={shape.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline
        points={`${p1x},${p1y} ${x2},${y2} ${p2x},${p2y}`}
        fill="none"
      />
    </g>
  );
};

// --- DIFFING ENGINE FOR MULTIPLAYER UNDO/REDO ---
const computeDiff = (oldState, newState) => {
  const oldMap = new Map(
    [
      ...oldState.lines,
      ...oldState.shapes,
      ...oldState.stickies,
      ...oldState.texts,
    ].map((e) => [e.id, e]),
  );
  const newMap = new Map(
    [
      ...newState.lines,
      ...newState.shapes,
      ...newState.stickies,
      ...newState.texts,
    ].map((e) => [e.id, e]),
  );
  const added = [],
    updated = [],
    deleted = [];

  newMap.forEach((newEl, id) => {
    const oldEl = oldMap.get(id);
    if (!oldEl) added.push(newEl);
    else if (oldEl !== newEl) updated.push(newEl);
  });
  oldMap.forEach((_, id) => {
    if (!newMap.has(id)) deleted.push(id);
  });

  return { added, updated, deleted };
};

const broadcastDiff = (diff, socket, roomId) => {
  if (!socket || !roomId) return;
  diff.added.forEach((el) =>
    socket.emit("add_element", { roomId, element: el }),
  );
  diff.updated.forEach((el) =>
    socket.emit("update_element", { roomId, elementId: el.id, updates: el }),
  );
  diff.deleted.forEach((id) =>
    socket.emit("delete_element", { roomId, elementId: id }),
  );
};

const Room = () => {
  const { roomId } = useParams();
  const { user } = useAuthStore();

  // --- WEBRTC INIT ---
  const {
    localStream,
    peers,
    myPeerId,
    initStream,
    callPeer,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isScreenSharing,
    stopStream,
  } = useWebRTC(user?.fullName);

  const roomWrapperRef = useRef(null);
  const roomRef = useRef(null);
  const innerCanvasRef = useRef(null);

  const {
    lines,
    shapes,
    stickies,
    texts,
    past,
    future,
    saveState,
    replaceState,
    undo,
    redo,
  } = useBoardStore();
  const currentState = { lines, shapes, stickies, texts };
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const [activeTool, setActiveTool] = useState("cursor");
  const [activeColor, setActiveColor] = useState("#18181b");
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [zoom, setZoom] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Cursor State
  const [cursors, setCursors] = useState({});
  const lastCursorEmit = useRef(0);
  const cursorColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
  ];
  const myCursorColor = useRef(
    cursorColors[Math.floor(Math.random() * cursorColors.length)],
  );

  // UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const [chatMessages, setChatMessages] = useState([
    { sender: "System", text: "Welcome to the whiteboard! 👋", isMe: false },
  ]);
  const [chatInput, setChatInput] = useState("");

  const initialGroupStateRef = useRef(null);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const activeInteraction = useRef({
    tool: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    points: [],
    color: "#000",
    strokeWidth: 8,
  });

  const draftLineRef = useRef(null);
  const draftRectRef = useRef(null);
  const draftEllipseRef = useRef(null);
  const draftArrowLineRef = useRef(null);
  const draftArrowPolyRef = useRef(null);
  const selectionDivRef = useRef(null);
  const draftContainerRef = useRef(null);

  const stickyColors = [
    "bg-amber-200",
    "bg-pink-100",
    "bg-blue-100",
    "bg-green-100",
  ];
  const getFontSize = (width) =>
    width === 4 ? 16 : width === 8 ? 24 : width === 16 ? 48 : 64;

  // --- WEBSOCKET INITIALIZATION ---
  useEffect(() => {
    if (!roomId) return;
    const socket = initSocket();
    socket.emit("join_room", { roomId });

    socket.on("initial_state", (elements) => {
      const categorizedState = {
        lines: [],
        shapes: [],
        stickies: [],
        texts: [],
      };
      elements.forEach((el) => {
        if (el.category && categorizedState[el.category])
          categorizedState[el.category].push(el);
      });
      replaceState(categorizedState);
    });

    // WEBRTC SIGNALING LISTENER
    socket.on("user_video_ready", ({ peerId: incomingPeerId }) => {
      if (localStream && incomingPeerId) {
        callPeer(incomingPeerId);
      }
    });

    socket.on("add_element", (element) => {
      replaceState((prev) => ({
        ...prev,
        [element.category]: [
          ...prev[element.category].filter((el) => el.id !== element.id),
          element,
        ],
      }));
    });

    socket.on("update_element", ({ elementId, updates }) => {
      replaceState((prev) => ({
        lines: prev.lines.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el,
        ),
        shapes: prev.shapes.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el,
        ),
        stickies: prev.stickies.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el,
        ),
        texts: prev.texts.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el,
        ),
      }));
    });

    socket.on("delete_element", ({ elementId }) => {
      replaceState((prev) => ({
        lines: prev.lines.filter((el) => el.id !== elementId),
        shapes: prev.shapes.filter((el) => el.id !== elementId),
        stickies: prev.stickies.filter((el) => el.id !== elementId),
        texts: prev.texts.filter((el) => el.id !== elementId),
      }));
    });

    socket.on("cursor_move", ({ socketId, cursor }) => {
      setCursors((prev) => ({ ...prev, [socketId]: cursor }));
    });

    socket.on("user_left", ({ socketId }) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
    });

    socket.on("receive_message", (message) => {
      setChatMessages((prev) => [...prev, { ...message, isMe: false }]);
    });

    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("initial_state");
      socket.off("user_video_ready");
      socket.off("add_element");
      socket.off("update_element");
      socket.off("delete_element");
      socket.off("cursor_move");
      socket.off("user_left");
      socket.off("receive_message");
    };
  }, [roomId, replaceState, localStream, callPeer]);

  // --- CHAT & HISTORY HANDLERS ---
  const handleSendChatMessage = (text) => {
    const myMessage = {
      sender: user?.fullName || "Anonymous",
      text,
      isMe: true,
    };
    setChatMessages((prev) => [...prev, myMessage]);
    getSocket()?.emit("send_message", {
      roomId,
      message: { sender: user?.fullName || "Anonymous", text },
    });
  };

  const handleUndo = useCallback(() => {
    const beforeState = useBoardStore.getState();
    if (beforeState.past.length === 0) return;
    undo();
    broadcastDiff(
      computeDiff(beforeState, useBoardStore.getState()),
      getSocket(),
      roomId,
    );
  }, [undo, roomId]);

  const handleRedo = useCallback(() => {
    const beforeState = useBoardStore.getState();
    if (beforeState.future.length === 0) return;
    redo();
    broadcastDiff(
      computeDiff(beforeState, useBoardStore.getState()),
      getSocket(),
      roomId,
    );
  }, [redo, roomId]);

  const deleteItems = useCallback(
    (idsToDelete) => {
      if (!idsToDelete.length) return;
      const socket = getSocket();
      idsToDelete.forEach((id) =>
        socket?.emit("delete_element", { roomId, elementId: id }),
      );
      saveState((prev) => ({
        lines: prev.lines.filter((item) => !idsToDelete.includes(item.id)),
        shapes: prev.shapes.filter((item) => !idsToDelete.includes(item.id)),
        stickies: prev.stickies.filter(
          (item) => !idsToDelete.includes(item.id),
        ),
        texts: prev.texts.filter((item) => !idsToDelete.includes(item.id)),
      }));
      setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    },
    [saveState, roomId],
  );

  const selectedIdsRef = useRef(selectedIds);
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  // --- SHORTCUTS & WHEEL ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")
          e.target.blur();
        setSelectedIds([]);
        activeInteraction.current.tool = null;
        if (draftContainerRef.current)
          draftContainerRef.current.style.display = "none";
        if (selectionDivRef.current)
          selectionDivRef.current.style.display = "none";
        setActiveTool("cursor");
        return;
      }
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")
        return;

      if (e.ctrlKey || e.metaKey) {
        if (key === "a") {
          e.preventDefault();
          const state = currentStateRef.current;
          setSelectedIds(
            [
              ...state.lines,
              ...state.shapes,
              ...state.stickies,
              ...state.texts,
            ].map((i) => i.id),
          );
          return;
        }
        if (key === "z") {
          e.preventDefault();
          e.shiftKey ? handleRedo() : handleUndo();
          return;
        }
        if (key === "y") {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (key === "=" || key === "+") {
          e.preventDefault();
          setZoom((z) => Math.min(3, z + 0.1));
          return;
        }
        if (key === "-") {
          e.preventDefault();
          setZoom((z) => Math.max(0.1, z - 0.1));
          return;
        }
        if (key === "0") {
          e.preventDefault();
          setZoom(1);
          return;
        }
      }
      if (key === "delete" || key === "backspace") {
        deleteItems(selectedIdsRef.current);
        return;
      }

      const tools = {
        v: "cursor",
        h: "hand",
        p: "pen",
        e: "eraser",
        r: "square",
        o: "circle",
        a: "arrow",
        t: "text",
        s: "sticky",
      };
      if (tools[key]) setActiveTool(tools[key]);
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, deleteItems]);

  useEffect(() => {
    const container = roomWrapperRef.current;
    if (!container) return;
    const handleNativeWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) =>
          Math.max(0.1, Math.min(3, z + (e.deltaY < 0 ? 0.05 : -0.05))),
        );
      } else {
        e.preventDefault();
        panX.set(panX.get() - e.deltaX);
        panY.set(panY.get() - e.deltaY);
      }
    };
    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [panX, panY]);

  // --- CANVAS INTERACTIONS ---
  const handlePointerDown = (e) => {
    const canvasBounds = innerCanvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - canvasBounds.left) / zoom;
    const clickY = (e.clientY - canvasBounds.top) / zoom;
    const socket = getSocket();

    if (activeTool === "cursor" && e.target === innerCanvasRef.current) {
      if (!e.shiftKey) setSelectedIds([]);
      activeInteraction.current = {
        tool: "selection",
        startX: clickX,
        startY: clickY,
        currentX: clickX,
        currentY: clickY,
      };
      selectionDivRef.current.style.display = "block";
      selectionDivRef.current.style.left = `${clickX}px`;
      selectionDivRef.current.style.top = `${clickY}px`;
      selectionDivRef.current.style.width = `0px`;
      selectionDivRef.current.style.height = `0px`;
      return;
    }

    if (activeTool === "sticky") {
      const newSticky = {
        id: Date.now().toString(),
        type: "sticky",
        category: "stickies",
        text: "",
        color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
        x: clickX - 100,
        y: clickY - 100,
        width: 224,
        height: 224,
        rotation: Math.floor(Math.random() * 8) - 4,
      };
      saveState((prev) => ({
        ...prev,
        stickies: [...prev.stickies, newSticky],
      }));
      socket?.emit("add_element", { roomId, element: newSticky });
      setActiveTool("cursor");
      setSelectedIds([newSticky.id]);
    } else if (activeTool === "text") {
      const newText = {
        id: Date.now().toString(),
        type: "text",
        category: "texts",
        text: "",
        color: activeColor,
        size: getFontSize(strokeWidth),
        x: clickX,
        y: clickY - getFontSize(strokeWidth) / 2,
        width: 300,
        height: getFontSize(strokeWidth) * 1.5,
      };
      saveState((prev) => ({ ...prev, texts: [...prev.texts, newText] }));
      socket?.emit("add_element", { roomId, element: newText });
      setActiveTool("cursor");
      setSelectedIds([newText.id]);
    } else if (["pen", "square", "circle", "arrow"].includes(activeTool)) {
      activeInteraction.current = {
        tool: activeTool,
        startX: clickX,
        startY: clickY,
        currentX: clickX,
        currentY: clickY,
        points: [[clickX, clickY, 0.5]],
        color: activeColor,
        strokeWidth,
      };
      setSelectedIds([]);
      draftContainerRef.current.style.display = "block";
      draftLineRef.current.style.display =
        activeTool === "pen" ? "block" : "none";
      draftRectRef.current.style.display =
        activeTool === "square" ? "block" : "none";
      draftEllipseRef.current.style.display =
        activeTool === "circle" ? "block" : "none";
      draftArrowLineRef.current.style.display =
        activeTool === "arrow" ? "block" : "none";
      draftArrowPolyRef.current.style.display =
        activeTool === "arrow" ? "block" : "none";

      if (activeTool === "pen") {
        draftLineRef.current.setAttribute("fill", activeColor);
        draftLineRef.current.setAttribute("d", "");
      } else {
        [
          draftRectRef,
          draftEllipseRef,
          draftArrowLineRef,
          draftArrowPolyRef,
        ].forEach((ref) => {
          if (ref.current) {
            ref.current.setAttribute("stroke", activeColor);
            ref.current.setAttribute("stroke-width", strokeWidth);
          }
        });
      }
    }
  };

  const handlePointerMove = (e) => {
    const canvasBounds = innerCanvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - canvasBounds.left) / zoom;
    const currentY = (e.clientY - canvasBounds.top) / zoom;

    const now = Date.now();
    if (now - lastCursorEmit.current > 30) {
      getSocket()?.emit("cursor_move", {
        roomId,
        cursor: {
          x: currentX,
          y: currentY,
          name: user?.fullName || "Anonymous",
          color: myCursorColor.current,
        },
      });
      lastCursorEmit.current = now;
    }

    const data = activeInteraction.current;
    if (!data.tool) return;
    data.currentX = currentX;
    data.currentY = currentY;

    if (data.tool === "selection") {
      const x = Math.min(data.startX, currentX),
        y = Math.min(data.startY, currentY);
      const w = Math.abs(currentX - data.startX),
        h = Math.abs(currentY - data.startY);
      selectionDivRef.current.style.left = `${x}px`;
      selectionDivRef.current.style.top = `${y}px`;
      selectionDivRef.current.style.width = `${w}px`;
      selectionDivRef.current.style.height = `${h}px`;
      const box = { x, y, width: w, height: h },
        newlySelected = [],
        state = currentStateRef.current;
      const checkIntersect = (items) => {
        items.forEach((item) => {
          const itemBox =
            item.shapeType &&
            ["square", "circle", "arrow"].includes(item.shapeType)
              ? getShapeAttributes(item)
              : item;
          if (isIntersecting(box, itemBox)) newlySelected.push(item.id);
        });
      };
      checkIntersect(state.lines);
      checkIntersect(state.shapes);
      checkIntersect(state.stickies);
      checkIntersect(state.texts);
      setSelectedIds(newlySelected);
    } else if (data.tool === "pen") {
      data.points.push([
        currentX,
        currentY,
        e.pressure !== 0 ? e.pressure : 0.5,
      ]);
      draftLineRef.current.setAttribute(
        "d",
        getSvgPathFromStroke(
          getStroke(data.points, {
            size: data.strokeWidth,
            thinning: 0.6,
            smoothing: 0.5,
            streamline: 0.5,
          }),
        ),
      );
    } else if (data.tool === "square") {
      draftRectRef.current.setAttribute("x", Math.min(data.startX, currentX));
      draftRectRef.current.setAttribute("y", Math.min(data.startY, currentY));
      draftRectRef.current.setAttribute(
        "width",
        Math.max(10, Math.abs(currentX - data.startX)),
      );
      draftRectRef.current.setAttribute(
        "height",
        Math.max(10, Math.abs(currentY - data.startY)),
      );
    } else if (data.tool === "circle") {
      const w = Math.max(10, Math.abs(currentX - data.startX)),
        h = Math.max(10, Math.abs(currentY - data.startY));
      draftEllipseRef.current.setAttribute(
        "cx",
        Math.min(data.startX, currentX) + w / 2,
      );
      draftEllipseRef.current.setAttribute(
        "cy",
        Math.min(data.startY, currentY) + h / 2,
      );
      draftEllipseRef.current.setAttribute("rx", w / 2);
      draftEllipseRef.current.setAttribute("ry", h / 2);
    } else if (data.tool === "arrow") {
      const angle = Math.atan2(currentY - data.startY, currentX - data.startX),
        headLen = data.strokeWidth * 3;
      draftArrowLineRef.current.setAttribute("x1", data.startX);
      draftArrowLineRef.current.setAttribute("y1", data.startY);
      draftArrowLineRef.current.setAttribute("x2", currentX);
      draftArrowLineRef.current.setAttribute("y2", currentY);
      draftArrowPolyRef.current.setAttribute(
        "points",
        `${currentX - headLen * Math.cos(angle - Math.PI / 6)},${currentY - headLen * Math.sin(angle - Math.PI / 6)} ${currentX},${currentY} ${currentX - headLen * Math.cos(angle + Math.PI / 6)},${currentY - headLen * Math.sin(angle + Math.PI / 6)}`,
      );
    }
  };

  const handlePointerUp = () => {
    const data = activeInteraction.current;
    if (!data.tool) return;
    const socket = getSocket();

    if (data.tool === "selection") {
      selectionDivRef.current.style.display = "none";
    } else if (data.tool === "pen") {
      const xs = data.points.map((p) => p[0]),
        ys = data.points.map((p) => p[1]),
        pad = data.strokeWidth * 2;
      const minX = Math.min(...xs) - pad,
        minY = Math.min(...ys) - pad;
      const newLine = {
        id: Date.now().toString(),
        type: "stroke",
        category: "lines",
        color: data.color,
        size: data.strokeWidth,
        x: minX,
        y: minY,
        width: Math.max(...xs) - minX + pad,
        height: Math.max(...ys) - minY + pad,
        points: data.points.map((p) => [p[0] - minX, p[1] - minY, p[2]]),
      };
      saveState((prev) => ({ ...prev, lines: [...prev.lines, newLine] }));
      socket?.emit("add_element", { roomId, element: newLine });
    } else if (["square", "circle", "arrow"].includes(data.tool)) {
      const newShape = {
        id: Date.now().toString(),
        type: "node",
        shapeType: data.tool,
        category: "shapes",
        startX: data.startX,
        startY: data.startY,
        currentX: data.currentX,
        currentY: data.currentY,
        color: data.color,
        strokeWidth: data.strokeWidth,
        ...getShapeAttributes(data),
      };
      saveState((prev) => ({ ...prev, shapes: [...prev.shapes, newShape] }));
      socket?.emit("add_element", { roomId, element: newShape });
      setSelectedIds([newShape.id]);
    }
    data.tool = null;
    draftContainerRef.current.style.display = "none";
  };

  // --- ANIMATIONS & RESIZING ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".room-header",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" },
      );
      gsap.fromTo(
        ".ui-panel",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.5)",
          delay: 0.2,
          clearProps: "all",
        },
      );
      gsap.fromTo(
        ".canvas-bg",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out", delay: 0.4 },
      );
    }, roomRef);
    return () => ctx.revert();
  }, []);

  const getGroupBounds = () => {
    if (selectedIds.length === 0) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const checkItem = (item) => {
      if (selectedIds.includes(item.id)) {
        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x + item.width);
        maxY = Math.max(maxY, item.y + item.height);
      }
    };
    currentStateRef.current.lines.forEach(checkItem);
    currentStateRef.current.shapes.forEach(checkItem);
    currentStateRef.current.stickies.forEach(checkItem);
    currentStateRef.current.texts.forEach(checkItem);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  const handleGroupResizeStart = () => {
    initialGroupStateRef.current = currentStateRef.current;
  };

  const handleGroupResizeDrag = (e, info, bounds, axis = "xy") => {
    const initial = initialGroupStateRef.current;
    if (!initial) return;
    const deltaX = axis.includes("x")
      ? (info.point.x - info.startPoint.x) / zoom
      : 0;
    const deltaY = axis.includes("y")
      ? (info.point.y - info.startPoint.y) / zoom
      : 0;
    const scaleX = Math.max(20, bounds.width + deltaX) / bounds.width,
      scaleY = Math.max(20, bounds.height + deltaY) / bounds.height;

    replaceState((state) => {
      const applyScale = (items, type) =>
        items.map((item) => {
          if (!selectedIds.includes(item.id)) return item;
          const initialItem = initial[type].find((i) => i.id === item.id);
          const newX = bounds.x + (initialItem.x - bounds.x) * scaleX,
            newY = bounds.y + (initialItem.y - bounds.y) * scaleY;
          const newWidth = initialItem.width * scaleX,
            newHeight = initialItem.height * scaleY;
          if (type === "lines")
            return {
              ...item,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
              points: initialItem.points.map((p) => [
                p[0] * scaleX,
                p[1] * scaleY,
                p[2],
              ]),
            };
          if (type === "texts" || type === "stickies")
            return {
              ...item,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            };
          return {
            ...item,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            startX: newX,
            startY: newY,
            currentX: newX + newWidth,
            currentY: newY + newHeight,
          };
        });
      return {
        ...state,
        lines: applyScale(state.lines, "lines"),
        shapes: applyScale(state.shapes, "shapes"),
        stickies: applyScale(state.stickies, "stickies"),
        texts: applyScale(state.texts, "texts"),
      };
    });
  };

  const handleGroupResizeEnd = () => {
    saveState(currentStateRef.current);
    initialGroupStateRef.current = null;
    const socket = getSocket();
    selectedIdsRef.current.forEach((id) => {
      let updatedItem = null;
      for (const key of ["lines", "shapes", "stickies", "texts"]) {
        updatedItem = currentStateRef.current[key].find((i) => i.id === id);
        if (updatedItem) break;
      }
      if (updatedItem)
        socket?.emit("update_element", {
          roomId,
          elementId: id,
          updates: updatedItem,
        });
    });
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(currentStateRef.current, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sketchr-board.sketchr";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsShareOpen(false);
  };

  const ResizeHandles = ({ bounds }) => (
    <>
      <motion.div
        drag="x"
        dragMomentum={false}
        onDragStart={handleGroupResizeStart}
        onDrag={(e, info) => handleGroupResizeDrag(e, info, bounds, "x")}
        onDragEnd={handleGroupResizeEnd}
        className="absolute top-1/2 -right-2 w-4 h-4 -translate-y-1/2 bg-white border-2 border-zinc-900 cursor-e-resize z-50 pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
      />
      <motion.div
        drag="y"
        dragMomentum={false}
        onDragStart={handleGroupResizeStart}
        onDrag={(e, info) => handleGroupResizeDrag(e, info, bounds, "y")}
        onDragEnd={handleGroupResizeEnd}
        className="absolute -bottom-2 left-1/2 w-4 h-4 -translate-x-1/2 bg-white border-2 border-zinc-900 cursor-s-resize z-50 pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
      />
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={handleGroupResizeStart}
        onDrag={(e, info) => handleGroupResizeDrag(e, info, bounds, "xy")}
        onDragEnd={handleGroupResizeEnd}
        className="absolute -right-3 -bottom-3 w-6 h-6 bg-white border-2 border-zinc-900 rounded-full cursor-se-resize shadow-[2px_2px_0px_#27272a] z-50 hover:scale-110 transition-transform pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
      />
    </>
  );

  const groupBounds = getGroupBounds();

  return (
    <div
      ref={roomWrapperRef}
      className={`h-screen w-full flex flex-col overflow-hidden relative font-poppins overscroll-none touch-none ${theme === "dark" ? "bg-zinc-900" : "bg-primarybackground"}`}
    >
      <div
        ref={roomRef}
        className="absolute inset-0 flex flex-col pointer-events-none z-50"
      >
        <Header
          theme={theme}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          setIsInviteOpen={setIsInviteOpen}
          setIsShareOpen={setIsShareOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />

        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendMessage={handleSendChatMessage}
          onStartVideoCall={async () => {
            setIsVideoCallOpen(true);
            setIsChatOpen(false);
            if (!localStream) {
              const stream = await initStream();
              if (stream && myPeerId) {
                getSocket()?.emit("video_ready", { roomId, peerId: myPeerId });
              }
            } else if (myPeerId) {
              getSocket()?.emit("video_ready", { roomId, peerId: myPeerId });
            }
          }}
        />

        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          localStream={localStream}
          peers={peers}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleScreenShare={toggleScreenShare} // Pass it down
          isScreenSharing={isScreenSharing} // Pass it down
          stopStream={stopStream} // Pass it down
          userName={user?.fullName}
        />
        <InviteModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          onExport={handleExportJSON}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="pointer-events-auto">
          <PropertiesPanel
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
          <BottomToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            undo={handleUndo}
            redo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <ZoomControls zoom={zoom} setZoom={setZoom} />
        </div>
      </div>

      <main
        className={`flex-1 relative w-full h-full overflow-hidden ${activeInteraction.current.tool === "selection" ? "cursor-crosshair" : activeTool === "hand" ? "cursor-grab active:cursor-grabbing" : ["pen", "square", "circle", "arrow"].includes(activeTool) ? "cursor-crosshair" : ["sticky", "text", "eraser"].includes(activeTool) ? "cursor-cell" : "cursor-default"} pointer-events-auto`}
      >
        <motion.div
          ref={innerCanvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          drag={activeTool === "hand"}
          dragMomentum={true}
          style={{ x: panX, y: panY, originX: 0.5, originY: 0.5 }}
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="canvas-bg absolute w-[5000px] h-[5000px] top-1/2 left-1/2 -mt-[2500px] -ml-[2500px] bg-[radial-gradient(#a1a1aa_2px,transparent_2px)] [background-size:24px_24px] touch-none"
        >
          <div
            ref={selectionDivRef}
            className="absolute border border-blue-500 bg-blue-500/10 z-50 pointer-events-none hidden"
          />

          <svg
            ref={draftContainerRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible hidden"
          >
            <path
              ref={draftLineRef}
              d=""
              fill="transparent"
              className="hidden"
            />
            <rect
              ref={draftRectRef}
              x="0"
              y="0"
              width="0"
              height="0"
              fill="transparent"
              rx="8"
              className="hidden"
            />
            <ellipse
              ref={draftEllipseRef}
              cx="0"
              cy="0"
              rx="0"
              ry="0"
              fill="transparent"
              className="hidden"
            />
            <line
              ref={draftArrowLineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              strokeLinecap="round"
              className="hidden"
            />
            <polyline
              ref={draftArrowPolyRef}
              points=""
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hidden"
            />
          </svg>

          {selectedIds.length > 1 && groupBounds && (
            <div
              id="group-box"
              className="absolute border-2 border-dashed border-blue-500 z-50 pointer-events-none"
              style={{
                left: groupBounds.x,
                top: groupBounds.y,
                width: groupBounds.width,
                height: groupBounds.height,
              }}
            >
              <button
                onPointerDownCapture={(e) => {
                  e.stopPropagation();
                  deleteItems(selectedIdsRef.current);
                }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white border-2 border-zinc-900 rounded-full flex items-center justify-center hover:scale-110 shadow-[2px_2px_0px_#27272a] pointer-events-auto transition-transform"
              >
                ✕
              </button>
              <ResizeHandles bounds={groupBounds} />
            </div>
          )}

          {Object.entries(cursors).map(([socketId, cursor]) => (
            <RemoteCursor
              key={socketId}
              x={cursor.x}
              y={cursor.y}
              color={cursor.color}
              name={cursor.name}
            />
          ))}

          <AnimatePresence>
            {[
              ...currentState.lines,
              ...currentState.shapes,
              ...currentState.stickies,
              ...currentState.texts,
            ].map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const showIndividualHandles =
                isSelected &&
                selectedIds.length === 1 &&
                activeTool === "cursor";

              return (
                <motion.div
                  key={item.id}
                  data-id={item.id}
                  style={{
                    position: "absolute",
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.category === "texts" ? "auto" : item.height,
                    color: item.color,
                    x: 0,
                    y: 0,
                  }}
                  className={`z-10 ${activeTool === "cursor" || activeTool === "eraser" ? "pointer-events-auto" : "pointer-events-none"} ${activeTool === "eraser" ? "hover:opacity-30 transition-opacity" : ""}`}
                  drag={activeTool === "cursor"}
                  dragMomentum={false}
                  onPointerDown={(e) => {
                    if (activeTool === "eraser") {
                      e.stopPropagation();
                      deleteItems([item.id]);
                    } else if (activeTool === "cursor") {
                      e.stopPropagation();
                      if (e.shiftKey)
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((i) => i !== item.id)
                            : [...prev, item.id],
                        );
                      else if (!selectedIds.includes(item.id))
                        setSelectedIds([item.id]);
                    }
                  }}
                  onPointerEnter={(e) => {
                    if (activeTool === "eraser" && e.buttons === 1)
                      deleteItems([item.id]);
                  }}
                  onDrag={(e, info) => {
                    const targetIds = selectedIdsRef.current.includes(item.id)
                      ? selectedIdsRef.current
                      : [item.id];
                    targetIds.forEach((id) => {
                      if (id !== item.id) {
                        const el = document.querySelector(`[data-id='${id}']`);
                        if (el)
                          el.style.transform = `translate(${info.offset.x}px, ${info.offset.y}px)`;
                      }
                    });
                    const boxEl = document.getElementById("group-box");
                    if (boxEl)
                      boxEl.style.transform = `translate(${info.offset.x}px, ${info.offset.y}px)`;
                  }}
                  onDragEnd={(e, info) => {
                    const dx = info.offset.x / zoom,
                      dy = info.offset.y / zoom;
                    const targetIds = selectedIdsRef.current.includes(item.id)
                      ? selectedIdsRef.current
                      : [item.id];
                    const socket = getSocket();
                    saveState((state) => {
                      const applyOffset = (items) =>
                        items.map((i) => {
                          if (targetIds.includes(i.id)) {
                            const updated = { ...i, x: i.x + dx, y: i.y + dy };
                            socket?.emit("update_element", {
                              roomId,
                              elementId: i.id,
                              updates: updated,
                            });
                            return updated;
                          }
                          return i;
                        });
                      return {
                        ...state,
                        lines: applyOffset(state.lines),
                        shapes: applyOffset(state.shapes),
                        stickies: applyOffset(state.stickies),
                        texts: applyOffset(state.texts),
                      };
                    });
                    targetIds.forEach((id) => {
                      if (id !== item.id) {
                        const el = document.querySelector(`[data-id='${id}']`);
                        if (el) el.style.transform = "none";
                      }
                    });
                    const boxEl = document.getElementById("group-box");
                    if (boxEl) boxEl.style.transform = "none";
                  }}
                >
                  {showIndividualHandles && (
                    <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none z-50" />
                  )}
                  {item.category === "lines" && (
                    <svg className="w-full h-full overflow-visible pointer-events-none">
                      <path
                        d={getSvgPathFromStroke(
                          getStroke(item.points, {
                            size: item.size,
                            thinning: 0.6,
                            smoothing: 0.5,
                            streamline: 0.5,
                          }),
                        )}
                        fill={item.color}
                      />
                    </svg>
                  )}
                  {item.category === "shapes" && (
                    <svg className="w-full h-full overflow-visible pointer-events-none">
                      {item.shapeType === "square" ? (
                        <rect
                          x="0"
                          y="0"
                          width={item.width}
                          height={item.height}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={item.strokeWidth}
                          rx="8"
                        />
                      ) : item.shapeType === "circle" ? (
                        <ellipse
                          cx={item.width / 2}
                          cy={item.height / 2}
                          rx={item.width / 2}
                          ry={item.height / 2}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={item.strokeWidth}
                        />
                      ) : (
                        <ArrowSVG
                          shape={item}
                          width={item.width}
                          height={item.height}
                        />
                      )}
                    </svg>
                  )}
                  {item.category === "stickies" && (
                    <div
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                      className={`w-full h-full ${item.color} border-2 ${isSelected ? "border-blue-500" : "border-zinc-800"} p-5 shadow-[8px_8px_0px_#27272a] flex flex-col pointer-events-auto`}
                    >
                      <div className="w-full flex justify-center mb-3">
                        <div className="w-16 h-4 bg-white/40 border border-zinc-800/20 -mt-8 rotate-[-2deg]"></div>
                      </div>
                      <textarea
                        defaultValue={item.text}
                        onPointerDownCapture={(e) =>
                          activeTool === "eraser"
                            ? e.preventDefault()
                            : e.stopPropagation()
                        }
                        onBlur={(e) => {
                          const newText = e.target.value;
                          replaceState((s) => ({
                            ...s,
                            stickies: s.stickies.map((st) =>
                              st.id === item.id ? { ...st, text: newText } : st,
                            ),
                          }));
                          saveState(currentStateRef.current);
                          getSocket()?.emit("update_element", {
                            roomId,
                            elementId: item.id,
                            updates: { text: newText },
                          });
                        }}
                        className={`w-full h-full bg-transparent border-none resize-none outline-none font-handwriting text-2xl text-zinc-900 leading-tight placeholder:text-zinc-800/50 ${activeTool === "eraser" ? "pointer-events-none" : "cursor-text"}`}
                        placeholder="Type something..."
                      />
                    </div>
                  )}
                  {item.category === "texts" && (
                    <textarea
                      defaultValue={item.text}
                      autoFocus={item.text === ""}
                      onPointerDownCapture={(e) =>
                        activeTool === "eraser"
                          ? e.preventDefault()
                          : e.stopPropagation()
                      }
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onBlur={(e) => {
                        const newText = e.target.value;
                        replaceState((s) => ({
                          ...s,
                          texts: s.texts.map((t) =>
                            t.id === item.id ? { ...t, text: newText } : t,
                          ),
                        }));
                        saveState(currentStateRef.current);
                        getSocket()?.emit("update_element", {
                          roomId,
                          elementId: item.id,
                          updates: { text: newText },
                        });
                      }}
                      className={`w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden whitespace-pre-wrap font-poppins font-bold leading-tight placeholder:text-zinc-300 pointer-events-auto ${activeTool === "eraser" ? "pointer-events-none" : ""}`}
                      placeholder="Type..."
                      style={{ fontSize: `${item.size}px` }}
                    />
                  )}
                  {showIndividualHandles && (
                    <>
                      <button
                        onPointerDownCapture={(e) => {
                          e.stopPropagation();
                          deleteItems([item.id]);
                        }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white border-2 border-zinc-900 rounded-full flex items-center justify-center hover:scale-110 shadow-[2px_2px_0px_#27272a] z-50 transition-transform text-xs"
                      >
                        ✕
                      </button>
                      <ResizeHandles bounds={item} />
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Room;
