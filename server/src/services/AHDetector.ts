import { difference, uniq } from "lodash";
import {
  COLLECTIONS_DB_PATH,
  LINE_COLLECTION_NOTIFY_TOKEN,
} from "../configs/constants";
import { readJson, writeJson } from "../modules/JsonIO";
import Log from "../modules/Log";
import QuickPuppeteer from "../modules/QuickPuppeteer";
import { CollectionSchema } from "../types/DbTypes";
import {
  autoJoinDiscordByLinks,
  getUrlRegex,
  notify,
  notifyNewCollections,
} from "../utils";

const explorerUrl = "https://wax.atomichub.io/explorer";
const collection_url =
  "https://wax.api.aa.atomichub.io/atomicassets/v1/collections";

const isSelfUrl = (url: string) => url.includes(explorerUrl);
const isScriptApi = (url: string) => url.includes("static/js");
const isConfigApi = (url: string) => url.includes("v1/config");
const isCollectionApi = (url: string) => url.includes("v1/stats/collections");
const isPostMethod = (method: string) => method.toLocaleLowerCase() === "post";

const urlFilters = [isSelfUrl, isScriptApi, isConfigApi, isCollectionApi];

async function process(pageIndex: number, size: number) {
  const { page, browser } = await QuickPuppeteer.init();
  try {
    page.on("request", (req) => {
      if (urlFilters.every((validator) => !validator(req.url()))) {
        req.abort();
        return;
      }

      if (!isCollectionApi(req.url())) {
        req.continue();
        return;
      }

      if (!isPostMethod(req.method())) {
        req.continue();
        return;
      }

      const json = JSON.parse(req.postData() || "{}");

      json.order = "desc";
      json.sort = "created";
      json.limit = String(size);
      json.page = String(pageIndex);

      json.after && delete json.after;
      json.collection_whitelist && delete json.collection_whitelist;

      req.continue({
        url: collection_url,
        postData: JSON.stringify(json),
      });
    });
    await page.goto(`${explorerUrl}#collections`);

    const result = await page.waitForResponse((res) => {
      return isPostMethod(res.request().method()) && isCollectionApi(res.url());
    });
    const collections = await result.json();
    const collectionNames = collections.data.map((d: any) => d.collection_name);

    const db: CollectionSchema = await readJson(COLLECTIONS_DB_PATH);
    const dbCollectionNames = (db.collections ||= []);
    const diffCollectionNames = difference(collectionNames, dbCollectionNames);

    db.collections = collectionNames;
    await writeJson(COLLECTIONS_DB_PATH, db);

    for (let name of diffCollectionNames) {
      const collection = (collections.data as any[]).find(
        (d) => d.collection_name == name
      );
      if (collection) {
        const jsonStr = JSON.stringify(collection.data || {});
        const attachments = uniq(jsonStr.match(getUrlRegex()));
        await notifyNewCollections([name]);
        await autoJoinDiscordByLinks(name, attachments);
      }
    }
  } catch (error: any) {
    Log.error("error while retrieving collections", error.message);
    await notify(LINE_COLLECTION_NOTIFY_TOKEN, error.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

const AHDetector = async () => await process(1, 60);

export default AHDetector;
