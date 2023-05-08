import { Title, useRouteData } from "solid-start";
import { createEffect, createSignal } from "solid-js";
import Counter from "~/components/Counter";

import { setupWebsocket } from "~/ws/websocket";

export function routeData() {
  return {
    ws: setupWebsocket()
  };
}

export default function Home() {
  const { ws } = useRouteData<typeof routeData>();

  const [wsEventLog, setWsEventLog] = createSignal<string[]>([]);

  const wsClosedHandler = (e: CloseEvent | Event) => {
    const reason = e instanceof CloseEvent ? e.reason : "Unknown reason";

    setWsEventLog((prev) => [...prev, `[${e.type.toUpperCase()}] ${reason}`]);
  };

  ws.socket.addEventListener("close", wsClosedHandler);
  ws.socket.addEventListener("error", wsClosedHandler);

  ws.socket.addEventListener("message", (event) => {
    setWsEventLog((prev) => [...prev, event.data]);
  });

  createEffect(() => {
    console.log("ws status", ws.statusAccessor());
  });

  createEffect(() => {
    console.log("ws log", wsEventLog());
  });

  return (
    <main>
      <Title>{ws.statusAccessor()}</Title>
      <h1 class="text-2xl text-red-400">Hello world!</h1>
      <Counter />
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
      {wsEventLog().map((string, index) => (
        <p>wot {string}</p>
      ))}
    </main>
  );
}
