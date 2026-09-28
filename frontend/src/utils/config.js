// Single source of truth for the backend URL. Set at build time via VITE_API_BASE_URL
// (the deploy workflow does this); falls back to the production API for local dev.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.vaakify.manaslearning.com";
