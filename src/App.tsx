/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import VotePortal from "./components/VotePortal";
import VoteInnerPage from "./components/VoteInnerPage";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [pathname, setPathname] = useState("");
  const [search, setSearch] = useState("");
  const [hash, setHash] = useState("");

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

  // Helper to resolve the active site ID (e.g., "site1" through "site6")
  const getActiveSiteId = (): string | null => {
    // 1. Check path (e.g., /site1)
    if (cleanPath.startsWith("/site")) {
      return cleanPath.substring(5); // gets e.g. "1" from "/site1"
    }

    // 2. Fallback: Query params (e.g. ?site=site1)
    const params = new URLSearchParams(search);
    const querySite = params.get("site") || params.get("path");
    if (querySite && querySite.startsWith("site")) {
      return querySite.substring(4); // gets e.g. "1" from "site1"
    }

    // 3. Fallback: Hash router (e.g. #/site1 or #site1)
    const cleanHash = hash.replace("#", "").replace("/", "");
    if (cleanHash.startsWith("site")) {
      return cleanHash.substring(4); // gets e.g. "1" from "site1"
    }

    return null;
  };

  const siteIdNumber = getActiveSiteId();
  const isSitePage = siteIdNumber !== null && ["1", "2", "3", "4", "5", "6"].includes(siteIdNumber);

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
  if (isSitePage && siteIdNumber) {
    return <VoteInnerPage siteId={`site${siteIdNumber}`} />;
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
