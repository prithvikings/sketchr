import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../services/api";

const Settings = () => {
  const containerRef = useRef(null);
  const { user, logout } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [apiKey, setApiKey] = useState("");
  const [isKeySaving, setIsKeySaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.put("/users/profile", {
        fullName: formData.fullName,
      });
      useAuthStore.getState().updateUser(response.data.user);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setIsKeySaving(true);
    try {
      await api.post("/users/api-key", { apiKey });
      setApiKey("••••••••••••••••••••••••••••");
      alert("API Key encrypted and saved securely.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save API Key");
    } finally {
      setIsKeySaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure? This cannot be undone.")) {
      try {
        await api.delete("/users/me");
        logout();
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:p-4 max-md:pb-32"
    >
      <div className="mb-10 header-text max-md:mb-6">
        <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2 max-md:text-3xl">
          Settings
        </h2>
        <p className="text-zinc-600 font-poppins text-lg max-md:text-sm">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-4xl flex flex-col gap-8 pb-12 max-md:gap-5 max-md:pb-6">
        {/* Profile Section */}
        <section className="settings-card bg-amber-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 max-md:p-5 max-md:shadow-[4px_4px_0px_#27272a]">
          <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6 max-md:mb-4 max-md:text-xl">
            Profile Details
          </h3>
          <div className="flex flex-col md:flex-row gap-8 items-start max-md:gap-5">
            <div className="flex flex-col items-center gap-4 max-md:w-full">
              <div className="h-24 w-24 bg-green-100 border-2 border-zinc-800 rounded-full shadow-[4px_4px_0px_#27272a] flex items-center justify-center overflow-hidden max-md:h-20 max-md:w-20">
                <span className="font-instrument text-4xl font-bold text-zinc-900 max-md:text-3xl">
                  {formData.fullName.charAt(0) || "U"}
                </span>
              </div>
              <button className="text-xs font-poppins font-bold text-zinc-800 border-2 border-zinc-800 px-4 py-1 rounded-[16px] hover:bg-zinc-900 hover:text-white transition-colors">
                Change Avatar
              </button>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="flex-1 w-full flex flex-col gap-6 max-md:gap-4"
            >
              <div>
                <label className="block text-zinc-800 font-bold mb-2 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full bg-white border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-poppins max-md:py-2"
                />
              </div>
              <div>
                <label className="block text-zinc-800 font-bold mb-2 text-sm">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-zinc-100/50 border-2 border-zinc-400 border-dashed rounded-[16px] px-4 py-3 text-zinc-500 cursor-not-allowed font-poppins max-md:py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="self-start px-8 py-3 bg-zinc-900 text-white font-bold rounded-[32px] hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all disabled:opacity-50 max-md:w-full max-md:py-2"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="settings-card bg-blue-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 max-md:p-5 max-md:shadow-[4px_4px_0px_#27272a]">
          <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-6 max-md:mb-4 max-md:text-xl">
            Appearance
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 py-6 bg-white border-2 border-zinc-800 rounded-[24px] font-bold shadow-[4px_4px_0px_#27272a] text-zinc-900 relative max-md:py-4 max-md:shadow-[2px_2px_0px_#27272a]">
              Light Mode
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 border-2 border-zinc-900 rounded-full"></div>
            </button>
            <button className="flex-1 py-6 bg-zinc-800 border-2 border-zinc-800 text-white rounded-[24px] font-bold opacity-40 hover:opacity-100 transition-opacity max-md:py-4">
              Dark Mode (Coming Soon)
            </button>
          </div>
        </section>

        <section className="settings-card bg-purple-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 max-md:p-5 max-md:shadow-[4px_4px_0px_#27272a]">
          <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-2 max-md:text-xl">
            AI Configuration
          </h3>
          <p className="text-zinc-700 font-poppins text-sm mb-6 max-md:text-xs max-md:mb-4">
            Enter your Gemini API key to enable text-to-canvas generation. Your
            key is encrypted at rest using AES-256-GCM.
          </p>
          <form
            onSubmit={handleSaveApiKey}
            className="flex flex-col gap-6 max-md:gap-4"
          >
            <div>
              <label className="block text-zinc-800 font-bold mb-2 text-sm">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                required
                className="w-full bg-white border-2 border-zinc-800 rounded-[16px] px-4 py-3 outline-none focus:shadow-[4px_4px_0px_#27272a] transition-shadow text-zinc-900 font-mono max-md:py-2"
              />
            </div>
            <button
              type="submit"
              disabled={isKeySaving}
              className="self-start px-8 py-3 bg-zinc-900 text-white font-bold rounded-[32px] hover:shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-1 transition-all disabled:opacity-50 max-md:w-full max-md:py-2"
            >
              {isKeySaving ? "Encrypting & Saving..." : "Save API Key"}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="settings-card bg-pink-100 border-2 border-zinc-800 rounded-[32px] p-8 shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-1 transition-all duration-200 max-md:p-5 max-md:shadow-[4px_4px_0px_#27272a]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-instrument text-2xl font-bold text-zinc-900 mb-1 max-md:text-xl">
                Danger Zone
              </h3>
              <p className="text-sm font-poppins text-zinc-600 max-md:text-xs">
                Delete account and all board data.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500 border-2 border-zinc-900 text-white font-bold rounded-[32px] shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 transition-all max-md:w-full max-md:py-2 max-md:shadow-[2px_2px_0px_#27272a]"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
