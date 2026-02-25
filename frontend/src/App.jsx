import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Dashboard/components/Settings";
import Content from "./pages/Dashboard/components/Content";
import MyBoards from "./pages/Dashboard/components/MyBoards";
import Room from "./pages/Workspace/Room";
import Templates from "./pages/Dashboard/components/Templates";
import Upgrade from "./pages/Dashboard/components/Upgrade";
import { useAuthStore } from "./store/authStore";

// -----------------------------
// Route Guards
// -----------------------------

// Prevents unauthenticated users from accessing secure routes
const ProtectedRoute = () => {
  const { user, token } = useAuthStore();

  if (!user || !token) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

// Prevents authenticated users from seeing the login/signup page
const PublicRoute = () => {
  const { user, token } = useAuthStore();

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// -----------------------------
// Application Router
// -----------------------------

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Completely Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Public-Only Routes (Redirects to dashboard if logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* Secure Routes (Redirects to auth if not logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Content />} />
            <Route path="settings" element={<Settings />} />
            <Route path="boards" element={<MyBoards />} />
            <Route path="templates" element={<Templates />} />
            <Route path="upgrade" element={<Upgrade />} />
          </Route>

          {/* A room must have an ID to function as a multiplayer environment */}
          <Route path="/room/:roomId" element={<Room />} />
        </Route>

        {/* Global 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="h-screen w-full flex items-center justify-center bg-primarybackground font-poppins">
              <h1 className="text-4xl font-bold text-zinc-900 bg-amber-200 px-6 py-2 border-2 border-zinc-900 shadow-[8px_8px_0px_#27272a] rounded-[16px]">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
