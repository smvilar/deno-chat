import { Application, HttpServerStd, Router } from "./deps.ts";
import * as indexRouter from "./routes/index.ts";
import * as wsRouter from "./routes/ws.ts";

const app = new Application({
  // we need this server because the Deno native server doesn't support ws
  serverConstructor: HttpServerStd,
});
const router = new Router();

indexRouter.use("/", router);
wsRouter.use("/ws", router);

const port = 3000;
const hostname = "0.0.0.0";

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port, hostname });

console.log(`Now listening at http://${hostname}:${port}`);

export {};
