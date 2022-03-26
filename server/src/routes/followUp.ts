import Router from "koa-router";
import { keys } from "lodash";
import { FOLLOW_UPS_DB_PATH } from "../configs/constants";
import type { FollowUpData } from "../types/DbTypes";
import { readJson, writeJson } from "../utils";

export default function (router: Router) {
  router.get("/followUps", async (ctx) => {
    const data: FollowUpData = await readJson(FOLLOW_UPS_DB_PATH);

    ctx.status = 200;
    ctx.body = keys(data.followUps);
  });

  router.post("/followUps/:name", async (ctx) => {
    const name = ctx.params.name;
    const data: FollowUpData = await readJson(FOLLOW_UPS_DB_PATH);
    data.followUps ||= {};
    data.followUps[name] = [];

    await writeJson(FOLLOW_UPS_DB_PATH, data);

    ctx.status = 200;
    ctx.body = { message: `${name} is added to watch-list` };
  });

  router.delete("/followUps/:name", async (ctx) => {
    const name = ctx.params.name;
    const data: FollowUpData = await readJson(FOLLOW_UPS_DB_PATH);
    data.followUps ||= {};
    delete data.followUps[name];

    await writeJson(FOLLOW_UPS_DB_PATH, data);

    ctx.status = 200;
    ctx.body = { message: `${name} is removed from watch-list` };
  });
}
