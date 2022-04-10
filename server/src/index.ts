import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import cors from "koa2-cors";
import Log from "./modules/Log";
import { collection, followUp } from "./routes";
import AHDetector from "./services/AHDetector";
import AHWatcher from "./services/AHWatcher";
import { looper, registerRouter } from "./utils";

const app = new Koa();

app.use(bodyParser());
// app.use(logger());

const router = new Router();
registerRouter(router, [followUp, collection]);

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(1880, async () => {
  Log.info("server is running on port 1880");
  Log.ln(1);

  const services = Promise.all([
    looper(AHDetector, 10000),
    looper(AHWatcher, 60000),
  ]);

  await services;
});
