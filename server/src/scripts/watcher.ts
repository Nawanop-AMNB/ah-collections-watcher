import { FOLLOW_UPS_DB_PATH, FOLLOW_UPS_MUTEX_KEY } from "../configs/constants";
import GlobalMutex from "../modules/GlobalMutex";
import { readJson } from "../modules/JsonIO";
import Log from "../modules/Log";
import QuickPuppeteer from "../modules/QuickPuppeteer";
import { FollowUpSchema } from "../types/DbTypes";
import { isFollowUpExist, updateCollectionLinks } from "../utils";
import { getlinksFromCollection } from "./fns";


const watcher = async () => {
  const { browser, page } = await QuickPuppeteer.init();

  try {
    const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
    data.followUps ||= {};

    for (let name in data.followUps) {
      const exist = await isFollowUpExist(name);
      if (exist) {
        const links = await getlinksFromCollection(page, name);
        await GlobalMutex.of(FOLLOW_UPS_MUTEX_KEY).runExclusive(async () => {
          await updateCollectionLinks(name, links);
        });
      }
    }
  } catch (error) {
    Log.error(error);
  } finally {
    await browser.close();
  }
};

export default watcher;
