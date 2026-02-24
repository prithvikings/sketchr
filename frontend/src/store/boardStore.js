import { create } from "zustand";

const MAX_HISTORY = 50;

const initialState = {
  lines: [],
  shapes: [],
  stickies: [],
  texts: [],
};

export const useBoardStore = create((set, get) => ({
  ...initialState,
  past: [],
  future: [],

  // Commits a new action to the undo stack
  saveState: (updater) => {
    set((state) => {
      const newState = typeof updater === "function" ? updater(state) : updater;

      const currentSnapshot = {
        lines: state.lines,
        shapes: state.shapes,
        stickies: state.stickies,
        texts: state.texts,
      };

      // Limit history size to prevent memory leaks
      const newPast = [...state.past, currentSnapshot].slice(-MAX_HISTORY);

      return {
        ...newState,
        past: newPast,
        future: [], // Drawing a new item invalidates the redo future
      };
    });
  },

  // Overwrites current state without adding to history (used during drag/resize)
  replaceState: (updater) => {
    set((state) => {
      const newState = typeof updater === "function" ? updater(state) : updater;
      return { ...newState };
    });
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      const currentSnapshot = {
        lines: state.lines,
        shapes: state.shapes,
        stickies: state.stickies,
        texts: state.texts,
      };

      return {
        ...previous,
        past: newPast,
        future: [currentSnapshot, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      const currentSnapshot = {
        lines: state.lines,
        shapes: state.shapes,
        stickies: state.stickies,
        texts: state.texts,
      };

      return {
        ...next,
        past: [...state.past, currentSnapshot],
        future: newFuture,
      };
    });
  },
}));
