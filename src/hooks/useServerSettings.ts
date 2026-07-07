import { useState, useEffect } from "react";
import { loadServerSettings, ServerSettings, saveServerSettings } from "../config/serverSettings";

export function useServerSettings() {
  const [settings, setSettings] = useState<ServerSettings>(() => loadServerSettings());

  useEffect(() => {
    // Refresh settings once mounted to ensure client/localStorage alignment
    setSettings(loadServerSettings());

    const handleUpdate = () => {
      setSettings(loadServerSettings());
    };

    window.addEventListener("server_settings_updated", handleUpdate);
    return () => {
      window.removeEventListener("server_settings_updated", handleUpdate);
    };
  }, []);

  const updateSettings = (newSettings: ServerSettings) => {
    saveServerSettings(newSettings);
    setSettings(newSettings);
  };

  return { settings, updateSettings };
}
