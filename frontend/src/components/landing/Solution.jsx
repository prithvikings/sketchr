import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Solution = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);

  const cards = [
    {
      title: "Real-Time Multiplayer",
      description: "See live cursors and changes instantly. Work together as if you are in the same room, without the lag.",
      bgColor: "bg-amber-100",
      rotation: "-rotate-3",
      icon: "https://em-content.zobj.net/source/apple/419/computer-mouse_1f5b1-fe0f.png"
    },
    {
      title: "Infinite Canvas",
      description: "Never run out of space. Pan, zoom, and organize your ideas without boundaries or page limits.",
      bgColor: "bg-blue-100",
      rotation: "rotate-2",
      icon: "https://em-content.zobj.net/source/apple/419/world-map_1f5fa-fe0f.png"
    },
    {
      title: "Frictionless Sharing",
      description: "Generate a link and invite anyone. Guests can jump in and edit instantly—no account required.",
      bgColor: "bg-pink-100",
      rotation: "-rotate-2",
      icon: "https://em-content.zobj.net/source/apple/419/link_1f517.png"
    },
    {
      title: "Export & Integrate",
      description: "Turn your boards into high-res PDFs, PNGs, or sync directly to your team's Notion workspace.",
      bgColor: "bg-green-100",
      rotation: "rotate-3",
      icon: "https://em-content.zobj.net/source/apple/419/rocket_1f680.png"
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Initial Setup: Hardware acceleration and positioning
      gsap.set(cardsRef.current, { 
        transformOrigin: "top center",
        willChange: "transform, opacity, filter",
      });
      // Hide all cards except the first one initially
      gsap.set(cardsRef.current.slice(1), { y: "150%", opacity: 0 });

      // 2. Create the master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",       // Increased scroll distance for slower, smoother animations
          scrub: 1.5,          // Increased scrub for a more buttery catch-up effect
          pin: pinRef.current, 
          anticipatePin: 1,    // Prevents scrollbar jumping when pinning starts
        }
      });

      // 3. Sequence the animations
      cardsRef.current.forEach((card, index) => {
        if (index === 0) return;

        const label = `card-${index}`;
        tl.add(label); 

        // Animate ALL previous cards individually to maintain staggered depth
        cardsRef.current.slice(0, index).forEach((prevCard, j) => {
          tl.to(
            prevCard,
            {
              // Math ensures Card 0 shrinks more than Card 1 when Card 2 enters
              scale: 1 - ((index - j) * 0.05), 
              y: -((index - j) * 20),
              opacity: 1 - ((index - j) * 0.15),
              filter: `blur(${(index - j) * 2}px)`, // Optional: adds a slight blur to background cards
              duration: 1,
              ease: "power1.inOut", // Fluid easing
            },
            label 
          );
        });

        // Bring the current card up
        tl.to(
          card,
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            ease: "power1.inOut", // Matches the ease of the background cards
          },
          label 
        );
      });
    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <div ref={containerRef} className="w-full relative z-10">
      <div ref={pinRef} className="h-screen w-full flex flex-col items-center justify-center px-4">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 tracking-tight max-w-2xl">
            Everything you need in one infinite workspace.
          </h2>
          <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
            Stop jumping between fragmented tools. We brought the best of physical whiteboarding into the digital space.
          </p>
        </div>

        {/* Cards Stacking Area */}
        <div className="relative w-full max-w-sm md:max-w-md h-[400px] md:h-[450px]">
          {cards.map((card, index) => (
            // OUTER DIV: Strictly controlled by GSAP
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{ zIndex: index + 10 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              {/* INNER DIV: Controls the visual look and static Tailwind rotations */}
              <div 
                className={`flex flex-col justify-between p-8 md:p-10 w-full h-full rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] ${card.bgColor} ${card.rotation}`}
              >
                <div className="grow flex items-center justify-center text-8xl md:text-9xl drop-shadow-sm">
                  <img src={card.icon} alt={card.title} className="w-16 h-16 md:w-32 md:h-32" />
                </div>
                
                <div className="flex flex-col gap-3 mt-8">
                  <h3 className="text-2xl md:text-3xl font-instrument font-medium text-zinc-900 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-700 font-medium leading-relaxed opacity-90 font-poppins">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Solution;