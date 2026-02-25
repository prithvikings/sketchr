import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const Templates = () => {
  const containerRef = useRef(null);

  const templates = [
    {
      id: 1,
      title: "Sprint Retrospective",
      category: "Agile",
      price: "Free",
      author: "Sketchr Team",
      color: "bg-green-100",
    },
    {
      id: 2,
      title: "Customer Journey Map",
      category: "UX Design",
      price: "$4.99",
      author: "Alex UI/UX",
      color: "bg-pink-100",
    },
    {
      id: 3,
      title: "SaaS Pricing Strategy",
      category: "Business",
      price: "$9.99",
      author: "Growth Labs",
      color: "bg-amber-100",
    },
    {
      id: 4,
      title: "Kanban Workflow",
      category: "Agile",
      price: "Free",
      author: "Sketchr Team",
      color: "bg-blue-100",
    },
    {
      id: 5,
      title: "Brand Identity Board",
      category: "Design",
      price: "Pro",
      author: "Studio Nu",
      color: "bg-purple-100",
    },
    {
      id: 6,
      title: "Wireframe Kit V2",
      category: "UX Design",
      price: "$12.00",
      author: "Systematic",
      color: "bg-zinc-100",
    },
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".template-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.5)",
          clearProps: "all",
        },
      );

      gsap.fromTo(
        ".header-elem",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto relative bg-primarybackground h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:p-4 max-md:pb-32"
    >
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-md:mb-6 max-md:gap-4">
        <div className="header-elem">
          <h2 className="font-instrument text-4xl font-bold text-zinc-900 mb-2 max-md:text-3xl">
            Template Gallery
          </h2>
          <p className="text-zinc-600 font-poppins text-lg max-md:text-sm">
            Kickstart your workflow with pre-built boards.
          </p>
        </div>

        {/* Categories */}
        <div className="header-elem flex flex-wrap gap-3 max-md:gap-2">
          <button className="px-5 py-2 bg-zinc-900 border-2 border-zinc-900 rounded-[24px] font-bold text-white shadow-[4px_4px_0px_#fcd34d] hover:-translate-y-0.5 transition-all max-md:px-4 max-md:py-1.5 max-md:text-sm">
            All
          </button>
          <button className="px-5 py-2 bg-white border-2 border-zinc-800 rounded-[24px] font-bold text-zinc-800 hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all max-md:px-4 max-md:py-1.5 max-md:text-sm">
            UX Design
          </button>
          <button className="px-5 py-2 bg-white border-2 border-zinc-800 rounded-[24px] font-bold text-zinc-800 hover:shadow-[4px_4px_0px_#27272a] hover:-translate-y-0.5 transition-all max-md:px-4 max-md:py-1.5 max-md:text-sm">
            Agile
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12 max-md:gap-4 max-md:pb-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`template-card flex flex-col justify-between ${tpl.color} border-2 border-zinc-800 rounded-[32px] p-6 h-[320px] shadow-[8px_8px_0px_#27272a] hover:shadow-[12px_12px_0px_#27272a] hover:-translate-y-2 transition-all duration-200 max-md:h-[280px] max-md:p-4 max-md:shadow-[4px_4px_0px_#27272a]`}
          >
            {/* Thumbnail Preview */}
            <div className="w-full h-[120px] bg-white border-2 border-zinc-800 rounded-[16px] mb-4 relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:12px_12px] max-md:h-[100px] max-md:mb-3">
              {/* Abstract layout shapes */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-zinc-200 border-2 border-zinc-800 rounded-full max-md:w-6 max-md:h-6"></div>
              <div className="absolute top-4 left-14 w-20 h-4 bg-zinc-200 border-2 border-zinc-800 rounded-[4px] max-md:left-12 max-md:w-16"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-amber-200 border-2 border-zinc-800 rounded-[8px] max-md:w-8 max-md:h-8"></div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2 max-md:mb-1">
                  <h3 className="font-instrument text-2xl font-bold text-zinc-900 leading-tight max-md:text-xl">
                    {tpl.title}
                  </h3>
                </div>
                <p className="text-sm font-poppins text-zinc-600 mb-2 max-md:text-xs">
                  By {tpl.author}
                </p>
                <span className="inline-block px-3 py-1 bg-white border-2 border-zinc-800 rounded-[12px] text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#27272a]">
                  {tpl.category}
                </span>
              </div>

              {/* Action Button */}
              <button
                className={`w-full mt-4 py-3 border-2 border-zinc-800 rounded-[24px] font-bold transition-all shadow-[4px_4px_0px_#27272a] hover:shadow-[6px_6px_0px_#27272a] hover:-translate-y-1 flex justify-between items-center px-6 max-md:py-2 max-md:px-4 max-md:shadow-[2px_2px_0px_#27272a] max-md:mt-2
                  ${
                    tpl.price === "Free"
                      ? "bg-white text-zinc-900"
                      : tpl.price === "Pro"
                        ? "bg-pink-200 text-zinc-900"
                        : "bg-zinc-900 text-white"
                  }`}
              >
                <span className="max-md:text-sm">
                  {tpl.price === "Free"
                    ? "Use Template"
                    : tpl.price === "Pro"
                      ? "Unlock with Pro"
                      : "Purchase"}
                </span>
                <span className="font-instrument text-lg max-md:text-base">
                  {tpl.price}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Templates;
