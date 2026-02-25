import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ onOpenDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-32 mx-auto w-full flex flex-col items-center justify-center gap-8">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
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

      <div className="heading-title flex flex-col gap-4 items-center">
        <h1 className="text-5xl font-instrument text-zinc-800 text-center">
          Create a Room. Share the Link. <br />
          Collaborate Instantly.
        </h1>
        <p className="text-sm text-center font-poppins text-zinc-600 max-w-sm">
          Real-time synchronized whiteboarding
        </p>
      </div>

      <div className="btn flex gap-4">
        <button
          onClick={() => navigate("/auth")}
          className="px-3 py-1.5 bg-primarybackground text-zinc-800 text-sm rounded-lg font-poppins font-medium hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 border-2 border-transparent hover:border-zinc-900 transition-all"
        >
          Create a Room
        </button>
        <button
          onClick={onOpenDemo} // Trigger the modal here
          className="px-3 py-1.5 border-2 border-zinc-900 text-zinc-800 text-sm rounded-lg font-poppins font-bold hover:bg-zinc-900 hover:text-white transition-all shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-0.5"
        >
          View Live Demo
        </button>
      </div>

      <div className="w-full powered flex-col gap-4 items-center hidden md:flex mt-24">
        <p className="text-xs text-zinc-600 font-poppins font-medium">
          Powered by
        </p>

        <div className="w-full overflow-hidden border-zinc-400 border-y border-dashed py-4 mask-edges">
          <div className="animate-marquee gap-6">
            {/* FIRST SET */}
            <div className="flex items-center justify-center gap-6 pr-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
            </div>

            {/* SECOND SET */}
            <div
              className="flex items-center justify-center gap-6 pr-3"
              aria-hidden="true"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"
                alt="Socket.IO"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/640px-Node.js_logo.svg.png"
                alt="Node.js"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/960px-New_Firebase_logo.svg.png"
                alt="Firebase"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mongodb-ar21.svg/640px-Mongodb-ar21.svg.png"
                alt="MongoDB"
                className="h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
                alt="React"
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
