import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import Router from "koa-router";
import cors from "koa2-cors";
import Log from "./modules/Log";
import { collection, followUp } from "./routes";
import detector from "./scripts/detector";
import { looper, registerRouter } from "./utils";

const app = new Koa();

app.use(bodyParser());
// app.use(logger());

const router = new Router();
registerRouter(router, [followUp, collection]);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(1880, async () => {
  Log.info("server is running on port 1880");
  Log.info("collection detector is enabled");
  await looper(detector, 5000);
});
