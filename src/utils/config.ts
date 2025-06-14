export const APP_EMOJI = "🪪";
export const APP_NAME = "Castpass";
export const APP_DESCRIPTION = "Your pass to verified channels";
export const APP_DOMAIN = "castpass.nexth.dev";
export const APP_URL = `https://${APP_DOMAIN}`;

// More info // https://miniapps.farcaster.xyz/docs/specification#frame
export const APP_ICON = `${APP_URL}/api/images/icon`; // 1024 x 1024 for Farcaster
export const APP_IMAGE = `${APP_URL}/api/images/image`; // 1200 x 800 for Farcaster
export const APP_OG_IMAGE = `${APP_URL}/api/images/og`; // 1200 x 630 for Open Graph + Twitter. Can replace with /opengraph-image
export const APP_WEBHOOK = `${APP_URL}/api/webhook`;
export const APP_FRAME_VERSION = "next";
export const APP_FRAME_PRIMARY_CATEGORY = "utility";
export const APP_FRAME_TAGS = ["farcaster", "app"];

export const FARCASTER_ACCOUNT_ASSOCIATION = {
  header:
    "eyJmaWQiOjEyNTgwLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NTQzOTY4YzU4YTRlYTEyNTllMTIxOUI2MjE5MjBDMjQ2OTMxRGYxRiJ9",
  payload: "eyJkb21haW4iOiJjYXN0cGFzcy5uZXh0aC5kZXYifQ",
  signature:
    "MHg4ODVjN2U0MDg1MDI5YWQyOGE3NjVlMzkxMGI4ZjZlZWU0NWEyZWZmYWEzNmY3ZTJjNjBkYzg0Y2U1N2I5MDIzN2U4NGJiOTllM2Y4MGM3OTQzOTJjZWIxMTAzZTljMjA4YmQ4MjA5NzUxOTQwYTgxMmQzN2QyYzY4NTYzOGI1NzFj",
};

export const SOCIAL_TWITTER = "wslyvh";
export const SOCIAL_FARCASTER = "wslyvh.eth";
export const SOCIAL_GITHUB = "wslyvh/castpass";

export const DEFAULT_CACHE_TIME = 24 * 60 * 60 * 1000; // 24-hrs (e.g. user context)
