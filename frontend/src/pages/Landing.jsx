import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Modal state
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // FIX 1: Lock background scrolling when modal is open
  useEffect(() => {
    if (isDemoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function in case component unmounts while modal is open
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDemoOpen]);

  return (
    <div className="w-full bg-primarybackground overflow-hidden relative">
      <div ref={containerRef} className="relative min-h-screen w-full">
        <div className="max-w-6xl bg-secondarybackground min-h-screen mx-auto border-x border-dashed border-zinc-400 pointer-events-none relative z-0">
          <div className="pointer-events-auto">
            <Navbar onOpenDemo={() => setIsDemoOpen(true)} />
            <Hero onOpenDemo={() => setIsDemoOpen(true)} />
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

      {/* VIDEO DEMO MODAL */}
      <AnimatePresence>
        {isDemoOpen && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-zinc-900/70 backdrop-blur-md"
            onPointerDown={() => setIsDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-white border-4 border-zinc-900 rounded-[32px] p-2 shadow-[12px_12px_0px_#27272a] w-full max-w-5xl relative flex flex-col"
            >
              <button
                onClick={() => setIsDemoOpen(false)}
                className="absolute -top-5 -right-5 md:-top-6 md:-right-6 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-2 border-zinc-900 rounded-full flex items-center justify-center font-bold text-xl hover:scale-110 hover:shadow-[4px_4px_0px_#27272a] transition-all z-10"
              >
                ✕
              </button>

              <div className="aspect-video w-full rounded-[20px] overflow-hidden border-2 border-zinc-900 bg-zinc-100">
                {/* FIX 2: Added &mute=1 to force autoplay in modern browsers */}
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                  title="Sketchr Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
