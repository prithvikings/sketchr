import React from "react";

const FinalCTA = () => {
  return (
    <div className="pt-24 md:pt-32 pb-8 px-4 md:px-8 w-full font-poppins relative z-10 bg-secondarybackground border-t border-dashed border-zinc-400 flex flex-col items-center">
      
      {/* Massive CTA Card */}
      <div className="w-full max-w-5xl bg-amber-200 border-4 border-zinc-900 rounded-[40px] p-12 md:p-20 flex flex-col items-center text-center shadow-[16px_16px_0px_#27272a] relative overflow-hidden">
        
        {/* Decorative background shapes */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 rotate-12 hidden md:block">✏️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 -rotate-12 hidden md:block">💡</div>
        <div className="absolute top-1/2 left-4 w-16 h-16 border-4 border-dashed border-zinc-900 rounded-full opacity-10 hidden lg:block" />
        <div className="absolute bottom-1/4 right-8 w-12 h-12 bg-zinc-900 rotate-45 opacity-10 hidden lg:block" />

        <h2 className="text-5xl md:text-7xl font-instrument font-medium text-zinc-900 tracking-tight leading-tight mb-6 relative z-10">
          Ready to clear <br className="hidden md:block" /> your mind?
        </h2>
        
        <p className="text-lg md:text-xl text-zinc-800 font-medium mb-10 max-w-lg relative z-10">
          Jump into an infinite canvas right now. No sign-up required for your first board.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white text-lg font-semibold rounded-2xl border-2 border-zinc-900 hover:bg-zinc-800 hover:-translate-y-1 transition-all duration-200 shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#ffffff]">
            Create a Free Room
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-zinc-900 text-lg font-semibold rounded-2xl border-2 border-zinc-900 hover:bg-amber-300 hover:-translate-y-1 transition-all duration-200">
            Talk to Sales
          </button>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="w-full max-w-6xl mt-24 pt-8 border-t-2 border-zinc-800/10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h1 className="text-2xl font-instrument font-medium text-zinc-900">Sketchr</h1>
          <p className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} Sketchr Inc. All rights reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-zinc-600">
          <a href="#" className="hover:text-zinc-900 transition-colors">Twitter</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">GitHub</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
        </div>
        
      </footer>

    </div>
  );
};

export default FinalCTA;