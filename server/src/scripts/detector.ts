import {
  COLLECTIONS_DB_PATH,
  COLLECTION_LIST_ENDPOINT,
} from "../configs/constants";
import { readJson, writeJson } from "../modules/JsonIO";
import Log from "../modules/Log";
import QuickPuppeteer from "../modules/QuickPuppeteer";
import { CollectionData, CollectionList } from "../types/CollectionTypes";
import { CollectionSchema } from "../types/DbTypes";
import {
  autoJoinDiscordByLinks,
  getLinksFromCollectionInfo,
  notifyNewCollections,
} from "../utils";
import { goToAhCollections, nextPage, waitForCollectionsApi } from "./fns";

const detector = async () => {
  const { browser, page } = await QuickPuppeteer.init();

  try {
    const tempCollections: CollectionData[] = [];
    let index = 0;
    const data: CollectionSchema = await readJson(COLLECTIONS_DB_PATH);
    const newest = (data.collections ||= []);

    Log.debug("start getting collections from atomichub");

    await goToAhCollections(page);

    do {
      const result = await waitForCollectionsApi(page);
      Log.debug("get result from response on page index ", index);
      const data: CollectionList = await result.json();
      tempCollections.push(...data.data);
      if (index + 1 < 3) {
        await page.waitForTimeout(2000);
        await nextPage(page);
        index++;
      } else {
        break;
      }
    } while (index < 3);

    const allCollectionNames = tempCollections.map(
      (data) => data.collection_name
    );
    const newCollections = tempCollections.filter(
      (info) => !newest.includes(info.collection_name)
    );
    data.collections = allCollectionNames;
    await writeJson(COLLECTIONS_DB_PATH, data);

    if (newCollections.length <= 0) {
      return;
    }

    await notifyNewCollections(
      newCollections.map((data) => data.collection_name)
    );

    for (let collection of newCollections) {
      const name = collection.collection_name;
      const links = getLinksFromCollectionInfo(collection.data);
      await autoJoinDiscordByLinks(name, links);
    }
  } catch (error: any) {
    Log.error("error while detecting new collections: ", error.message);
  } finally {
    await page.close();
    await browser.close();
  }
};

export default detector;
