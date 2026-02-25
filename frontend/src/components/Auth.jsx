import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// 1. Import the local images
import sparkles from "../assets/sparkles.png"; // Adjust the path (e.g., ../../assets/) if your folder structure requires it
import rocket from "../assets/rocket.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login, register, isLoading, error, clearError, user } =
    useAuthStore();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.fullName, formData.email, formData.password);
      }
    } catch (err) {
      // Error is handled in the store
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setFormData({ fullName: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen w-full bg-primarybackground flex items-center justify-center px-4 font-poppins overflow-hidden relative z-10">
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 border-4 border-dashed border-zinc-300 rounded-full z-0 opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-amber-100 border-2 border-zinc-300 rounded-[40px] z-0 opacity-40 rotate-12 pointer-events-none" />

      <div className="w-full max-w-4xl bg-white border-2 border-zinc-900 rounded-[32px] shadow-[16px_16px_0px_#27272a] flex flex-col md:flex-row overflow-hidden relative z-10">
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-instrument font-medium text-zinc-900">
              Sketchr
            </h1>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-instrument font-medium text-zinc-900 mb-1">
              {isLogin ? "Welcome back." : "Start sketching."}
            </h2>
            <p className="text-xs text-zinc-600 font-medium">
              {isLogin
                ? "Enter your details to access your boards."
                : "Create an account to get your infinite canvas."}
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-800 rounded-xl py-2.5 mb-5 hover:bg-zinc-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#27272a] transition-all duration-200 font-semibold text-zinc-800 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-5 opacity-60">
            <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Or
            </span>
            <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {error && (
              <div className="w-full bg-red-100 border-2 border-red-500 text-red-700 rounded-xl px-3 py-2 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-800">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required={!isLogin}
                  className="w-full border-2 border-zinc-800 rounded-xl px-3 py-2.5 font-poppins text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-zinc-800">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                className="w-full border-2 border-zinc-800 rounded-xl px-3 py-2.5 font-poppins text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-800">
                  Password
                </label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full border-2 border-zinc-800 rounded-xl px-3 py-2.5 font-poppins text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-zinc-900 text-white rounded-xl py-2.5 mt-2 font-semibold transition-all duration-200 text-sm ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a]"}`}
            >
              {isLoading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-bold text-zinc-900 hover:underline hover:text-amber-600 transition-colors cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        <div className="hidden md:flex w-1/2 bg-amber-100 border-l-2 border-zinc-900 p-8 flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "radial-gradient(#27272a 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            {/* 2. Replaced text sparkles with the Apple image */}
            <div className="w-10 h-10 bg-white border-2 border-zinc-900 rounded-xl shadow-[4px_4px_0px_#27272a] flex items-center justify-center mb-4">
              <img
                src={sparkles}
                alt="sparkles"
                className="w-5 h-5 object-contain"
              />
            </div>
            <h3 className="text-2xl font-instrument font-medium text-zinc-900 leading-tight mb-3">
              "Sketchr completely changed how our remote design team operates.
              It's fast, fluid, and genuinely fun to use."
            </h3>
            <p className="font-poppins font-semibold text-zinc-800 text-xs">
              — Sarah Jenkins, UX Lead at TechFlow
            </p>
          </div>

          <div className="relative z-10 self-end mt-8 bg-pink-200 border-2 border-zinc-900 p-3 w-40 shadow-[6px_6px_0px_#27272a] rotate-3 hover:rotate-0 hover:-translate-y-1 transition-all duration-300">
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
                .font-handwriting {
                  font-family: 'Caveat', cursive;
                }
              `}
            </style>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/40 shadow-sm rotate-[-2deg]" />
            {/* 3. Replaced text rocket and formatted it to sit inline nicely with the handwriting font */}
            <p className="font-handwriting text-lg text-zinc-900 leading-tight">
              Don't forget to invite the dev team to the new board!{" "}
              <img
                src={rocket}
                alt="rocket"
                className="w-5 h-5 object-contain inline-block -mt-1"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
