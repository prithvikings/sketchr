import React, {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { getStroke } from "perfect-freehand";

import { useBoardStore } from "../../store/boardStore";
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

const Room = () => {
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const [chatMessages, setChatMessages] = useState([
    { sender: "System", text: "Welcome to the whiteboard! 👋" },
    { sender: "U1", text: "Hey, let's start the sync." },
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

  const deleteItems = useCallback(
    (idsToDelete) => {
      if (!idsToDelete.length) return;
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
    [saveState],
  );

  const selectedIdsRef = useRef(selectedIds);
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

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
          const allIds = [
            ...state.lines,
            ...state.shapes,
            ...state.stickies,
            ...state.texts,
          ].map((i) => i.id);
          setSelectedIds(allIds);
          return;
        }
        if (key === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
          return;
        }
        if (key === "y") {
          e.preventDefault();
          redo();
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
  }, [undo, redo, deleteItems]);

  useEffect(() => {
    const container = roomWrapperRef.current;
    if (!container) return;
    const handleNativeWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
        setZoom((z) => Math.max(0.1, Math.min(3, z + zoomDelta)));
      } else {
        e.preventDefault();
        panX.set(panX.get() - e.deltaX);
        panY.set(panY.get() - e.deltaY);
      }
    };
    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [panX, panY]);

  const handleItemPointerDown = (e, id) => {
    if (activeTool === "eraser") {
      e.stopPropagation();
      deleteItems([id]);
      return;
    }
    if (activeTool === "cursor") {
      e.stopPropagation();
      if (e.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
      } else if (!selectedIds.includes(id)) {
        setSelectedIds([id]);
      }
    }
  };

  const handlePointerDown = (e) => {
    const canvasBounds = innerCanvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - canvasBounds.left) / zoom;
    const clickY = (e.clientY - canvasBounds.top) / zoom;

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
        id: Date.now(),
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
      setActiveTool("cursor");
      setSelectedIds([newSticky.id]);
    } else if (activeTool === "text") {
      const newText = {
        id: Date.now(),
        text: "",
        color: activeColor,
        size: getFontSize(strokeWidth),
        x: clickX,
        y: clickY - getFontSize(strokeWidth) / 2,
        width: 300,
        height: getFontSize(strokeWidth) * 1.5,
      };
      saveState((prev) => ({ ...prev, texts: [...prev.texts, newText] }));
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

      draftLineRef.current.style.display = "none";
      draftRectRef.current.style.display = "none";
      draftEllipseRef.current.style.display = "none";
      draftArrowLineRef.current.style.display = "none";
      draftArrowPolyRef.current.style.display = "none";

      if (activeTool === "pen") {
        draftLineRef.current.style.display = "block";
        draftLineRef.current.setAttribute("fill", activeColor);
        draftLineRef.current.setAttribute("d", "");
      } else if (activeTool === "square") {
        draftRectRef.current.style.display = "block";
        draftRectRef.current.setAttribute("stroke", activeColor);
        draftRectRef.current.setAttribute("stroke-width", strokeWidth);
        draftRectRef.current.setAttribute("x", clickX);
        draftRectRef.current.setAttribute("y", clickY);
        draftRectRef.current.setAttribute("width", 0);
        draftRectRef.current.setAttribute("height", 0);
      } else if (activeTool === "circle") {
        draftEllipseRef.current.style.display = "block";
        draftEllipseRef.current.setAttribute("stroke", activeColor);
        draftEllipseRef.current.setAttribute("stroke-width", strokeWidth);
        draftEllipseRef.current.setAttribute("cx", clickX);
        draftEllipseRef.current.setAttribute("cy", clickY);
        draftEllipseRef.current.setAttribute("rx", 0);
        draftEllipseRef.current.setAttribute("ry", 0);
      } else if (activeTool === "arrow") {
        draftArrowLineRef.current.style.display = "block";
        draftArrowPolyRef.current.style.display = "block";
        draftArrowLineRef.current.setAttribute("stroke", activeColor);
        draftArrowLineRef.current.setAttribute("stroke-width", strokeWidth);
        draftArrowPolyRef.current.setAttribute("stroke", activeColor);
        draftArrowPolyRef.current.setAttribute("stroke-width", strokeWidth);
        draftArrowLineRef.current.setAttribute("x1", clickX);
        draftArrowLineRef.current.setAttribute("y1", clickY);
        draftArrowLineRef.current.setAttribute("x2", clickX);
        draftArrowLineRef.current.setAttribute("y2", clickY);
        draftArrowPolyRef.current.setAttribute("points", "");
      }
    }
  };

  const handlePointerMove = (e) => {
    const data = activeInteraction.current;
    if (!data.tool) return;

    const canvasBounds = innerCanvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - canvasBounds.left) / zoom;
    const currentY = (e.clientY - canvasBounds.top) / zoom;
    data.currentX = currentX;
    data.currentY = currentY;

    if (data.tool === "selection") {
      const x = Math.min(data.startX, currentX);
      const y = Math.min(data.startY, currentY);
      const w = Math.abs(currentX - data.startX);
      const h = Math.abs(currentY - data.startY);

      selectionDivRef.current.style.left = `${x}px`;
      selectionDivRef.current.style.top = `${y}px`;
      selectionDivRef.current.style.width = `${w}px`;
      selectionDivRef.current.style.height = `${h}px`;

      const box = { x, y, width: w, height: h };
      const newlySelected = [];
      const state = currentStateRef.current;

      const checkIntersect = (items) => {
        items.forEach((item) => {
          const itemBox =
            item.type && ["square", "circle", "arrow"].includes(item.type)
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
      const pressure = e.pressure !== 0 ? e.pressure : 0.5;
      data.points.push([currentX, currentY, pressure]);
      const d = getSvgPathFromStroke(
        getStroke(data.points, {
          size: data.strokeWidth,
          thinning: 0.6,
          smoothing: 0.5,
          streamline: 0.5,
        }),
      );
      draftLineRef.current.setAttribute("d", d);
    } else if (data.tool === "square") {
      const x = Math.min(data.startX, currentX);
      const y = Math.min(data.startY, currentY);
      const w = Math.max(10, Math.abs(currentX - data.startX));
      const h = Math.max(10, Math.abs(currentY - data.startY));
      draftRectRef.current.setAttribute("x", x);
      draftRectRef.current.setAttribute("y", y);
      draftRectRef.current.setAttribute("width", w);
      draftRectRef.current.setAttribute("height", h);
    } else if (data.tool === "circle") {
      const x = Math.min(data.startX, currentX);
      const y = Math.min(data.startY, currentY);
      const w = Math.max(10, Math.abs(currentX - data.startX));
      const h = Math.max(10, Math.abs(currentY - data.startY));
      draftEllipseRef.current.setAttribute("cx", x + w / 2);
      draftEllipseRef.current.setAttribute("cy", y + h / 2);
      draftEllipseRef.current.setAttribute("rx", w / 2);
      draftEllipseRef.current.setAttribute("ry", h / 2);
    } else if (data.tool === "arrow") {
      const angle = Math.atan2(currentY - data.startY, currentX - data.startX);
      const headLen = data.strokeWidth * 3;
      const p1x = currentX - headLen * Math.cos(angle - Math.PI / 6);
      const p1y = currentY - headLen * Math.sin(angle - Math.PI / 6);
      const p2x = currentX - headLen * Math.cos(angle + Math.PI / 6);
      const p2y = currentY - headLen * Math.sin(angle + Math.PI / 6);

      draftArrowLineRef.current.setAttribute("x1", data.startX);
      draftArrowLineRef.current.setAttribute("y1", data.startY);
      draftArrowLineRef.current.setAttribute("x2", currentX);
      draftArrowLineRef.current.setAttribute("y2", currentY);
      draftArrowPolyRef.current.setAttribute(
        "points",
        `${p1x},${p1y} ${currentX},${currentY} ${p2x},${p2y}`,
      );
    }
  };

  const handlePointerUp = () => {
    const data = activeInteraction.current;
    if (!data.tool) return;

    if (data.tool === "selection") {
      selectionDivRef.current.style.display = "none";
    } else if (data.tool === "pen") {
      const xs = data.points.map((p) => p[0]);
      const ys = data.points.map((p) => p[1]);
      const pad = data.strokeWidth * 2;
      const minX = Math.min(...xs) - pad;
      const minY = Math.min(...ys) - pad;
      const width = Math.max(...xs) - minX + pad;
      const height = Math.max(...ys) - minY + pad;
      const normPoints = data.points.map((p) => [
        p[0] - minX,
        p[1] - minY,
        p[2],
      ]);

      saveState((prev) => ({
        ...prev,
        lines: [
          ...prev.lines,
          {
            id: Date.now(),
            color: data.color,
            size: data.strokeWidth,
            x: minX,
            y: minY,
            width,
            height,
            points: normPoints,
          },
        ],
      }));
    } else if (["square", "circle", "arrow"].includes(data.tool)) {
      const attrs = getShapeAttributes(data);
      const newShape = {
        id: Date.now(),
        type: data.tool,
        startX: data.startX,
        startY: data.startY,
        currentX: data.currentX,
        currentY: data.currentY,
        color: data.color,
        strokeWidth: data.strokeWidth,
        ...attrs,
      };
      saveState((prev) => ({ ...prev, shapes: [...prev.shapes, newShape] }));
      setSelectedIds([newShape.id]);
    }

    data.tool = null;
    draftContainerRef.current.style.display = "none";
  };

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

  const getCanvasCursor = () => {
    if (activeTool === "hand") return "cursor-grab active:cursor-grabbing";
    if (activeTool === "sticky" || activeTool === "text") return "cursor-cell";
    if (["pen", "square", "circle", "arrow"].includes(activeTool))
      return "cursor-crosshair";
    if (activeTool === "eraser") return "cursor-cell";
    return activeInteraction.current.tool === "selection"
      ? "cursor-crosshair"
      : "cursor-default";
  };

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
    const newW = Math.max(20, bounds.width + deltaX);
    const newH = Math.max(20, bounds.height + deltaY);
    const scaleX = newW / bounds.width;
    const scaleY = newH / bounds.height;

    replaceState((state) => {
      const applyScale = (items, type) =>
        items.map((item) => {
          if (!selectedIds.includes(item.id)) return item;
          const initialItem = initial[type].find((i) => i.id === item.id);
          const newX = bounds.x + (initialItem.x - bounds.x) * scaleX;
          const newY = bounds.y + (initialItem.y - bounds.y) * scaleY;
          const newWidth = initialItem.width * scaleX;
          const newHeight = initialItem.height * scaleY;

          if (type === "lines") {
            const scaledPoints = initialItem.points.map((p) => [
              p[0] * scaleX,
              p[1] * scaleY,
              p[2],
            ]);
            return {
              ...item,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
              points: scaledPoints,
            };
          }
          if (type === "texts" || type === "stickies") {
            return {
              ...item,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            };
          }
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
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(currentStateRef.current, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
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
  const showGroupHandles = selectedIds.length > 1 && groupBounds;

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
          setChatMessages={setChatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onStartVideoCall={() => setIsVideoCallOpen(true)}
        />
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
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
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <ZoomControls zoom={zoom} setZoom={setZoom} />
        </div>
      </div>

      <main
        className={`flex-1 relative w-full h-full overflow-hidden ${getCanvasCursor()} pointer-events-auto`}
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

          {showGroupHandles && (
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
              const isSticky = item.rotation !== undefined;
              const isText = item.size !== undefined && !item.points;

              return (
                <motion.div
                  key={item.id}
                  data-id={item.id}
                  style={{
                    position: "absolute",
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: isText ? "auto" : item.height,
                    color: item.color,
                    x: 0,
                    y: 0,
                  }}
                  className={`z-10 ${activeTool === "cursor" || activeTool === "eraser" ? "pointer-events-auto" : "pointer-events-none"} ${activeTool === "eraser" ? "hover:opacity-30 transition-opacity" : ""}`}
                  drag={activeTool === "cursor"}
                  dragMomentum={false}
                  onPointerDown={(e) => handleItemPointerDown(e, item.id)}
                  onPointerEnter={(e) => {
                    if (activeTool === "eraser" && e.buttons === 1)
                      deleteItems([item.id]);
                  }}
                  onDrag={(e, info) => {
                    const targetIds = selectedIdsRef.current.includes(item.id)
                      ? selectedIdsRef.current
                      : [item.id];
                    targetIds.forEach((id) => {
                      if (id === item.id) return;
                      const el = document.querySelector(`[data-id='${id}']`);
                      if (el)
                        el.style.transform = `translate(${info.offset.x}px, ${info.offset.y}px)`;
                    });
                    const boxEl = document.getElementById("group-box");
                    if (boxEl)
                      boxEl.style.transform = `translate(${info.offset.x}px, ${info.offset.y}px)`;
                  }}
                  onDragEnd={(e, info) => {
                    const dx = info.offset.x / zoom;
                    const dy = info.offset.y / zoom;
                    const targetIds = selectedIdsRef.current.includes(item.id)
                      ? selectedIdsRef.current
                      : [item.id];

                    saveState((state) => {
                      const applyOffset = (items) =>
                        items.map((i) =>
                          targetIds.includes(i.id)
                            ? { ...i, x: i.x + dx, y: i.y + dy }
                            : i,
                        );
                      return {
                        ...state,
                        lines: applyOffset(state.lines),
                        shapes: applyOffset(state.shapes),
                        stickies: applyOffset(state.stickies),
                        texts: applyOffset(state.texts),
                      };
                    });

                    targetIds.forEach((id) => {
                      if (id === item.id) return;
                      const el = document.querySelector(`[data-id='${id}']`);
                      if (el) el.style.transform = "none";
                    });
                    const boxEl = document.getElementById("group-box");
                    if (boxEl) boxEl.style.transform = "none";
                  }}
                >
                  {showIndividualHandles && (
                    <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none z-50" />
                  )}

                  {item.points && (
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

                  {item.type && (
                    <svg className="w-full h-full overflow-visible pointer-events-none">
                      {item.type === "square" ? (
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
                      ) : item.type === "circle" ? (
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

                  {isSticky && (
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
                          replaceState((s) => ({
                            ...s,
                            stickies: s.stickies.map((st) =>
                              st.id === item.id
                                ? { ...st, text: e.target.value }
                                : st,
                            ),
                          }));
                          saveState(currentStateRef.current);
                        }}
                        className={`w-full h-full bg-transparent border-none resize-none outline-none font-handwriting text-2xl text-zinc-900 leading-tight placeholder:text-zinc-800/50 ${activeTool === "eraser" ? "pointer-events-none" : "cursor-text"}`}
                        placeholder="Type something..."
                      />
                    </div>
                  )}

                  {isText && (
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
                        replaceState((s) => ({
                          ...s,
                          texts: s.texts.map((t) =>
                            t.id === item.id
                              ? { ...t, text: e.target.value }
                              : t,
                          ),
                        }));
                        saveState(currentStateRef.current);
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
