import Router from "koa-router";
import { COLLECTIONS_DB_PATH } from "../configs/constants";
import { readJson } from "../modules/JsonIO";
import type { CollectionSchema } from "../types/DbTypes";

export default function (router: Router) {
  router.get("/collections", async (ctx) => {
    const data: CollectionSchema = await readJson(COLLECTIONS_DB_PATH);
    ctx.status = 200;
    ctx.body = data.collections || [];
  });
}
