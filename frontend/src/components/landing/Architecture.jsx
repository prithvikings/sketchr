import React from "react";
import brain from "../../assets/brain.png";
import Laptop from "../../assets/laptop.png";
import thunder from "../../assets/thunder.png";

const Architecture = () => {
  const stack = [
    {
      step: "01",
      title: "Local Canvas",
      tech: "React + HTML5 Canvas",
      description:
        "Interactions are rendered instantly on the client at 60fps for zero-latency drawing and dragging.",
      color: "bg-pink-100",
      icon: Laptop,
    },
    {
      step: "02",
      title: "Sync Engine",
      tech: "Socket.io + Node.js",
      description:
        "Deltas (changes) are streamed to our edge servers via persistent, low-latency Socket connections.",
      color: "bg-blue-100",
      icon: thunder,
    },
    {
      step: "03",
      title: "State Resolution",
      tech: "CRDTs + Yjs",
      description:
        "Conflict-Free Replicated Data Types merge edits from multiple users flawlessly without locking.",
      color: "bg-amber-100",
      icon: brain,
    },
  ];

  return (
    <div className="py-24 md:py-32 px-4 md:px-8 w-full font-poppins relative z-10 bg-secondarybackground border-t border-dashed border-zinc-400 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-20">
        <p className="text-sm font-poppins font-semibold text-zinc-500 uppercase tracking-widest">
          Under the Hood
        </p>
        <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 tracking-tight max-w-2xl">
          Engineered for <br className="hidden md:block" /> absolute scale.
        </h2>
        <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
          We don't just sync pixels; we sync mathematical states. Here is how we
          keep thousands of cursors perfectly aligned.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative px-4">
        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 border-t-2 border-dashed border-zinc-800 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
          {stack.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col p-8 rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#27272a] transition-all duration-300 ${item.color}`}
            >
              {/* Top Row: Step Number & Icon */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-instrument font-bold text-zinc-800 border-2 border-zinc-800 rounded-full px-3 py-1 bg-white">
                  {item.step}
                </span>
                <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 filter drop-shadow-sm">
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className="w-full h-full object-contain"
                  />
                </span>
              </div>

              {/* Node Info */}
              <h3 className="text-2xl font-instrument font-medium text-zinc-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs font-mono font-semibold text-zinc-600 mb-4 bg-white/50 w-max px-2 py-1 rounded border border-zinc-800/20">
                {item.tech}
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed mt-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Architecture;
