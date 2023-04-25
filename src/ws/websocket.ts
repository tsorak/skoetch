import { createSignal } from "solid-js";

type wsStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

export function setupWebsocket() {
  const [status, setStatus] = createSignal<wsStatus>("CONNECTING");
  let ws: WebSocket = connect();

  function connect() {
    const conn: WebSocket = new WebSocket("ws://localhost:8080/");
    return setupWSHandlers(conn);
  }

  function reconnect() {
    ws.close();
    connect();
  }

  function setupWSHandlers(socket: WebSocket) {
    socket.onopen = () => {
      setStatus("CONNECTED");
    };

    socket.onclose = (e) => {
      setStatus("DISCONNECTED");

      const { code, reason } = e;

      if (!reason) {
        reconnect();
      }

      console.log("Socket closed with code: " + code + " and reason: " + reason);
    };

    socket.onerror = (e) => {
      setStatus("ERROR");

      console.error(e);
    };

    return socket;
  }

  return { socket: ws, statusAccessor: status };
}
