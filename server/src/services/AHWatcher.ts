import { Page } from "puppeteer";
import {
  AH_STATIC_JS_PREFIX_ENDPOINT,
  COLLECTION_ENDPOINT,
  COLLECTION_URL,
  FOLLOW_UPS_DB_PATH,
  FOLLOW_UPS_MUTEX_KEY,
} from "../configs/constants";
import GlobalMutex from "../modules/GlobalMutex";
import { readJson, writeJson } from "../modules/JsonIO";
import Log from "../modules/Log";
import QuickPuppeteer from "../modules/QuickPuppeteer";
import { Collection } from "../types/CollectionTypes";
import { FollowUpSchema } from "../types/DbTypes";
import {
  autoJoinDiscordByLinks,
  getLinksFromCollectionInfo,
  notifyNewLinks,
} from "../utils";

export const isFollowUpExist = async (name: string) => {
  const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
  return Boolean(data.followUps && data.followUps[name]);
};

export const getlinksFromCollection = async (page: Page, name: string) => {
  page.removeAllListeners();
  page.on("request", (req) => {
    if (
      req.url().startsWith(AH_STATIC_JS_PREFIX_ENDPOINT) ||
      req.url().startsWith(COLLECTION_URL(name)) ||
      req.url() === COLLECTION_ENDPOINT(name)
    ) {
      req.continue();
    } else {
      req.abort();
    }
  });

  await page.goto(COLLECTION_URL(name));
  const res = await page.waitForResponse((res) => {
    return res.url() === COLLECTION_ENDPOINT(name);
  });
  const info: Collection = await res.json();
  const links = getLinksFromCollectionInfo(info.data.data);
  return links;
};

export const updateCollectionLinks = async (name: string, links: string[]) => {
  const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
  if (data.followUps?.[name]) {
    const oldLinks = data.followUps[name];
    const newLinks = links.filter((link) => !oldLinks.includes(link));
    if (newLinks.length > 0) {
      data.followUps[name] = links;
      await writeJson(FOLLOW_UPS_DB_PATH, data);
      Log.debug(`followed-up collection: [${name}] is updated`);
      await notifyNewLinks(name, links);
      await autoJoinDiscordByLinks(name, links);
    }
  }
};

const watchCollection = async (page: Page, name: string) => {
  const exist = isFollowUpExist(name);
  if (!exist) {
    return;
  }

  const links = await getlinksFromCollection(page, name);
  await GlobalMutex.of(FOLLOW_UPS_MUTEX_KEY).runExclusive(async () => {
    await updateCollectionLinks(name, links);
  });
};

const AHWatcher = async () => {
  const { browser, page } = await QuickPuppeteer.init();
  let current = undefined;

  try {
    const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
    data.followUps ||= {};

    for (let name in data.followUps) {
      current = name;
      await watchCollection(page, name);
    }
  } catch (error) {
    Log.error(`error while watching collections [${current}] `, error);
  } finally {
    await page.close();
    await browser.close();
  }
};

export default AHWatcher;
