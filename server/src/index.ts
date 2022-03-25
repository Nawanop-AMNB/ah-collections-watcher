import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import { COLLECTIONS_PATH } from "./configs/constants";
import { readJson, writeJson } from "./utils";

type CollectionData = { collections: Record<string, string[]> | undefined };

const app = new Koa();

app.use(bodyParser());
app.use(logger());

const router = new KoaRouter();

router.post("/collections/:name", (ctx) => {
  const name = ctx.params.name;
  const data: CollectionData = readJson(COLLECTIONS_PATH);
  data.collections ||= {};
  data.collections[name] = [];

  writeJson(COLLECTIONS_PATH, data);

  ctx.status = 200;
  ctx.body = { message: `${name} is added to watch-list` };
});

router.delete("/collections/:name", (ctx) => {
  const name = ctx.params.name;
  const data: CollectionData = readJson(COLLECTIONS_PATH);
  data.collections ||= {};
  delete data.collections[name];

  writeJson(COLLECTIONS_PATH, data);

  ctx.status = 200;
  ctx.body = { message: `${name} is removed from watch-list` };
});

app.use(router.routes());
app.listen(1880);
