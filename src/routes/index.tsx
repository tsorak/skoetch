import { Title, useRouteData } from "solid-start";
import Counter from "~/components/Counter";

import { setupWebsocket } from "~/ws/websocket";

export function routeData() {
  return {
    ws: setupWebsocket()
  };
}

export default function Home() {
  const { ws } = useRouteData<typeof routeData>();

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
    </main>
  );
}
