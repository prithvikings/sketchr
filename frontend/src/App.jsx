import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Dashboard/components/Settings";
import Content from "./pages/Dashboard/components/Content";
import MyBoards from "./pages/Dashboard/components/MyBoards";
import Room from "./pages/Workspace/Room";
import Templates from "./pages/Dashboard/components/Templates";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="*"
          element={
            <h1 className="text-center text-4xl absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
              404 Not Found
            </h1>
          }
        />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Content />} />
          <Route path="settings" element={<Settings />} />
          <Route path="boards" element={<MyBoards />} />
          <Route path="templates" element={<Templates />} />
        </Route>
        <Route path="/room" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
