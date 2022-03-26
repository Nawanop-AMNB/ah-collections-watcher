import Router from "koa-router";
import { keys } from "lodash";
import { COLLECTIONS_DB_PATH } from "../configs/constants";
import type { CollectionData } from "../types/DbTypes";
import { readJson } from "../utils";

export default function (router: Router) {
  router.get("/collections", async (ctx) => {
    const data: CollectionData = await readJson(COLLECTIONS_DB_PATH);
    ctx.status = 200;
    ctx.body = data.collections || [];
  });
}
