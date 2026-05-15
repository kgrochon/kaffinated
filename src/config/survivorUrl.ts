/** Survivor microsite at survivor.kaffinated.com — optional override via VITE_SURVIVOR_APP_URL in .env */
export const SURVIVOR_APP_URL =
    (import.meta.env.VITE_SURVIVOR_APP_URL as string | undefined)?.trim() ||
    "https://survivor.kaffinated.com";
