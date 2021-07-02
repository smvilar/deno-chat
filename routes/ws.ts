import { v4 } from "https://deno.land/std/uuid/mod.ts";
import {
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { Router } from "../deps.ts";

const sockets = new Map<string, WebSocket>();

export function use(path: string, router: Router) {
  router.get(path, async (ctx) => {
    handleWs(await ctx.upgrade());
  });
}

const welcomeMessage = (uid: string) => ({ type: "welcome", uid });
const textMessage = (uid: string, text: string) => ({
  type: "text",
  uid,
  text,
});

async function handleWs(socket: WebSocket) {
  const uid = v4.generate();
  sockets.set(uid, socket);
  await socket.send(JSON.stringify(welcomeMessage(uid)));
  for await (const ev of socket) {
    if (isWebSocketCloseEvent(ev)) {
      sockets.delete(uid);
    }
    if (typeof ev === "string") {
      broadcastMessage(ev, uid);
    }
  }
}

function broadcastMessage(message: string, uid: string) {
  for (const [, socket] of sockets) {
    if (!socket.isClosed) {
      socket.send(JSON.stringify(textMessage(uid, message)));
    }
  }
}
