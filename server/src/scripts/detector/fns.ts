import {
  BLACKLIST_RESOURCE_TYPE,
  COLLECTIONS_EXPLORER_URL,
  COLLECTIONS_LIST_URL,
  LINE_NOTIFY_TOKEN,
} from "../../configs/constants";
import { AH_DETECTOR } from "../../configs/selectors";
import type { Page } from "puppeteer";
import { notify } from "../../utils";

const {
  ACCEPT_COOKIE_BUTTON,
  COLLECTION_CARD,
  EXPLORE_BUTTON,
  NEXT_BUTTON,
  SORT_BY_CREATED_AT_BUTTON,
  WHITELIST_CHECKBOX,
  COLLECTION_LABEL,
} = AH_DETECTOR;

export const injectEvents = (page: Page) => {
  page.on("request", (req) => {
    const resType = req.resourceType();
    if (BLACKLIST_RESOURCE_TYPE.includes(resType)) {
      req.abort();
    } else {
      req.continue();
    }
  });
};

export const goToAhCollections = async (page: Page) => {
  await page.goto(COLLECTIONS_EXPLORER_URL);
  await page.waitForSelector(EXPLORE_BUTTON);
  await page.click(ACCEPT_COOKIE_BUTTON, { clickCount: 1 });
  await page.click(EXPLORE_BUTTON, { clickCount: 1 });
  await page.click(SORT_BY_CREATED_AT_BUTTON, { clickCount: 1 });
  await page.click(WHITELIST_CHECKBOX);
};

export const waitForCollectionsApi = async (page: Page) => {
  await page.waitForResponse(
    (res) => {
      return res.url().startsWith(COLLECTIONS_LIST_URL) && res.status() === 200;
    },
    { timeout: 10000 }
  );
};

export const getCollectionNameList = async (page: Page) => {
  const nameList: string[] = [];
  const length = (await page.$$(COLLECTION_CARD)).length;
  for (let i = 0; i < length; i++) {
    await page.waitForSelector(COLLECTION_LABEL(i));
    const element = await page.$(COLLECTION_LABEL(i));
    const name = await element?.evaluate((p) => p.textContent);
    if (!name) continue;
    nameList.push(name);
  }
  return nameList;
};

export const nextPage = async (page: Page) => {
  await page.click(NEXT_BUTTON, { clickCount: 1 });
};

export const notifyLine = async (cols: string[]) => {
  const messages = [];
  const collectionUrls = cols.map(
    (col) => `https://wax.atomichub.io/explorer/collection/${col}#more-info`
  );
  messages.push("");
  messages.push(...collectionUrls);
  const finalMessage = messages.join("\n\n");

  await notify(LINE_NOTIFY_TOKEN, [finalMessage]);
};
