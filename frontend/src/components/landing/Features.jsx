import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  // Refs for background parallax elements
  const float1Ref = useRef(null);
  const float2Ref = useRef(null);
  const float3Ref = useRef(null);

  const features = [
    {
      title: "Smart Diagramming",
      description:
        "Draw a messy circle, and we'll snap it into a perfect shape. Connect nodes instantly.",
      color: "bg-white",
      visual: (
        <div className="flex items-center justify-between w-full h-24 mt-4 px-4 relative">
          <div className="w-12 h-12 bg-blue-100 border-2 border-zinc-800 rounded-lg flex items-center justify-center z-10">
            A
          </div>
          <div className="flex-1 h-0.5 border-t-2 border-dashed border-zinc-800 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-800 rotate-45" />
          </div>
          <div className="w-12 h-12 bg-green-100 border-2 border-zinc-800 rounded-full flex items-center justify-center z-10">
            B
          </div>
        </div>
      ),
    },
    {
      title: "Integrated Voice Chat",
      description:
        "Talk to your team directly inside the board with spatial audio. No Zoom needed.",
      color: "bg-zinc-50",
      visual: (
        <div className="flex items-center gap-3 w-max mx-auto mt-6 bg-white border-2 border-zinc-800 rounded-full px-4 py-2 shadow-sm">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-zinc-800" />
            <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-zinc-800" />
          </div>
          <div className="flex items-center gap-1 h-4">
            <div className="w-1 h-full bg-green-500 rounded-full animate-pulse" />
            <div className="w-1 h-2/3 bg-green-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-full bg-green-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      ),
    },
    {
      title: "Infinite Templates",
      description:
        "Drop in Kanban boards, user journey maps, and frameworks in one single click.",
      color: "bg-zinc-50",
      visual: (
        <div className="flex gap-2 w-full h-24 mt-4">
          <div className="flex-1 border-2 border-zinc-800 rounded bg-white flex flex-col p-1 gap-1">
            <div className="w-full h-2 bg-zinc-200 rounded-sm" />
            <div className="w-full h-6 bg-amber-100 border border-zinc-800 rounded-sm" />
            <div className="w-full h-6 bg-blue-100 border border-zinc-800 rounded-sm" />
          </div>
          <div className="flex-1 border-2 border-zinc-800 rounded bg-white flex flex-col p-1 gap-1">
            <div className="w-full h-2 bg-zinc-200 rounded-sm" />
            <div className="w-full h-6 bg-pink-100 border border-zinc-800 rounded-sm" />
          </div>
          <div className="flex-1 border-2 border-zinc-800 rounded bg-white flex flex-col p-1 gap-1">
            <div className="w-full h-2 bg-zinc-200 rounded-sm" />
          </div>
        </div>
      ),
    },
    {
      title: "Time-Travel History",
      description:
        "Accidentally deleted the architecture diagram? Scrub back in time and restore it.",
      color: "bg-white",
      visual: (
        <div className="flex flex-col gap-2 w-full mt-6 px-2">
          <div className="flex justify-between text-xs text-zinc-500 font-medium">
            <span>Yesterday</span>
            <span className="text-blue-600 font-bold">10:42 AM</span>
            <span>Now</span>
          </div>
          <div className="relative w-full h-2 bg-zinc-200 rounded-full border border-zinc-400">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-6 bg-white border-2 border-zinc-800 rounded shadow-sm cursor-pointer" />
            <div className="absolute left-0 top-0 h-full w-1/2 bg-blue-200 rounded-l-full" />
          </div>
        </div>
      ),
    },
  ];

  // FIX: Swapped to useLayoutEffect and simplified GSAP scope/matchMedia handling
  useLayoutEffect(() => {
    // gsap.matchMedia acts as its own context scope, so we don't need gsap.context()
    let mm = gsap.matchMedia(sectionRef);

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // We add '0' at the end of each animation so they all start simultaneously on the timeline
      tl.to(rightColumnRef.current, { y: -250, ease: "none" }, 0);
      tl.to(leftColumnRef.current, { y: 50, ease: "none" }, 0);

      // Background parallax shapes
      tl.to(
        float1Ref.current,
        { y: 300, scale: 1.2, rotation: 45, ease: "none" },
        0,
      );
      tl.to(float2Ref.current, { y: -400, rotation: -25, ease: "none" }, 0);
      tl.to(
        float3Ref.current,
        { y: 150, x: -100, rotation: 90, ease: "none" },
        0,
      );
    });

    // Cleanup ensures the ScrollTrigger doesn't duplicate if the component remounts
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-24 md:py-32 px-4 md:px-8 w-full font-poppins relative overflow-hidden bg-secondarybackground mt-16"
    >
      {/* --- BACKGROUND PARALLAX SHAPES --- */}
      <div
        ref={float1Ref}
        className="absolute top-10 left-[-5%] w-64 h-64 border-1 border-dashed border-zinc-400 rounded-full z-0 opacity-60 pointer-events-none"
      />
      <div
        ref={float2Ref}
        className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-amber-100 border-2 border-zinc-300 rounded-[40px] z-0 opacity-50 rotate-12 pointer-events-none"
      />
      <div
        ref={float3Ref}
        className="absolute top-[40%] right-[20%] w-32 h-12 bg-pink-100 border-2 border-pink-200 rounded-full z-0 opacity-70 -rotate-12 pointer-events-none"
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 tracking-tight max-w-2xl">
          Everything you need to <br className="hidden md:block" /> shape your
          ideas.
        </h2>
        <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
          Powerful tools that stay out of your way until you need them.
        </p>
      </div>

      {/* Parallax Grid Container */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-4 relative z-10">
        {/* Left Column */}
        <div ref={leftColumnRef} className="flex flex-col gap-8 md:gap-12">
          {[features[0], features[2]].map((feature, index) => (
            <div
              key={`left-${index}`}
              className={`flex flex-col p-8 md:p-10 rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#27272a] transition-all duration-300 ${feature.color}`}
            >
              <h3 className="text-3xl font-instrument font-medium text-zinc-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 leading-relaxed text-sm">
                {feature.description}
              </p>
              {feature.visual}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div
          ref={rightColumnRef}
          className="flex flex-col gap-8 md:gap-12 md:mt-48"
        >
          {[features[1], features[3]].map((feature, index) => (
            <div
              key={`right-${index}`}
              className={`flex flex-col p-8 md:p-10 rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#27272a] transition-all duration-300 ${feature.color}`}
            >
              <h3 className="text-3xl font-instrument font-medium text-zinc-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 leading-relaxed text-sm">
                {feature.description}
              </p>
              {feature.visual}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
