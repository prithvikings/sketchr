import React, { useRef } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Problem from "../components/landing/Problem";
import Solution from "../components/landing/Solution";
import Features from "../components/landing/Features";
import Usecases from "../components/landing/Usecases";
import Architecture from "../components/landing/Architecture";
import Pricing from "../components/landing/Pricing";
import FinalCTA from "../components/landing/FinalCTA";
import DraggableStickyNotes from "../components/landing/components/DraggableStickyNotes"; 
import HowItWorks from "../components/landing/HowItWorks";

const Landing = () => {
  const containerRef = useRef(null);

  return (
    <div className="w-full bg-primarybackground overflow-hidden">
      
      <div ref={containerRef} className="relative min-h-screen w-full">
        <div className="max-w-6xl bg-secondarybackground min-h-screen mx-auto border-x border-dashed border-zinc-400 pointer-events-none relative z-0">
          <div className="pointer-events-auto">
            <Navbar />
            <Hero />
          </div>
        </div>
        <DraggableStickyNotes containerRef={containerRef} />
      </div>

      <div className="relative w-full">
        <div className="max-w-6xl bg-secondarybackground min-h-screen mx-auto border-x border-dashed border-zinc-400 relative z-0">
          <Problem />
          <Solution />
          <Features />
          <HowItWorks />
          <Usecases />
          <Architecture />
          <Pricing />
          <FinalCTA />
        </div>
      </div>

    </div>
  );
};

export default Landing;