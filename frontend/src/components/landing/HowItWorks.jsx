import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create a Room",
      description: "Click one button to instantly spin up a secure, infinite canvas. No forced sign-ups, no credit cards, no friction.",
      color: "bg-blue-100",
      rotation: "-rotate-1"
    },
    {
      number: "2",
      title: "Share the Link",
      description: "Copy your unique room URL and drop it into Slack, Teams, or an email. Anyone with the link can jump right in.",
      color: "bg-pink-100",
      rotation: "rotate-1"
    },
    {
      number: "3",
      title: "Start Collaborating",
      description: "See your team's cursors fly across the screen in real-time. Sketch, type, and map out your ideas together.",
      color: "bg-green-100",
      rotation: "-rotate-1"
    }
  ];

  return (
    <div className="py-24 md:py-32 px-4 md:px-8 w-full font-poppins relative z-10 bg-secondarybackground border-t border-dashed border-zinc-400">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-20">
        <p className="text-sm font-poppins font-semibold text-zinc-500 uppercase tracking-widest">
          How It Works
        </p>
        <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 tracking-tight max-w-2xl">
          From zero to sketching <br className="hidden md:block" /> in five seconds.
        </h2>
      </div>

      {/* Steps Container */}
      <div className="max-w-6xl mx-auto relative px-4">
        
        {/* Decorative Connecting Line (Desktop only) */}
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 border-t-4 border-dashed border-zinc-300 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col p-8 md:p-10 rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#27272a] transition-all duration-300 bg-white ${step.rotation}`}
            >
              {/* Massive Number Badge */}
              <div className={`w-20 h-20 mb-8 rounded-2xl border-2 border-zinc-800 flex items-center justify-center shadow-[4px_4px_0px_#27272a] ${step.color}`}>
                <span className="text-4xl font-instrument font-bold text-zinc-900">
                  {step.number}
                </span>
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-instrument font-medium text-zinc-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;