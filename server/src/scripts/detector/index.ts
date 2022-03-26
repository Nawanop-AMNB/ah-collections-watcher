import { COLLECTIONS_DB_PATH } from "../../configs/constants";
import Log from "../../modules/Log";
import QuickPuppeteer from "../../modules/QuickPuppeteer";
import { CollectionData } from "../../types/DbTypes";
import { now, readJson, writeJson } from "../../utils";
import {
  getCollectionNameList,
  goToAhCollections,
  injectEvents,
  nextPage,
  notifyLine,
  waitForCollectionsApi,
} from "./fns";

const detector = async () => {
  const { browser, page } = await QuickPuppeteer.init();

  injectEvents(page);

  try {
    const tempNameList: string[] = [];
    let index = 0;
    const data: CollectionData = await readJson(COLLECTIONS_DB_PATH);
    const newest = (data.collections ||= []);

    await goToAhCollections(page);

    do {
      Log.debug("explore on page-index ", index);
      await waitForCollectionsApi(page);
      const nameList = await getCollectionNameList(page);
      tempNameList.push(...nameList);
      await nextPage(page);
      index++;
    } while (index < 1);

    const newCollections = tempNameList.filter(
      (name) => !newest.includes(name)
    );

    data.collections = tempNameList;
    writeJson(COLLECTIONS_DB_PATH, data);

    if (newCollections.length <= 0) {
      Log.debug("no new collections to notify!");
      return;
    }

    await notifyLine(newCollections);

    Log.debug("notify new collections successfully!");
  } catch (error) {
    Log.error("error while detecting new collections", error);
  } finally {
    await browser.close();
  }
};

export default detector;
