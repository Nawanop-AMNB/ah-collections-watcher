import { resolve } from "path";
import { ResourceType } from "puppeteer";

export const LINE_NOTIFY_URL = "https://notify-api.line.me/api/notify";
export const LINE_NOTIFY_TOKEN = "FwUOR1evtMIV2TSrezsUv12PjVjXdq4sT4OlpoWoSKI";

export const COLLECTIONS_DB_PATH = resolve("data", "collections.json");
export const FOLLOW_UPS_DB_PATH = resolve("data", "follow-ups.json");

export const CRON_VALUE = "0 */1 * * * *";

export const COLLECTIONS_EXPLORER_URL =
  "https://wax.atomichub.io/explorer#collections";

export const AH_CONFIG_URL = "https://wax.api.atomichub.io/v1/config";
export const COLLECTIONS_LIST_URL =
  "https://wax.api.aa.atomichub.io/atomicassets/v1/collections";

export const BLACKLIST_RESOURCE_TYPE = [
  "image",
  "stylesheet",
  "font",
] as ResourceType[];
