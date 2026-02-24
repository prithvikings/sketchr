import { useState, useCallback } from "react";

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );
  d.push("Z");
  return d.join(" ");
};

export const getShapeAttributes = (shape) => {
  const x = Math.min(shape.startX, shape.currentX);
  const y = Math.min(shape.startY, shape.currentY);
  const width = Math.max(10, Math.abs(shape.currentX - shape.startX));
  const height = Math.max(10, Math.abs(shape.currentY - shape.startY));
  return { x, y, width, height };
};

export const isIntersecting = (box1, box2) => {
  return !(
    box1.x + box1.width < box2.x ||
    box2.x + box2.width < box1.x ||
    box1.y + box1.height < box2.y ||
    box2.y + box2.height < box1.y
  );
};

export const useCanvasHistory = (initialState) => {
  const [historyState, setHistoryState] = useState({
    history: [initialState],
    step: 0,
  });

  const saveState = useCallback((action) => {
    setHistoryState((prev) => {
      const currentState = prev.history[prev.step];
      const newState =
        typeof action === "function" ? action(currentState) : action;
      const newHistory = prev.history.slice(0, prev.step + 1);
      newHistory.push(newState);
      return { history: newHistory, step: prev.step + 1 };
    });
  }, []);

  const replaceState = useCallback((action) => {
    setHistoryState((prev) => {
      const newHistory = [...prev.history];
      const currentState = newHistory[prev.step];
      newHistory[prev.step] =
        typeof action === "function" ? action(currentState) : action;
      return { history: newHistory, step: prev.step };
    });
  }, []);

  const undo = useCallback(
    () =>
      setHistoryState((prev) => ({
        ...prev,
        step: Math.max(0, prev.step - 1),
      })),
    [],
  );
  const redo = useCallback(
    () =>
      setHistoryState((prev) => ({
        ...prev,
        step: Math.min(prev.history.length - 1, prev.step + 1),
      })),
    [],
  );

  return {
    currentState: historyState.history[historyState.step],
    saveState,
    replaceState,
    undo,
    redo,
    canUndo: historyState.step > 0,
    canRedo: historyState.step < historyState.history.length - 1,
  };
};
