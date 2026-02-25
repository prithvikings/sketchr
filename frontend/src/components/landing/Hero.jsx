import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ onOpenDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-32 max-md:mt-16 mx-auto w-full flex flex-col items-center justify-center gap-8 max-md:gap-6 max-md:px-4">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }
          .mask-edges {
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="heading-title flex flex-col gap-4 max-md:gap-3 items-center">
        <h1 className="text-5xl max-md:text-4xl font-instrument text-zinc-800 text-center max-md:leading-tight">
          Create a Room. Share the Link. <br className="max-md:hidden" />
          Collaborate Instantly.
        </h1>
        <p className="text-sm max-md:text-xs text-center font-poppins text-zinc-600 max-w-sm max-md:max-w-xs">
          Real-time synchronized whiteboarding
        </p>
      </div>

      <div className="btn flex max-md:flex-col gap-4 max-md:gap-3 max-md:w-full max-md:px-4">
        <button
          onClick={() => navigate("/auth")}
          className="px-3 py-1.5 max-md:w-full max-md:py-2 bg-primarybackground text-zinc-800 text-sm rounded-lg font-poppins font-medium hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 border-2 border-transparent hover:border-zinc-900 transition-all cursor-pointer"
        >
          Create a Room
        </button>
        <button
          onClick={onOpenDemo}
          className="px-3 py-1.5 max-md:w-full max-md:py-2 border-2 border-zinc-900 text-zinc-800 text-sm rounded-lg font-poppins font-medium hover:bg-zinc-900 hover:text-white transition-all shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-0.5 cursor-pointer"
        >
          View Live Demo
        </button>
      </div>

      {/* Removed "hidden md:flex", added "flex max-md:mt-12" */}
      <div className="w-full powered flex-col gap-4 items-center flex mt-24 max-md:mt-12">
        <p className="text-xs text-zinc-600 font-poppins font-medium">
          Powered by
        </p>

        <div className="max-w-7xl overflow-hidden border-zinc-400 border-y border-dashed py-6 max-md:py-4 mask-edges">
          <div className="animate-marquee gap-6 max-md:gap-4">
            {/* FIRST SET */}
            <div className="flex items-center justify-center gap-12 max-md:gap-6 pr-3 max-md:pr-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://img.icons8.com/color/512/java-web-token.png"
                alt="jsonwebtoken"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg"
                alt="Tailwind CSS"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://hexmos.com/freedevtools/svg_icons/zustand/zustand-original.svg"
                alt="Zustand"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://img.icons8.com/color/512/java-web-token.png"
                alt="jsonwebtoken"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg"
                alt="Tailwind CSS"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://hexmos.com/freedevtools/svg_icons/zustand/zustand-original.svg"
                alt="Zustand"
                className="h-16 max-md:h-8"
              />
            </div>

            {/* SECOND SET */}
            <div
              className="flex items-center justify-center gap-12 max-md:gap-6 pr-3 max-md:pr-2"
              aria-hidden="true"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://img.icons8.com/color/512/java-web-token.png"
                alt="jsonwebtoken"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg"
                alt="Tailwind CSS"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://hexmos.com/freedevtools/svg_icons/zustand/zustand-original.svg"
                alt="Zustand"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://img.icons8.com/color/512/java-web-token.png"
                alt="jsonwebtoken"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg"
                alt="Tailwind CSS"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-16 max-md:h-8"
              />
              <img
                src="https://hexmos.com/freedevtools/svg_icons/zustand/zustand-original.svg"
                alt="Zustand"
                className="h-16 max-md:h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
