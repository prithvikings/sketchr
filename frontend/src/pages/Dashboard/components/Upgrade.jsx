import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Rocket from "../../../assets/rocket.png";

const Upgrade = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".upgrade-anim",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.2)",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:p-4 pb-24"
    >
      <div className="max-w-3xl mx-auto mt-12 max-md:mt-4 upgrade-anim">
        <div className="bg-pink-100 border-2 border-zinc-900 rounded-[32px] p-10 max-md:p-6 shadow-[8px_8px_0px_#27272a] max-md:shadow-[4px_4px_0px_#27272a] text-center">
          <h1 className="font-instrument text-5xl max-md:text-3xl font-bold text-zinc-900 mb-4 flex items-center justify-center gap-2">
            Pro Plan Activated
            <img
              src={Rocket}
              alt=""
              className="w-12 h-12 max-md:w-8 max-md:h-8 object-contain"
            />
          </h1>
          <p className="text-zinc-700 font-poppins text-lg max-md:text-sm mb-8">
            Congratulations, you didn't settle for less. Here are your new
            powers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white border-2 border-zinc-900 rounded-[24px] p-6 shadow-[4px_4px_0px_#27272a] max-md:shadow-[2px_2px_0px_#27272a]">
              <h3 className="font-bold text-xl mb-2">Infinite Boards</h3>
              <p className="text-sm text-zinc-600">
                Create as many workspaces as your brain can handle.
              </p>
            </div>
            <div className="bg-white border-2 border-zinc-900 rounded-[24px] p-6 shadow-[4px_4px_0px_#27272a] max-md:shadow-[2px_2px_0px_#27272a]">
              <h3 className="font-bold text-xl mb-2">AI Generation</h3>
              <p className="text-sm text-zinc-600">
                Unlimited text-to-canvas generation with Multi Model support.
              </p>
            </div>
            <div className="bg-white border-2 border-zinc-900 rounded-[24px] p-6 shadow-[4px_4px_0px_#27272a] max-md:shadow-[2px_2px_0px_#27272a]">
              <h3 className="font-bold text-xl mb-2">Custom Templates</h3>
              <p className="text-sm text-zinc-600">
                Save your exact board layouts and reuse them instantly.
              </p>
            </div>
            <div className="bg-white border-2 border-zinc-900 rounded-[24px] p-6 shadow-[4px_4px_0px_#27272a] max-md:shadow-[2px_2px_0px_#27272a]">
              <h3 className="font-bold text-xl mb-2">Priority Support</h3>
              <p className="text-sm text-zinc-600">
                Direct line to the Sketchr dev team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upgrade;
