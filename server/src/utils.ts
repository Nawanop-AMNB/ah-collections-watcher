import axios from "axios";
import type Router from "koa-router";
import { uniq } from "lodash";
import { stringify } from "querystring";
import {
  COLLECTION_URL,
  DISCORD_SESSION_DB_PATH,
  LINE_COLLECTION_NOTIFY_TOKEN,
  LINE_DISCORD_AUTO_JOINER_NOTIFY_TOKEN,
  LINE_FOLLOW_UP_NOTIFY_TOKEN,
  LINE_NOTIFY_URL,
} from "./configs/constants";
import { readJson } from "./modules/JsonIO";
import Log from "./modules/Log";
import { CollectionInfo } from "./types/CollectionTypes";
import { DiscordSessionSchema } from "./types/DbTypes";

export const looper = async (cb: () => Promise<void>, millis: number) => {
  await cb();
  setTimeout(async () => {
    await looper(cb, millis);
  }, millis);
};

export async function notify(token: string, message: string) {
  try {
    await axios({
      method: "post",
      url: LINE_NOTIFY_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: stringify({
        message,
      }),
    });
  } catch (error) {
    Log.error("cannot set messages", error);
  }
}

export const joinDiscord = async (sessionId: string, inviteId: string) => {
  await axios({
    method: "post",
    url: `https://discord.com/api/v8/invites/${inviteId}`,
    headers: {
      Authorization: sessionId,
    },
  });
};

export const now = () => {
  return new Date().toISOString();
};

export const isStringifiedJson = (jsonStr: string) => {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch {
    return false;
  }
};

export function getLinksFromCollectionInfo(info: CollectionInfo) {
  const { url, description } = info;
  const linkFromUrl = (url && url.match(getUrlRegex())) || [];
  const linksFromDescription =
    (description && description.match(getUrlRegex())) || [];
  return uniq([...linkFromUrl, ...linksFromDescription]);
}

export function getDiscordInviteRegex() {
  const protocol = "(?:(?:http|https)://)?";
  const subdomain = "(?:www.)?";
  const domain = "(?:disco|discord|discordapp).(?:com|gg|io|li|me|net|org)";
  const path = "(?:/(?:invite))?/([a-z0-9-.]+)";
  const regex = `(${protocol}${subdomain}(${domain}${path}))`;
  return new RegExp(regex, "gi");
}

export function getUrlRegex() {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  return new RegExp(regex, "gi");
}

export function registerRouter(
  router: Router,
  registers: ((router: Router) => void)[]
) {
  registers.forEach((reg) => reg(router));
}

export const notifyNewCollections = async (cols: string[]) => {
  let collections = new Array(...cols);
  while (collections.length) {
    const partialCollections = collections.splice(0, 3);
    const messages = [];
    const collectionUrls = partialCollections.map(
      (col) => `${COLLECTION_URL(col)}#more-info`
    );
    messages.push("");
    messages.push(...collectionUrls);
    const finalMessage = messages.join("\n\n");

    await notify(LINE_COLLECTION_NOTIFY_TOKEN, finalMessage);
  }
  collections = new Array(...cols);
  Log.debug(
    `${collections.splice(0, 2).join(", ")}${
      collections.length && ` and ${collections.length} new collections`
    } has been notified`
  );
};

export const notifyNewLinks = async (
  collectionName: string,
  links: string[]
) => {
  const lks = new Array(...links);
  while (lks.length) {
    const partialLks = lks.splice(0, 5);
    const messages: string[] = [];
    messages.push(`name: ${collectionName}`);
    messages.push(...partialLks);
    const finalMessage = messages.join("\n\n");
    await notify(LINE_FOLLOW_UP_NOTIFY_TOKEN, finalMessage);
  }
  Log.debug(`${links.length} new links of ${collectionName} has been notified`);
};

export const autoJoinDiscordByLinks = async (
  collectionName: string,
  links: string[]
) => {
  const discordLinks = links.filter((link) =>
    getDiscordInviteRegex().test(link)
  );
  const discordSessions: DiscordSessionSchema = await readJson(
    DISCORD_SESSION_DB_PATH
  );
  discordSessions.sessions ||= [];

  if (discordLinks.length > 0) {
    for (let sessionId of discordSessions.sessions) {
      for (let link of discordLinks) {
        const inviteId = link.split("/").slice(-1)[0];
        await joinDiscord(sessionId, inviteId);
      }
    }
    Log.debug(
      `detect discord link on <${collectionName}>, auto-join completed`
    );

    const messages = [];
    messages.push("");
    messages.push(`name: ${collectionName}`);
    messages.push(...discordLinks);
    const finalMessage = messages.join("\n");

    await notify(LINE_DISCORD_AUTO_JOINER_NOTIFY_TOKEN, finalMessage);
  }
};
