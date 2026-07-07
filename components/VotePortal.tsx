"use client";

import React, { useState, useEffect } from "react";
import { useServerSettings } from "../hooks/useServerSettings";
import { Copy, Check } from "lucide-react";

export default function VotePortal() {
  const { settings } = useServerSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [iframeUrl, setIframeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const voteSites = settings.voteSites || [];
  
  // Safe bounds check
  const activeIndex = Math.min(currentIndex, Math.max(0, voteSites.length - 1));
  const currentSite = voteSites[activeIndex];

  // Update iframe URL safely on the client side
  useEffect(() => {
    if (currentSite) {
      // Use query parameter instead of sub-path to load index.html safely on static hosts (e.g. GCS)
      // and prevent NoSuchKey (404) errors inside the iframe.
      setIframeUrl(`${window.location.origin}/?site=${currentSite.id}&v=${Date.now()}`);
    }
  }, [activeIndex, currentSite?.id, voteSites]);

  const handleNext = () => {
    if (currentIndex < voteSites.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(settings.serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (voteSites.length === 0) {
    return (
      <div className="text-center text-neutral-500 font-mono py-8" id="no-sites-message">
        No voting sites configured.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl px-4 py-4 select-none" id="vote-portal">
      {/* Centered Iframe container */}
      <div className="w-full aspect-[4/3] max-h-[380px] md:max-h-[420px] bg-black border border-neutral-800 rounded-[8px] overflow-hidden shadow-inner relative" id="iframe-container">
        {iframeUrl && currentSite ? (
          <iframe
            src={iframeUrl}
            title={`Vote Site Portal - ${currentSite.name}`}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            id="vote-iframe"
            key={iframeUrl} // Force re-render of iframe when URL changes
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-mono text-sm" id="iframe-loading">
            Loading Portal...
          </div>
        )}
      </div>

      {/* Progress status indicators */}
      <div className="flex items-center justify-center gap-2" id="progress-dots">
        {voteSites.map((site, index) => (
          <div
            key={site.id}
            className={`w-2.5 h-2.5 rounded-full ${
              index === activeIndex
                ? "bg-[#a855f7]"
                : index < activeIndex
                ? "bg-neutral-800"
                : "bg-neutral-950 border border-neutral-900"
            }`}
            id={`progress-dot-${index}`}
          />
        ))}
        <span className="ml-2 text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold" id="step-indicator-text">
          STEP {String(activeIndex + 1).padStart(2, "0")} / {String(voteSites.length).padStart(2, "0")}
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center max-w-2xl mt-2 mb-10" id="navigation-bar">
        {/* Previous Site */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`w-full sm:w-auto flex-1 py-4 px-6 font-bold text-center rounded-[8px] cursor-pointer select-none font-mono ${
            activeIndex === 0
              ? "bg-[#1a1a1a] text-[#444444] cursor-not-allowed border-none"
              : "bg-[#7e22ce] text-white hover:bg-[#6b21a8] border-none"
          }`}
          id="prev-site-btn"
        >
          &larr; Previous Site
        </button>

        {/* Next Site */}
        <button
          onClick={handleNext}
          disabled={activeIndex === voteSites.length - 1}
          className={`w-full sm:w-auto flex-1 py-4 px-6 font-bold text-center rounded-[8px] cursor-pointer select-none font-mono ${
            activeIndex === voteSites.length - 1
              ? "bg-[#1a1a1a] text-[#444444] cursor-not-allowed border-none"
              : "bg-[#7e22ce] text-white hover:bg-[#6b21a8] border-none"
          }`}
          id="next-site-btn"
        >
          Next Site &rarr;
        </button>
      </div>

      {/* Prominent, Larger Server IP block below Next Site (fully clickable to copy) */}
      <div 
        onClick={handleCopy}
        className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between bg-neutral-950/80 border border-neutral-800 hover:border-[#a855f7] px-8 py-6 rounded-[12px] cursor-pointer transition-all duration-300 select-none group active:scale-[0.99] shadow-2xl relative overflow-hidden" 
        id="bottom-ip-block"
        title="Click to copy Minecraft Server IP"
      >
        {/* Subtle purple background glow effect on hover */}
        <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 relative z-10" id="ip-text-group">
          <span className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest group-hover:text-neutral-400 transition-colors" id="ip-instruction">
            {copied ? "IP COPIED TO CLIPBOARD!" : "CLICK TO COPY IP ADDRESS"}
          </span>
          <span className="text-[#a855f7] font-mono text-2xl sm:text-3xl font-black tracking-widest select-all" id="ip-text">
            {settings.serverIp}
          </span>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-center p-3 bg-neutral-900 border border-neutral-800 rounded-[8px] text-[#a855f7] group-hover:bg-[#a855f7]/10 group-hover:border-[#a855f7]/40 transition-all duration-300 relative z-10" id="ip-icon-container">
          {copied ? (
            <Check className="w-6 h-6 text-green-500 animate-pulse" id="ip-success-icon" />
          ) : (
            <Copy className="w-6 h-6 group-hover:scale-110 transition-transform" id="ip-copy-icon" />
          )}
        </div>
      </div>
    </div>
  );
}
