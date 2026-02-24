import React from "react";
import {AnimatedThemeToggle} from "../animated-theme-toggle";

const Navbar = () => {
  const links=[
    "Features",
    "Pricing",
    "Demo"
  ];
  return <div className="p-4 px-8 flex items-center justify-between font-poppins">
    <div className="leftlogo">
      <h1 className="text-3xl font-instrument font-medium text-zinc-700">Sketchr.</h1>
    </div>
    <div className="right flex items-center gap-8">
      <div className="links flex items-center gap-6 text-[13px]">
        {links.map((link,index)=>(
          <a key={index} href={`#${link.toLowerCase()}`} className="text-zinc-600 hover:text-zinc-900 transition-colors duration-300">{link}</a>
        ))}
      </div>
      <div className="buttons flex items-center gap-4">
        <div className="theme">
          <AnimatedThemeToggle />
        </div>
        <div className="getstart">
          <button className="px-2 py-1 bg-primarybackground text-zinc-900 text-sm rounded hover:bg-primarybackground/80 transition-colors duration-300">
            Get started
          </button>
        </div>
      </div>
    </div>
  </div>;
};

export default Navbar;
