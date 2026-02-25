import React from "react";
import { Link, useNavigate } from "react-router-dom";
import githubIcon from "../../assets/GitHub.svg";

const Navbar = ({ onOpenDemo }) => {
  const navigate = useNavigate();
  const links = ["Features", "Pricing", "Demo"];

  return (
    <div className="max-w-6xl mx-auto p-4 px-4 lg:px-8 flex items-center justify-between font-poppins">
      <div className="leftlogo">
        <h1 className="text-2xl lg:text-3xl font-instrument font-medium text-zinc-900 tracking-tight">
          Sketchr.
        </h1>
      </div>

      <div className="right flex items-center gap-4 lg:gap-6">
        <div className="links hidden md:flex items-center gap-4 lg:gap-6 text-[12px]">
          {links.map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => {
                if (link === "Demo") {
                  e.preventDefault();
                  onOpenDemo();
                }
              }}
              className="text-zinc-700 hover:text-zinc-800 transition-colors duration-300 font-poppins font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="buttons flex items-center gap-3 lg:gap-5">
          <Link
            to="https://github.com/prithvikings/sketchr"
            target="_blank"
            rel="noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <img
              src={githubIcon}
              alt="GitHub Repository"
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </Link>

          <div className="getstart">
            <button
              onClick={() => navigate("/auth")}
              className="px-2 py-1 bg-primarybackground text-zinc-900 text-[13px] rounded hover:bg-primarybackground/80 transition-colors duration-300 font-poppins font-medium cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
