/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import VotePortal from "./components/VotePortal";
import VoteInnerPage from "./components/VoteInnerPage";
import AdminPanel from "./components/AdminPanel";
import { useServerSettings } from "./hooks/useServerSettings";

export default function App() {
  const [pathname, setPathname] = useState("");
  const [search, setSearch] = useState("");
  const [hash, setHash] = useState("");
  const { settings } = useServerSettings();
  const voteSites = settings.voteSites || [];

  useEffect(() => {
    // Read the location parameters on client mount
    setPathname(window.location.pathname);
    setSearch(window.location.search);
    setHash(window.location.hash);

    // Keep state in sync in case of stateful window changes
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setSearch(window.location.search);
      setHash(window.location.hash);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Check if we are on the admin page
  const cleanPath = pathname.replace(/\/$/, "");
  const isAdminPage = cleanPath === "/admin" || hash.replace("#", "").replace("/", "") === "admin";

  // Helper to resolve the active site ID dynamically from URL or query params
  const getActiveSiteId = (): string | null => {
    // 1. Check query parameter (e.g. ?site=site1) - SAFEST FOR STATIC HOSTING (prevents 404s)
    const params = new URLSearchParams(search);
    const querySite = params.get("site") || params.get("path");
    if (querySite) {
      const match = voteSites.find((s) => s.id === querySite);
      if (match) return match.id;
    }

    // 2. Fallback: Check path (e.g. /site1)
    if (cleanPath.startsWith("/site")) {
      const siteNumOrId = cleanPath.substring(5); // e.g. "1" from "/site1"
      const match = voteSites.find((s) => s.id === cleanPath.substring(1) || s.id === `site${siteNumOrId}`);
      if (match) return match.id;
    }

    // 3. Fallback: Hash router (e.g. #site1)
    const cleanHash = hash.replace("#", "").replace("/", "");
    if (cleanHash) {
      const match = voteSites.find((s) => s.id === cleanHash || s.id === `site${cleanHash}`);
      if (match) return match.id;
    }

    return null;
  };

  const activeSiteId = getActiveSiteId();
  const isSitePage = activeSiteId !== null;

  // If admin page, render the Admin panel view
  if (isAdminPage) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center py-8 px-4" id="main-app-container">
        {/* Thin neon purple glowing border around the entire viewport */}
        <div 
          className="fixed inset-0 pointer-events-none border border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.4),0_0_15px_rgba(168,85,247,0.4)] z-50"
          id="neon-glow-border"
        ></div>

        <div className="w-full max-w-4xl relative z-10" id="main-content-layout">
          <AdminPanel />
        </div>
      </div>
    );
  }

  // If this is an iframe sub-page, render the specific vote interface
  if (isSitePage && activeSiteId) {
    return <VoteInnerPage siteId={activeSiteId} />;
  }

  // Otherwise, render the main server wrapper with the header, iframe portal, and neon purple border
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center py-8 px-4" id="main-app-container">
      {/* Thin neon purple glowing border around the entire viewport */}
      <div 
        className="fixed inset-0 pointer-events-none border border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.4),0_0_15px_rgba(168,85,247,0.4)] z-50"
        id="neon-glow-border"
      ></div>

      {/* Center Layout wrapper */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-4 relative z-10 animate-none" id="main-content-layout">
        <Header />
        <VotePortal />
        
        {/* Subtle text link to access admin settings */}
        <div className="absolute bottom-[-24px] right-4" id="admin-shortcut">
          <a
            href="/admin"
            className="text-neutral-800 hover:text-[#a855f7] text-[10px] font-mono tracking-widest transition-colors uppercase"
            title="Go to Admin Panel"
          >
            [ Config Admin ]
          </a>
        </div>
      </div>
    </div>
  );
}
