import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

export function listen() {
  const wss = new WebSocketServer(8080);

  wss.on("connection", (socket) => {
    console.log("socket connected!");

    socket.on("message", (message) => {
      console.log("message received!");
      console.log(message);
    });
  });
}
