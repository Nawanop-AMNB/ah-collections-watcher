import { resolve } from "path";

export const LINE_NOTIFY_URL = "https://notify-api.line.me/api/notify";
export const LINE_COLLECTION_NOTIFY_TOKEN =
  "FwUOR1evtMIV2TSrezsUv12PjVjXdq4sT4OlpoWoSKI";
export const LINE_FOLLOW_UP_NOTIFY_TOKEN =
  "jpxuywvARxxOFWdEg8gwbnTEAaE6fmF73RGgBHsrP3p";
export const LINE_DISCORD_AUTO_JOINER_NOTIFY_TOKEN =
  "XPpZaI1tVXMwb7vARa24zFX7LYstExjzXMwKi1ofuLR";

export const COLLECTIONS_DB_PATH = resolve("data", "collections.json");
export const FOLLOW_UPS_DB_PATH = resolve("data", "follow-ups.json");
export const DISCORD_SESSION_DB_PATH = resolve("data", "discord-sessions.json");

export const FOLLOW_UPS_MUTEX_KEY = "followUps";
export const COLLECTIONS_MUTEX_KEY = "collections";

export const AH_STATIC_JS_PREFIX_ENDPOINT =
  "https://wax.atomichub.io/static/js";
export const AH_CONFIG_ENDPOINT = "https://wax.api.atomichub.io/v1/config";
export const AH_EXPLORER_URL = "https://wax.atomichub.io/explorer";

export const COLLECTION_URL = (name: string) =>
  `https://wax.atomichub.io/explorer/collection/${name}`;
export const COLLECTION_ENDPOINT = (name: string) =>
  `https://wax.api.aa.atomichub.io/atomicassets/v1/collections/${name}`;
export const COLLECTION_LIST_ENDPOINT =
  "https://wax.api.aa.atomichub.io/atomicassets/v1/collections";
