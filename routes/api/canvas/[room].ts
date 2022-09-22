import { Handlers } from "$fresh/server.ts";
import { roomExists, joinRoom, leaveRoom, updateRoomData, connectedClients } from "@/communication/roomHandler.ts"
import { storeSocket, removeSocket } from "@/communication/socketHandler.ts"
import socketTypes from "@/utils/socketTypes.ts";

export const handler: Handlers = {
  GET(req, _ctx) {
    const url = new URL(req.url);
    const roomID = url.pathname.split("/")[3];

    //redirect any request if the room does not exist
    if (!roomExists(roomID)) return Response.json("Room not found", {status: 400});

    let response: Response, socket: WebSocket;
    try {
      ({ response, socket } = Deno.upgradeWebSocket(req));
    } catch {
      //Request isn't trying to upgrade to websocket.
      return Response.json("Websocket only", {status: 426});
    }
    socket.roomID = roomID;
    return socketHandler({response, socket});
  },
};

function socketHandler(data: {response: Response, socket: WebSocket}): Response {
  const {response, socket} = data;

  socket.onopen = () => handleConnected(socket);
  socket.onmessage = (m) => handleMessage(socket, m.data);
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => handleDisconnect(socket);
  
  return response;
}

function handleConnected(socket) {
  // console.log("Connected to client ...");
  socket.id = crypto.randomUUID();
  storeSocket(socketTypes.CANVAS, socket.id, socket);
  // console.log("Joining room...");
  joinRoom(socketTypes.CANVAS, socket.roomID, socket.id);

  console.log(`[CANVAS - ${socket.roomID}(${connectedClients(socket.roomID)})] CONNECT ${socket.id}`);
}
function handleDisconnect(socket) {
  // console.log("Disconnected from client ...");
  removeSocket(socketTypes.CANVAS, socket.id, socket.roomID);
  leaveRoom(socketTypes.CANVAS, socket.roomID, socket.id);
  console.log(`[CANVAS - ${socket.roomID}(${connectedClients(socket.roomID)})] DISCONNECT ${socket.id}`);
}

function handleMessage(socket, data) {
  updateRoomData(socketTypes.CANVAS, socket.roomID, data);
  console.log(`[CANVAS - ${socket.roomID}] ${data}`);

  // const socketPos = [...activeSockets.keys()].indexOf(socket.id);
  // console.log("{" + socket.roomID + "} [" + socketPos + "]>>", parsedData);
}