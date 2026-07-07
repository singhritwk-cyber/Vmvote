import { VoteSite, voteSites as defaultVoteSites } from "./voteSites";

export interface ServerSettings {
  serverName: string;
  serverIp: string;
  logoUrl: string;
  voteSites: VoteSite[];
}

export const defaultSettings: ServerSettings = {
  serverName: "VISIBLE MC",
  serverIp: "play.visiblemc.xyz",
  logoUrl: "/visiblemc.png",
  voteSites: defaultVoteSites,
};

const STORAGE_KEY = "visiblemc_server_settings";

export function loadServerSettings(): ServerSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        serverName: parsed.serverName || defaultSettings.serverName,
        serverIp: parsed.serverIp || defaultSettings.serverIp,
        logoUrl: parsed.logoUrl || defaultSettings.logoUrl,
        voteSites: Array.isArray(parsed.voteSites) ? parsed.voteSites : defaultSettings.voteSites,
      };
    }
  } catch (e) {
    console.error("Failed to load server settings:", e);
  }
  return defaultSettings;
}

export function saveServerSettings(settings: ServerSettings): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Dispatch a custom storage event so other components on the page get notified immediately
      window.dispatchEvent(new Event("server_settings_updated"));
    } catch (e) {
      console.error("Failed to save server settings:", e);
    }
  }
}
