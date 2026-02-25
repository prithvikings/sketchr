import React from "react";
import { motion } from "motion/react";

// Import your local images
import colourpallet from "../../../assets/colourpallet.png";
import rocket from "../../../assets/rocket.png";

const DraggableStickyNotes = ({ containerRef }) => {
  const stickyNoteBaseStyles =
    "absolute bg-gradient-to-br from-yellow-200 to-amber-300 w-56 h-56 p-5 shadow-lg flex flex-col gap-2 cursor-grab active:cursor-grabbing text-zinc-800 font-handwriting text-2xl leading-tight rounded-bl-xl";

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
          .font-handwriting {
            font-family: 'Caveat', cursive;
          }
          .drawn-checkbox {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #27272a;
            border-radius: 3px;
            outline: none;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .drawn-checkbox:checked::after {
            content: '✓';
            position: absolute;
            font-size: 24px;
            color: #27272a;
            top: -8px;
            left: 2px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Sticky Note 1: Standard Reminder with Tape */}
      <motion.div
        drag
        dragConstraints={containerRef}
        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 50, cursor: "grabbing" }}
        className={`${stickyNoteBaseStyles} top-24 right-24 rotate-3`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 shadow-sm rotate-[-2deg]" />
        <h3 className="font-bold text-3xl mb-1 border-b-2 border-zinc-800/20 inline-block w-max">
          To-Do:
        </h3>
        {/* FIX: Removed flex classes so the image flows inline with the text */}
        <p className="mt-2">
          Don't forget to share the link with the design team!
          {/* Added a space {' '} so the emoji isn't stuck to the last word */}{" "}
          <img
            src={colourpallet}
            alt="palette"
            className="w-6 h-6 object-contain inline-block -mt-1"
          />
        </p>
        <p className="mt-auto text-right text-lg text-zinc-600">- Alex</p>
      </motion.div>

      {/* Sticky Note 2: Interactive Checklist */}
      <motion.div
        drag
        dragConstraints={containerRef}
        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 50, cursor: "grabbing" }}
        className={`${stickyNoteBaseStyles} bottom-48 left-24 -rotate-6`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 shadow-sm rotate-[3deg]" />
        <h3 className="font-bold text-3xl mb-1">Launch Prep:</h3>
        <ul className="flex flex-col gap-2 mt-2">
          <li className="flex items-center gap-2">
            <input type="checkbox" className="drawn-checkbox" defaultChecked />
            <span className="line-through opacity-70">Design UI</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="drawn-checkbox" defaultChecked />
            <span className="line-through opacity-70">Add WebSockets</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="drawn-checkbox" />
            <span>Test dragging</span>
          </li>
        </ul>
      </motion.div>

      {/* Sticky Note 3: Quick Doodle/Approval */}
      <motion.div
        drag
        dragConstraints={containerRef}
        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 50, cursor: "grabbing" }}
        className={`${stickyNoteBaseStyles} top-96 -right-4 rotate-12`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 shadow-sm rotate-[-1deg]" />
        <h3 className="font-bold text-3xl text-red-600 transform -rotate-6 mt-4 border-2 border-red-600 rounded-full text-center py-1 px-2 w-max mx-auto shadow-sm">
          APPROVED!
        </h3>
        {/* FIX: Removed flex classes and added text-center to keep it centered and inline */}
        <p className="mt-4 text-center">
          Wireframes look great. Moving to beta.
          {/* Added a space {' '} for natural spacing */}{" "}
          <img
            src={rocket}
            alt="rocket"
            className="w-6 h-6 object-contain inline-block -mt-1"
          />
        </p>
      </motion.div>
    </>
  );
};

export default DraggableStickyNotes;
