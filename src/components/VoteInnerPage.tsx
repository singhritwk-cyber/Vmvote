import React from "react";
import { useServerSettings } from "../hooks/useServerSettings";

interface VoteInnerPageProps {
  siteId: string;
}

export default function VoteInnerPage({ siteId }: VoteInnerPageProps) {
  const { settings } = useServerSettings();
  const voteSites = settings.voteSites || [];
  
  // Find the current vote site configuration
  const currentSite = voteSites.find((site) => site.id === siteId) || voteSites[0];

  if (!currentSite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 py-8" id="inner-page-not-found">
        <p className="text-neutral-500 font-mono text-sm">Voting site configuration not loaded yet.</p>
      </div>
    );
  }

  const handleOpenSite = () => {
    // Open in a new browser tab, without redirecting the current page.
    window.open(currentSite.voteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 py-8 select-none" id={`vote-inner-page-${siteId}`}>
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6" id="inner-content">
        {/* Site Title */}
        <h2 className="text-2xl md:text-3xl font-bold font-mono tracking-wide text-white" id="inner-site-title">
          {currentSite.name}
        </h2>

        {/* Instructions */}
        <div className="text-sm md:text-base text-[#999999] font-sans leading-relaxed flex flex-col gap-2" id="inner-instructions">
          <p>Click the button below to open the voting website.</p>
          <p className="text-[#a855f7] font-semibold">
            After voting, return here and press Next Site.
          </p>
        </div>

        {/* Large "Open Vote Site" Button */}
        <button
          onClick={handleOpenSite}
          className="w-full max-w-xs py-4 px-6 bg-[#7e22ce] text-white font-extrabold text-lg rounded-[8px] tracking-wide cursor-pointer select-none border-none animate-none"
          id="open-vote-site-btn"
        >
          Open Vote Site
        </button>
      </div>
    </div>
  );
}
