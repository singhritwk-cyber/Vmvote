"use client";

import React from "react";
import AdminPanel from "../../components/AdminPanel";

export default function AdminPage() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center py-8 px-4" id="nextjs-admin-container">
      {/* Thin neon purple glowing border around the entire viewport */}
      <div 
        className="fixed inset-0 pointer-events-none border border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.4),0_0_15px_rgba(168,85,247,0.4)] z-50"
        id="neon-glow-border"
      ></div>

      <div className="w-full max-w-4xl relative z-10" id="main-content-layout">
        <AdminPanel />
      </div>
    </main>
  );
}
