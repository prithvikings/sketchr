import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const Settings = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".settings-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.2)",
          clearProps: "all",
        },
      );

      gsap.fromTo(
        ".header-text",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* Header */}
      <div className="mb-10 header-text">
        <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2">
          Settings
        </h2>
        <p className="text-zinc-600 font-poppins text-lg">
          Manage your account, preferences, and billing.
        </p>
      </div>

      <div className="max-w-4xl flex flex-col gap-8 pb-12">
        {/* Profile Section */}
        <section className="settings-card bg-amber-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200">
          <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6">
            Profile Details
          </h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 bg-green-100 border-2 border-zinc-800 rounded-full shadow-[4px_4px_0px_#27272a] shrink-0"></div>
              <button className="text-sm font-poppins font-bold text-zinc-800 border-2 border-zinc-800 px-4 py-1 rounded-[16px] hover:bg-zinc-900 hover:text-white transition-colors">
                Upload
              </button>
            </div>

            <div className="flex-1 w-full flex flex-col gap-6">
              <div>
                <label className="block text-zinc-800 font-bold mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex UI/UX"
                  className="w-full bg-white border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins"
                />
              </div>
              <div>
                <label className="block text-zinc-800 font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex@sketchr.io"
                  disabled
                  className="w-full bg-zinc-100 border-2 border-zinc-400 border-dashed rounded-[16px] px-4 py-3 text-zinc-500 cursor-not-allowed font-poppins"
                />
              </div>
              <button className="self-start px-8 py-3 bg-zinc-900 text-white font-bold rounded-[32px] hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="settings-card bg-blue-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200">
          <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6">
            Appearance
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 py-6 bg-white border-2 border-zinc-800 rounded-[24px] font-bold shadow-[4px_4px_0px_#27272a] text-zinc-900 relative overflow-hidden group">
              <span className="relative z-10">Light Mode</span>
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 border-2 border-zinc-900 rounded-full"></div>
            </button>
            <button className="flex-1 py-6 bg-zinc-800 border-2 border-zinc-800 text-white rounded-[24px] font-bold shadow-[4px_4px_0px_#27272a] opacity-60 hover:opacity-100 hover:-translate-y-1 transition-all">
              Dark Mode
            </button>
            <button className="flex-1 py-6 bg-primarybackground border-2 border-dashed border-zinc-500 text-zinc-800 rounded-[24px] font-bold hover:shadow-[4px_4px_0px_#27272a] hover:border-solid hover:border-zinc-800 hover:-translate-y-1 transition-all">
              System Sync
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-card bg-pink-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-1">
                Danger Zone
              </h3>
              <p className="text-sm font-poppins text-zinc-600">
                Permanently delete your account and all associated boards.
              </p>
            </div>
            <button className="px-6 py-3 bg-red-500 border-2 border-zinc-900 text-white font-bold rounded-[32px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all shrink-0">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
