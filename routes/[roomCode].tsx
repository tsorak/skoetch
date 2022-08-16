/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Socket from "../islands/Socket.tsx";
import { roomExists } from "@/communication/roomHandler.ts"

// interface Data {
//   results: string[];
//   query: string;
// }

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const reqRoomID = url.searchParams.get("roomID") || "";
    // const results = NAMES.filter((name) => name.includes(query));
    // return ctx.render({ results, query });
    if (!roomExists(reqRoomID)) return new Response("Room doesn't exist", {status: 418});
    // return new Response("Room exists", {status: 200});
    return ctx.render();
  },
};

export default function RoomCanvasPage(props: PageProps) {
  return (
  <div>
    <p>Welcome to: {props.params.roomCode}</p>
    <Socket roomID={props.params.roomCode} />
  </div>
  );
}

// export default function Page({ data }: PageProps<Data>) {
//   const { results, query } = data;
//   return (
//     <div>
//       <form>
//         <input type="text" name="q" value={query} />
//         <button type="submit">Search</button>
//       </form>
//       <ul>
//         {results.map((name) => <li key={name}>{name}</li>)}
//       </ul>
//     </div>
//   );
// }