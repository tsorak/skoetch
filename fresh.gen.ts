// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/api/_server.ts";
import * as $1 from "./routes/api/canvas/[room].ts";
import * as $2 from "./routes/api/chat/[room].ts";
import * as $3 from "./routes/index.tsx";
import * as $4 from "./routes/room/[roomCode].tsx";
import * as $5 from "./routes/tab.tsx";
import * as $$0 from "./islands/Canvas.tsx";
import * as $$1 from "./islands/Chat.tsx";
import * as $$2 from "./islands/Counter.tsx";
import * as $$3 from "./islands/Form.tsx";
import * as $$4 from "./islands/Socket.tsx";
import * as $$5 from "./islands/Tab.tsx";

const manifest = {
  routes: {
    "./routes/api/_server.ts": $0,
    "./routes/api/canvas/[room].ts": $1,
    "./routes/api/chat/[room].ts": $2,
    "./routes/index.tsx": $3,
    "./routes/room/[roomCode].tsx": $4,
    "./routes/tab.tsx": $5,
  },
  islands: {
    "./islands/Canvas.tsx": $$0,
    "./islands/Chat.tsx": $$1,
    "./islands/Counter.tsx": $$2,
    "./islands/Form.tsx": $$3,
    "./islands/Socket.tsx": $$4,
    "./islands/Tab.tsx": $$5,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
