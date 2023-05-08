import { createSignal } from "solid-js";

type wsStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

export function setupWebsocket() {
  const [status, setStatus] = createSignal<wsStatus>("CONNECTING");
  type WsHandlers = Map<
    "open" | "close" | "error" | "message",
    ((event: CloseEvent | Event | MessageEvent) => void)[]
  >;
  const socketEventHandlers: WsHandlers = new Map();

  function addHandler(
    event: "open" | "close" | "error" | "message",
    handler: (e: CloseEvent | Event | MessageEvent) => void,
  ) {
    if (!socketEventHandlers.has(event)) {
      socketEventHandlers.set(event, [handler]);
    } else {
      socketEventHandlers.get(event)?.push(handler);
    }
  }

  function connect() {
    const conn: WebSocket = new WebSocket("ws://localhost:8080/");
    return setupWSHandlers(conn);
  }

  function reconnect() {
    ws.close();
    connect();
  }

  function setupWSHandlers(socket: WebSocket) {
    // For every handler in socketEventHandlers, run each handler on the specified event
    socketEventHandlers.forEach((handlers, eventName) => {
      console.log("Adding handler for event: " + eventName);
      socket.addEventListener(eventName, (event) => {
        console.log("Socket event triggered: " + eventName);

        handlers.forEach((handler) => {
          console.log("Running handler for event: " + eventName);

          handler(event);
        });
      });
    });

    return socket;
  }

  addHandler("open", () => {
    setStatus("CONNECTED");
  });
  addHandler("close", () => setStatus("DISCONNECTED"));
  addHandler("close", (_e) => reconnect());
  addHandler("error", () => setStatus("ERROR"));

  const ws: WebSocket = connect();
  return { socket: ws, statusAccessor: status };
}
