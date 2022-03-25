import axios from "axios";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { stringify } from "querystring";
import { LINE_NOTIFY_TOKEN, LINE_NOTIFY_URL } from "./configs/constants";

export async function notify(messages: string[]) {
  return axios({
    method: "post",
    url: LINE_NOTIFY_URL,
    headers: {
      Authorization: `Bearer ${LINE_NOTIFY_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: stringify({
      message: messages.join("\n"),
    }),
  });
}

export function writeJson(path: string, json: any) {
  const dir = dirname(path);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return writeFileSync(path, JSON.stringify(json, null, 2), {
    encoding: "utf-8",
  });
}

export function readJson(path: string) {
  const dir = dirname(path);

  if (!existsSync(dir)) {
    return {};
  }
  return JSON.parse(readFileSync(path, { encoding: "utf-8" })) as any;
}
