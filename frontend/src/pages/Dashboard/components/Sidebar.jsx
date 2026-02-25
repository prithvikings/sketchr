import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "My Boards", path: "/dashboard/boards" },
    { name: "Templates", path: "/dashboard/templates" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  const handleUpgradeYes = () => {
    setIsUpgradeModalOpen(false);
    navigate("/dashboard/upgrade");
  };

  return (
    <>
      <aside className="w-72 h-full bg-secondarybackground border-r-1 border-dashed border-zinc-400 p-6 flex flex-col justify-between z-20">
        <div>
          <div className="mb-12 px-2">
            <Link
              to="/dashboard"
              className="font-instrument text-4xl font-medium tracking-tight text-zinc-900"
            >
              Sketchr.
            </Link>
          </div>

          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `block w-full text-left px-6 py-3 rounded-[32px] border-2 border-zinc-800 font-poppins font-medium transition-all duration-200 
                  ${
                    isActive
                      ? "bg-amber-200 shadow-[4px_4px_0px_#27272a] -translate-y-0.5 text-zinc-900"
                      : "bg-transparent hover:bg-zinc-100 hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 text-zinc-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="bg-pink-100 border-2 border-zinc-800 rounded-[32px] p-6 shadow-[6px_6px_0px_#27272a]">
          <h3 className="font-instrument text-xl font-bold mb-2">Go Pro!</h3>
          <p className="text-sm text-zinc-600 mb-4">
            Unlock unlimited boards and team members.
          </p>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full bg-zinc-900 text-white rounded-[32px] py-2 font-bold hover:shadow-[4px_4px_0px_#fcd34d] transition-all cursor-pointer"
          >
            Upgrade
          </button>
        </div>
      </aside>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border-2 border-zinc-900 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] max-w-sm w-full font-poppins text-center"
            >
              <h2 className="text-2xl font-instrument font-bold text-zinc-900 mb-4">
                Wait a minute...
              </h2>
              <p className="text-zinc-700 font-medium mb-8">
                Matlab upgraded version use karke hi mangega?
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleUpgradeYes}
                  className="flex-1 py-3 bg-amber-200 border-2 border-zinc-900 text-zinc-900 font-bold rounded-[24px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all cursor-pointer"
                >
                  Haa
                </button>
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 py-3 bg-white border-2 border-zinc-900 text-zinc-900 font-bold rounded-[24px] shadow-[4px_4px_0px_#27272a] hover:bg-zinc-100 hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all cursor-pointer"
                >
                  Naa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
