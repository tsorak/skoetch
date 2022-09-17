import { PageProps } from "$fresh/server.ts";
// import { IS_BROWSER } from "$fresh/runtime.ts";
// import Socket from "@/islands/Socket.tsx";
import Canvas from "@/islands/Canvas.tsx";
import Chat from "@/islands/Chat.tsx";
// import { roomExists, joinRoom, updateRoomData } from "@/communication/roomHandler.ts"
// import { storeSocket, removeSocket, activeSockets } from "@/communication/socketHandler.ts"

// interface Data {
//   results: string[];
//   query: string;
// }

// export const handler: Handlers = {
//   GET(req, ctx) {
//     const url = new URL(req.url);
//     const roomID = url.pathname.split("/")[2];

//     //redirect any request if the room does not exist
//     if (!roomExists(roomID)) return Response.redirect(url.origin);

//     let response: Response, socket: WebSocket;
//     try {
//       ({ response, socket } = Deno.upgradeWebSocket(req));
//     } catch {
//       //Request isn't trying to upgrade to websocket.
//       return ctx.render();
//     }
//     socket.roomID = roomID;
//     return socketHandler({response, socket});
//   },
// };

// function socketHandler(data: {response: Response, socket: WebSocket}): Response {
//   const {response, socket} = data;

//   socket.onopen = () => handleConnected(socket);
//   socket.onmessage = (m) => handleMessage(socket, m.data);
//   // {
//   //   let parsed;
//   //   try {
//   //     parsed = JSON.parse(e.data);
//   //   } catch (error) {
//   //     parsed = e.data;
//   //   }

//   //   console.log("socket message:", parsed);
//   //   socket.send(parsed);
//   // };
//   socket.onerror = (e) => console.log("socket errored:", e);
//   socket.onclose = () => handleDisconnect(socket);
  
//   return response;
// }

// function handleConnected(socket) {
//   console.log("Connected to client ...");
//   socket.id = crypto.randomUUID();
//   // socket.currentRoom = (socket.currentRoom !== undefined) ? socket.currentRoom : "default";
//   console.log(socket.roomID, socket.id);
//   storeSocket(socket.id, socket);
//   // socket.send(JSON.stringify(getLines()));
//   console.log("joining room");
//   joinRoom(socket.roomID, socket.id);
// }
// function handleDisconnect(socket) {
//   console.log("Disconnected from client ...");
//   removeSocket(socket.id, socket.roomID);
// }

// function handleMessage(socket, data) {
//   const parsedData = updateRoomData(socket.roomID, data);

//   const socketPos = [...activeSockets.keys()].indexOf(socket.id);
//   console.log("{" + socket.roomID + "} [" + socketPos + "]>>", parsedData);
// }

export default function RoomCanvasPage(props: PageProps) {
  return (
  <div class="flex flex-none w-screen h-screen items-center justify-center overflow-visible">
    {/* <h1 class="mt-16 text-xl">Welcome to {props.params.roomCode}!</h1> */}
    {/* <Socket roomID={props.params.roomCode} /> */}
    <div class="flex min-h-[600px]">
      <Canvas />
      <Chat />
    </div>
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