"use client";

import React from "react";
import Header from "../components/Header";
import VotePortal from "../components/VotePortal";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center py-8 px-4" id="nextjs-main-container">
      {/* Thin neon purple glowing border around the entire viewport */}
      <div 
        className="fixed inset-0 pointer-events-none border border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.4),0_0_15px_rgba(168,85,247,0.4)] z-50"
        id="neon-glow-border"
      ></div>

      {/* Center Layout wrapper */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-4 relative z-10" id="main-content-layout">
        <Header />
        <VotePortal />
      </div>
    </main>
  );
}
