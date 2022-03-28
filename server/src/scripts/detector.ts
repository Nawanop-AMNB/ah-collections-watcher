import { COLLECTIONS_DB_PATH } from "../configs/constants";
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

    await goToAhCollections(page);

    do {
      const result = await waitForCollectionsApi(page);
      const data: CollectionList = await result.json();
      tempCollections.push(...data.data);
      if (index + 1 < 2) {
        await nextPage(page);
        index++;
      } else {
        break;
      }
    } while (index < 2);

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
  } catch (error) {
    Log.error("error while detecting new collections", error);
  } finally {
    await browser.close();
  }
};

export default detector;
