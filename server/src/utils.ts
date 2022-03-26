import axios from "axios";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import type Router from "koa-router";
import { dirname } from "path";
import { stringify } from "querystring";
import { LINE_NOTIFY_URL } from "./configs/constants";

export const looper = async (cb: () => Promise<void>, millis: number) => {
  await cb();
  setTimeout(async () => {
    await looper(cb, millis);
  }, millis);
};

export async function notify(token: string, messages: string[]) {
  return axios({
    method: "post",
    url: LINE_NOTIFY_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: stringify({
      message: messages.join("\n"),
    }),
  });
}

export const now = () => {
  return new Date().toISOString();
};

export async function writeJson(path: string, json: any) {
  const dir = dirname(path);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return new Promise<void>((res, rej) => {
    writeFile(
      path,
      JSON.stringify(json, null, 2),
      {
        encoding: "utf-8",
      },
      (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
}

export async function readJson(path: string) {
  if (!existsSync(path)) {
    return {};
  }

  const data = await new Promise<any>((res, rej) => {
    readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
  return JSON.parse(data) as any;
}

export function getDiscordInviteRegex() {
  const protocol = "(?:(?:http|https)://)?";
  const subdomain = "(?:www.)?";
  const domain = "(?:disco|discord|discordapp).(?:com|gg|io|li|me|net|org)";
  const path = "(?:/(?:invite))?/([a-z0-9-.]+)";
  const regex = `(${protocol}${subdomain}(${domain}${path}))`;
  return new RegExp(regex, "gmi");
}

export function registerRouter(
  router: Router,
  registers: ((router: Router) => void)[]
) {
  registers.forEach((reg) => reg(router));
}
