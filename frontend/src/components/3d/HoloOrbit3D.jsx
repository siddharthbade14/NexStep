import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

export const HoloOrbit3D = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D PERSPECTIVE STAGE */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center perspective-1500">
        
        {/* Ambient Center Glow */}
        <div className="absolute w-44 h-44 rounded-full bg-teal-500/20 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute w-36 h-36 rounded-full bg-amber-500/15 blur-xl animate-pulse pointer-events-none" />

        {/* 3D ORBITAL RING 1 (X-Axis Plane) */}
        <div className="absolute w-72 h-72 sm:w-84 sm:h-84 rounded-full border-2 border-dashed border-teal-400/30 animate-spin-3d-x preserve-3d pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-teal-400 shadow-lg shadow-teal-500/50" />
        </div>

        {/* 3D ORBITAL RING 2 (Y-Axis Plane) */}
        <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full border-2 border-teal-300/25 animate-spin-3d-y preserve-3d pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50" />
        </div>

        {/* 3D ORBITAL RING 3 (Z-Axis / Diagonal Plane) */}
        <div className="absolute w-80 h-80 sm:w-92 sm:h-92 rounded-full border border-amber-400/20 animate-spin-3d-z preserve-3d pointer-events-none">
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
        </div>

        {/* 3D FLOATING CORE HOLO-CUBE */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-900/90 backdrop-blur-xl border-2 border-teal-500/60 shadow-2xl flex flex-col items-center justify-center p-3 text-center space-y-1 animate-float-3d">
          {/* Cyber HUD Corner Accents */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/40">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>

          <div className="text-[11px] font-black tracking-tight text-white">
            NEXSTEP AI
          </div>
          <div className="text-[9px] font-mono text-[#F4B942] font-bold">
            HMAC-SHA256
          </div>
        </div>

        {/* SATELLITE 1: SEMANTIC GAP ENGINE (Top Left) */}
        <div className="absolute -top-3 left-4 sm:left-6 z-20 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-teal-500/40 shadow-xl flex items-center gap-2 hover:scale-110 transition-transform">
          <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="pr-1">
            <div className="text-[10px] font-bold text-white leading-tight">Semantic Gap AI</div>
            <div className="text-[9px] text-teal-400 font-mono">MiniLM-L6-v2</div>
          </div>
        </div>

        {/* SATELLITE 2: HARDENED SANDBOX (Top Right) */}
        <div className="absolute top-2 right-2 sm:right-4 z-20 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center gap-2 hover:scale-110 transition-transform">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="pr-1">
            <div className="text-[10px] font-bold text-white leading-tight">AST Sandbox</div>
            <div className="text-[9px] text-amber-400 font-mono">2.5s Timeout</div>
          </div>
        </div>

        {/* SATELLITE 3: CRYPTOGRAPHIC PROOF (Bottom Left) */}
        <div className="absolute bottom-2 left-2 sm:left-4 z-20 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 shadow-xl flex items-center gap-2 hover:scale-110 transition-transform">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="pr-1">
            <div className="text-[10px] font-bold text-white leading-tight">Proof-of-Work</div>
            <div className="text-[9px] text-emerald-400 font-mono">Tamper-Proof</div>
          </div>
        </div>

        {/* SATELLITE 4: RECRUITER VERIFIED HIRED (Bottom Right) */}
        <div className="absolute -bottom-3 right-4 sm:right-6 z-20 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 shadow-xl flex items-center gap-2 hover:scale-110 transition-transform">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="pr-1">
            <div className="text-[10px] font-bold text-white leading-tight">Fast-Track Hired</div>
            <div className="text-[9px] text-cyan-400 font-mono">Top Indian Tech</div>
          </div>
        </div>

      </div>
    </div>
  );
};
