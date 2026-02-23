import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const UseCases = () => {
  const containerRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  // Strictly 3 cards now
  const useCases = [
    {
      team: "Product Teams",
      title: "Map the user journey, together.",
      description: "Plan sprints, build flowcharts, and align stakeholders on product roadmaps in a shared, infinite space.",
      color: "bg-blue-100",
      tags: ["Sprint Planning", "Roadmaps", "User Flows"],
      icon: "🗺️"
    },
    {
      team: "Designers",
      title: "A limitless canvas for your moodboards.",
      description: "Paste inspiration, leave visual feedback on UI components, and run live design critiques without screen-sharing lag.",
      color: "bg-pink-100",
      tags: ["Moodboards", "Critiques", "Wireframes"],
      icon: "🎨"
    },
    {
      team: "Engineering",
      title: "Visualize complex architectures.",
      description: "Draw database schemas, map out API endpoints, and troubleshoot server logic with intelligent diagramming tools.",
      color: "bg-amber-100",
      tags: ["System Design", "Schemas", "Debugging"],
      icon: "⚙️"
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Apply complex horizontal scroll ONLY on desktop
      mm.add("(min-width: 768px)", () => {
        const cardsWrapper = cardsWrapperRef.current;
        const cards = gsap.utils.toArray(".use-case-card");

        // 1. The Horizontal Scroll Animation
        gsap.fromTo(cardsWrapper, 
          { 
            // FIX 1: Start much closer! The first card will now be immediately visible on the right.
            x: () => window.innerWidth * 0.7 
          },
          {
            x: () => {
              // Keeps your perfectly framed end-state
              const overflow = cardsWrapper.scrollWidth - window.innerWidth + 64; 
              return overflow > 0 ? -overflow : 0; 
            }, 
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,
              // FIX 2: Pin exactly when the section hits the top of the screen
              start: "top top", 
              // FIX 3: Shortened the scroll track so it feels snappier and less tedious
              end: "+=100%", 
              scrub: 1,
              invalidateOnRefresh: true, 
            }
          }
        );

        // 2. The Velocity Skew Effect (Cards lean as you scroll)
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(cards, "skewX", "deg"),
            clamp = gsap.utils.clamp(-10, 10); 

        ScrollTrigger.create({
          onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -200);
            
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="border-y border-b-0 border-dashed border-zinc-400 overflow-hidden relative z-10 bg-secondarybackground">
      
      {/* Pinned Container */}
      <div 
        ref={containerRef} 
        className="min-h-screen w-full flex flex-col justify-center py-12"
      >
        
        {/* Central Layout Container - Ensures the end-state perfectly aligns with the rest of your site */}
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 flex flex-col">
          
          {/* Fixed Header */}
          <div className="w-full mb-8 md:mb-16">
            <p className="text-sm font-poppins font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Use Cases
            </p>
            <h2 className="text-4xl md:text-6xl font-instrument text-zinc-900 tracking-tight">
              Built for teams <br className="hidden md:block" /> that move fast.
            </h2>
          </div>

          {/* Scrolling Track Wrapper */}
          <div className="w-full relative overflow-visible">
            <div 
              ref={cardsWrapperRef} 
              className="flex flex-row items-center gap-6 md:gap-8 w-max"
            >
              {useCases.map((item, index) => (
                <div 
                  key={index} 
                  className={`use-case-card flex flex-col justify-between w-[85vw] md:w-[320px] lg:w-[340px] h-[380px] md:h-[420px] p-6 md:p-8 rounded-[28px] md:rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#27272a] transition-all duration-300 shrink-0 ${item.color}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b-2 border-zinc-800/20 pb-4">
                    <span className="font-poppins font-semibold text-zinc-900 text-base md:text-lg">
                      {item.team}
                    </span>
                    <span className="text-3xl md:text-4xl filter drop-shadow-sm">{item.icon}</span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col gap-3 md:gap-4 mt-4 grow">
                    <h3 className="text-2xl md:text-3xl font-instrument font-medium text-zinc-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-700 font-poppins leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags/Pills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2 md:px-3 py-1 bg-white border border-zinc-800 rounded-full text-[10px] md:text-xs font-poppins font-medium text-zinc-800 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UseCases;