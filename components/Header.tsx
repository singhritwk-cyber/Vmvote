"use client";

import React from "react";
import { useServerSettings } from "../hooks/useServerSettings";

export default function Header() {
  const { settings } = useServerSettings();

  return (
    <header className="flex flex-col items-center justify-center text-center py-4 select-none" id="server-header">
      {/* Server Logo with increased spacing below it to make a prominent gap */}
      <div className="mb-12 md:mb-14" id="logo-container">
        <img
          src={settings.logoUrl}
          alt={`${settings.serverName} Server Logo`}
          width={240}
          className="h-auto block hover:scale-105 transition-transform duration-300 rounded-[16px] shadow-2xl border border-neutral-900/60"
          referrerPolicy="no-referrer"
          id="logo-image"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Server Name */}
      <h1 className="text-4xl md:text-5xl font-extrabold font-mono tracking-wider text-white mb-2" id="server-title">
        {settings.serverName}
      </h1>
    </header>
  );
}
