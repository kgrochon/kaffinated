/** Standalone app: github.com/kgrochon/survivor — override via VITE_SURVIVOR_APP_URL in .env */
export const SURVIVOR_APP_URL =
    (import.meta.env.VITE_SURVIVOR_APP_URL as string | undefined)?.trim() ||
    "https://kgrochon.github.io/survivor/";
