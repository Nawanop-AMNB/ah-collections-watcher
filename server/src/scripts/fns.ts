import { isEmpty, keys } from "lodash";
import { Page } from "puppeteer";
import {
  AH_CONFIG_ENDPOINT,
  AH_EXPLORER_URL,
  AH_STATIC_JS_PREFIX_ENDPOINT,
  COLLECTION_ENDPOINT,
  COLLECTION_LIST_ENDPOINT,
  COLLECTION_URL,
} from "../configs/constants";
import { AH_DETECTOR } from "../configs/selectors";
import Log from "../modules/Log";
import { Collection } from "../types/CollectionTypes";
import { getLinksFromCollectionInfo } from "../utils";

const {
  ACCEPT_COOKIE_BUTTON,
  EXPLORE_BUTTON,
  NEXT_BUTTON,
  SORT_BY_CREATED_AT_BUTTON,
  WHITELIST_CHECKBOX,
} = AH_DETECTOR;

export const goToAhCollections = async (page: Page) => {
  page.removeAllListeners();
  page.on("request", (req) => {
    if (
      [
        COLLECTION_LIST_ENDPOINT,
        AH_EXPLORER_URL,
        AH_STATIC_JS_PREFIX_ENDPOINT,
        AH_CONFIG_ENDPOINT,
      ].some((l) => req.url().startsWith(l))
    ) {
      req.continue();
      return;
    } else if (req.url() === COLLECTION_LIST_ENDPOINT) {
      const postData = req.postData();
      const validMethod = req.method().toLowerCase() === "post";
      const validUrl = req.url().startsWith(COLLECTION_LIST_ENDPOINT);
      try {
        const postDataJson = postData ? JSON.parse(postData) : {};
        const validPostData =
          !isEmpty(postDataJson) &&
          !keys(postDataJson).includes("colleciton_whitelist") &&
          keys(postDataJson).includes("collection_blacklist");
        if (validUrl && validMethod && validPostData) {
          req.continue();
          console.log(req.url());
          return;
        }
      } finally {
      }
    }
    req.abort();
  });
  await page.goto(`${AH_EXPLORER_URL}#collections`);
  await page.waitForSelector(ACCEPT_COOKIE_BUTTON);
  await page.click(ACCEPT_COOKIE_BUTTON, { clickCount: 1 });
  await page.waitForSelector(EXPLORE_BUTTON);
  await page.click(EXPLORE_BUTTON, { clickCount: 1 });
  await page.waitForSelector(SORT_BY_CREATED_AT_BUTTON);
  await page.click(SORT_BY_CREATED_AT_BUTTON, { clickCount: 1 });
  await page.waitForSelector(WHITELIST_CHECKBOX);
  await page.click(WHITELIST_CHECKBOX, { clickCount: 1 });
};

export const waitForCollectionsApi = async (page: Page) => {
  return page.waitForResponse((res) => {
    const url = res.url();
    const status = res.status();
    const postData = res.request().postData();
    const validUrl = url.startsWith(COLLECTION_LIST_ENDPOINT);
    const validStatus = status === 200;
    let postDataJson = {};
    try {
      postDataJson = postData ? JSON.parse(postData) : {};
    } catch (error: any) {
      Log.error("Error while parsing", error);
    } finally {
      const validPostData =
        !isEmpty(postDataJson) &&
        !keys(postDataJson).includes("colleciton_whitelist") &&
        keys(postDataJson).includes("collection_blacklist");
      return validUrl && validStatus && validPostData;
    }
  });
};

export const nextPage = async (page: Page) => {
  await page.waitForSelector(NEXT_BUTTON);
  await page.click(NEXT_BUTTON, { clickCount: 1 });
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
