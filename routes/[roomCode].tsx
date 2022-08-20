/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
// import { IS_BROWSER } from "$fresh/runtime.ts";
import Socket from "../islands/Socket.tsx";
import { roomExists, joinRoom, updateRoomData } from "@/communication/roomHandler.ts"
import { storeSocket, removeSocket } from "@/communication/socketHandler.ts"

// interface Data {
//   results: string[];
//   query: string;
// }

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const roomID = url.pathname.split("/")[1];

    if (!roomExists(roomID)) return Response.redirect(url.origin);

    let response: Response, socket: WebSocket;
    try {
      ({ response, socket } = Deno.upgradeWebSocket(req));
    } catch {
      //Request isn't trying to upgrade to websocket.
      return ctx.render();
    }
    socket.roomID = roomID;
    return socketHandler({response, socket});
  },
};

function socketHandler(data: {response: Response, socket: WebSocket}): Response {
  const {response, socket} = data;

  socket.onopen = () => handleConnected(socket);
  socket.onmessage = (m) => handleMessage(socket, m.data);
  // {
  //   let parsed;
  //   try {
  //     parsed = JSON.parse(e.data);
  //   } catch (error) {
  //     parsed = e.data;
  //   }

  //   console.log("socket message:", parsed);
  //   socket.send(parsed);
  // };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => handleDisconnect(socket);
  
  return response;
}

function handleConnected(socket) {
  console.log("Connected to client ...");
  socket.id = crypto.randomUUID();
  // socket.currentRoom = (socket.currentRoom !== undefined) ? socket.currentRoom : "default";
  console.log(socket.roomID, socket.id);
  storeSocket(socket.id, socket);
  // socket.send(JSON.stringify(getLines()));
  console.log("joining room");
  joinRoom(socket.roomID, socket.id);
}
function handleDisconnect(socket) {
  console.log("Disconnected from client ...");
  removeSocket(socket.id, socket.roomID);
}

function handleMessage(socket, data) {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    parsedData = data;
  }
  console.log("Socket id (socket.id):", socket.id, "Socket room (socket.roomID):", socket.roomID);
  if (typeof parsedData === "string") {
    updateRoomData(socket.roomID, parsedData);
  }
  // if (typeof parsedData === "object") {
  //     if (!parsedData.type) {
  //         //Default message is treated as a line object
  //         room.updateRoomData(ws.currentRoom, parsedData) //+ id when roomdata = (roomID, [clients:[lines]])
  //     }
  //     if (parsedData.type) {
  //         switch (parsedData.type) {
  //             case MESSAGE_TYPE.NEWROOM: //NEW ROOM
  //                 console.log("switch newroom");
  //                 room.newRoom(ws.currentRoom, ws.id);
  //                 break;

  //             case MESSAGE_TYPE.JOINROOM: //JOIN ROOM
  //                 console.log("switch joinroom");
  //                 room.joinRoom(ws.currentRoom, ws.id);
  //                 break;

  //             case MESSAGE_TYPE.LEAVEROOM: //LEAVE ROOM
  //                 console.log("switch leaveroom");
  //                 room.leaveRoom(ws.currentRoom, ws.id);
  //                 break;

  //             default:
  //                 break;
  //         }
  //     }
  // }
  console.log("CLIENT >>", parsedData);
}

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