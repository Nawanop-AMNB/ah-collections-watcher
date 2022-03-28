import Router from "koa-router";
import { keys } from "lodash";
import { FOLLOW_UPS_DB_PATH, FOLLOW_UPS_MUTEX_KEY } from "../configs/constants";
import GlobalMutex from "../modules/GlobalMutex";
import { readJson, writeJson } from "../modules/JsonIO";
import Log from "../modules/Log";
import type { FollowUpSchema } from "../types/DbTypes";

export default function (router: Router) {
  router.get("/followUps", async (ctx) => {
    const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);

    ctx.status = 200;
    ctx.body = keys(data.followUps);
  });

  router.post("/followUps/:name", async (ctx) =>
    GlobalMutex.of(FOLLOW_UPS_MUTEX_KEY).runExclusive(async () => {
      const name = ctx.params.name;
      const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
      data.followUps ||= {};
      data.followUps[name] = [];

      await writeJson(FOLLOW_UPS_DB_PATH, data);

      ctx.status = 200;
      ctx.body = { message: `${name} is added to watch-list` };
    })
  );

  router.delete("/followUps/:name", async (ctx) =>
    GlobalMutex.of(FOLLOW_UPS_MUTEX_KEY).runExclusive(async () => {
      const name = ctx.params.name;
      const data: FollowUpSchema = await readJson(FOLLOW_UPS_DB_PATH);
      data.followUps ||= {};
      delete data.followUps[name];

      await writeJson(FOLLOW_UPS_DB_PATH, data);

      ctx.status = 200;
      ctx.body = { message: `${name} is removed from watch-list` };
    })
  );
}
