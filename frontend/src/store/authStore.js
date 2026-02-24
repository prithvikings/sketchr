import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("sketchr_user")) || null,
  token: localStorage.getItem("sketchr_token") || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;
      localStorage.setItem("sketchr_token", token);
      localStorage.setItem("sketchr_user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });
      const { user, token } = response.data;
      localStorage.setItem("sketchr_token", token);
      localStorage.setItem("sketchr_user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("sketchr_token");
    localStorage.removeItem("sketchr_user");
    set({ user: null, token: null });
  },

  // Inside useAuthStore create block...
  updateUser: (updatedUser) => {
    localStorage.setItem("sketchr_user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  clearError: () => set({ error: null }),
}));
