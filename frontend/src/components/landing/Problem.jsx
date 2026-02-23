import React from "react";

const Problem = () => {
  const problems = [
    {
      title: "Words aren't enough",
      description: "Explaining complex visual ideas over a video call or text chat is frustrating and leads to constant misunderstandings.",
      icon: "https://em-content.zobj.net/source/apple/419/speaking-head_1f5e3-fe0f.png"
    },
    {
      title: "Screen sharing is a one-way street",
      description: "Watching someone else draw while you just talk isn't true collaboration. It kills team creativity and momentum.",
      icon: "https://em-content.zobj.net/source/apple/419/television_1f4fa.png"
    },
    {
      title: "Scattered, dead notes",
      description: "Taking screenshots of virtual whiteboards and pasting them into docs makes it hard to pick up where you left off.",
      icon: "https://em-content.zobj.net/source/apple/419/memo_1f4dd.png"
    }
  ];

  return (
    <div className="py-24 px-4 md:px-8 w-full flex flex-col items-center justify-center gap-16 font-poppins">
      
      {/* Section Header */}
      <div className="heading-title flex flex-col gap-4 items-center">
        <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 text-center tracking-tight">
          Remote brainstorming is broken.
        </h2>
        <p className="text-sm text-center text-zinc-600 max-w-md leading-relaxed">
          Current tools force you to choose between complicated design software or rigid, single-player note apps.
        </p>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {problems.map((problem, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-4 p-6 border border-zinc-400 border-dashed rounded-2xl bg-primarybackground/50 hover:bg-primarybackground transition-colors duration-300"
          >
            <div className="text-3xl bg-secondarybackground w-12 h-12 flex items-center justify-center rounded-lg border border-zinc-200">
              <img src={problem.icon} alt={problem.title} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-zinc-800 font-instrument mt-2">
              {problem.title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {problem.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Problem;