import React, { useState, useEffect } from "react";
import { useServerSettings } from "../hooks/useServerSettings";
import { defaultSettings, ServerSettings } from "../config/serverSettings";

export default function AdminPanel() {
  const { settings, updateSettings } = useServerSettings();
  
  // Local state for the form inputs
  const [serverName, setServerName] = useState(settings.serverName);
  const [serverIp, setServerIp] = useState(settings.serverIp);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [voteSites, setVoteSites] = useState(settings.voteSites);
  const [saveStatus, setSaveStatus] = useState("");

  // Sync state if settings change (e.g., loaded from localstorage on mount)
  useEffect(() => {
    setServerName(settings.serverName);
    setServerIp(settings.serverIp);
    setLogoUrl(settings.logoUrl);
    setVoteSites(settings.voteSites);
  }, [settings]);

  const handleVoteSiteChange = (index: number, field: "name" | "voteUrl", value: string) => {
    const updated = [...voteSites];
    updated[index] = { ...updated[index], [field]: value };
    setVoteSites(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newSettings: ServerSettings = {
      serverName,
      serverIp,
      logoUrl,
      voteSites,
    };
    updateSettings(newSettings);
    setSaveStatus("SAVED SUCCESSFULLY!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all configurations to default values?")) {
      setServerName(defaultSettings.serverName);
      setServerIp(defaultSettings.serverIp);
      setLogoUrl(defaultSettings.logoUrl);
      setVoteSites(defaultSettings.voteSites);
      updateSettings(defaultSettings);
      setSaveStatus("RESET TO DEFAULTS!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black text-white p-6 md:p-8 select-none" id="admin-panel-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 mb-8 gap-4" id="admin-header">
        <div>
          <h1 className="text-3xl font-extrabold font-mono tracking-wider text-[#a855f7]" id="admin-title">
            SERVER CONFIGURATION ADMIN
          </h1>
          <p className="text-sm text-neutral-500 font-mono mt-1">
            Update your Minecraft Server name, IP, Logo, and Voting links in real-time.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex-1 sm:flex-none text-center py-2 px-4 bg-neutral-900 border border-neutral-800 rounded-[8px] text-xs font-bold tracking-wider hover:bg-neutral-800 transition-colors font-mono cursor-pointer"
          >
            &larr; BACK TO PORTAL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="admin-form-grid">
        {/* Left Column: Server General Details */}
        <div className="flex flex-col gap-6" id="general-details-col">
          <h2 className="text-lg font-bold font-mono tracking-wide text-white border-b border-neutral-900 pb-2">
            General Information
          </h2>

          {/* Server Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Server Name
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[8px] px-4 py-3 font-mono text-sm text-white"
              placeholder="e.g. VISIBLE MC"
            />
          </div>

          {/* Server IP Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Server IP Address
            </label>
            <input
              type="text"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[8px] px-4 py-3 font-mono text-sm text-white"
              placeholder="e.g. play.visiblemc.xyz"
            />
          </div>

          {/* Logo Section */}
          <div className="flex flex-col gap-3 border border-neutral-900 rounded-[8px] p-4 bg-neutral-950/40">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Server Logo
            </label>
            
            {/* Logo Preview */}
            <div className="flex items-center justify-center p-4 bg-neutral-950 border border-neutral-900 rounded-[8px] h-32 relative overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="max-h-24 max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs font-mono text-neutral-600">NO LOGO LOADED</span>
              )}
            </div>

            {/* Custom Logo URL */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Logo Image URL</span>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[8px] px-3 py-2 font-mono text-xs text-white"
                placeholder="Image URL or Base64 string"
              />
            </div>

            {/* Upload New Logo file */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Upload custom PNG / image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="bg-neutral-950 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[8px] px-3 py-2 font-mono text-xs text-white cursor-pointer file:bg-neutral-900 file:border-none file:text-white file:text-xs file:font-mono file:py-1 file:px-2 file:rounded file:mr-2 file:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Vote Sites Configuration */}
        <div className="flex flex-col gap-6" id="vote-links-col">
          <h2 className="text-lg font-bold font-mono tracking-wide text-white border-b border-neutral-900 pb-2">
            Voting Sites Configuration
          </h2>

          <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar" id="vote-sites-list">
            {voteSites.map((site, index) => (
              <div
                key={site.id}
                className="flex flex-col gap-3 p-4 bg-neutral-950 border border-neutral-900 rounded-[8px]"
                id={`admin-site-${index}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-[#a855f7]">
                    VOTE SITE {index + 1}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-600">
                    PATH: {site.path}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Name</span>
                    <input
                      type="text"
                      value={site.name}
                      onChange={(e) => handleVoteSiteChange(index, "name", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-white"
                      placeholder="Vote Site Name"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Vote URL</span>
                    <input
                      type="text"
                      value={site.voteUrl}
                      onChange={(e) => handleVoteSiteChange(index, "voteUrl", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 focus:border-[#a855f7] outline-none rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 pt-6 mt-8" id="admin-actions">
        <div>
          {saveStatus && (
            <span className="font-mono text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-[4px] tracking-wider">
              {saveStatus}
            </span>
          )}
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-6 py-3 bg-neutral-950 border border-red-900/40 text-red-500 hover:bg-red-950/20 rounded-[8px] font-bold font-mono text-xs tracking-wider cursor-pointer"
          >
            RESET TO DEFAULTS
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-8 py-3 bg-[#7e22ce] text-white hover:bg-[#6b21a8] rounded-[8px] font-bold font-mono text-xs tracking-wider cursor-pointer"
          >
            SAVE ALL CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}
