import { serve } from "https://deno.land/std/http/mod.ts";
import * as room from "./roomHandler.js";
import { removeSocket, storeSocket } from "./socketHandler.js";
import * as defaultCanvas from "./defaultCanvas.js"

const MESSAGE_TYPE = {
    NEWROOM: "NEW_ROOM",
    JOINROOM: "JOIN_ROOM",
    LEAVEROOM: "LEAVE_ROOM",
    CLEARCANVAS: "CLEAR_CANVAS"
}
Object.freeze(MESSAGE_TYPE);

function handleConnected(socket) {
    console.log("Connected to client ...");
    socket.id = crypto.randomUUID();
    socket.currentRoom = (socket.currentRoom != undefined) ? socket.currentRoom : "default";
    console.log(socket.currentRoom, socket.id);
    storeSocket(socket.id, socket);
    // socket.send(JSON.stringify(getLines()));

    if (socket.currentRoom != "") {
        console.log("joining room");
        room.joinRoom(socket.currentRoom, socket.id);
    }
}

function handleDisconnect(socket) {
    console.log("Disconnected from client ...");
    removeSocket(socket.id, socket.currentRoom);
}

function handleMessage(ws, data) {
    const parsedData = JSON.parse(data);
    console.log("Socket id (ws.id):", ws.id, "Socket room (ws.currentRoom):", ws.currentRoom);
    if (typeof parsedData === "object") {
        if (!parsedData.type) {
            //Default message is treated as a line object
            room.updateRoomData(ws.currentRoom, parsedData) //+ id when roomdata = (roomID, [clients:[lines]])
        }
        if (parsedData.type) {
            switch (parsedData.type) {
                case MESSAGE_TYPE.NEWROOM: //NEW ROOM
                    console.log("switch newroom");
                    room.newRoom(ws.currentRoom, ws.id);
                    break;

                case MESSAGE_TYPE.JOINROOM: //JOIN ROOM
                    console.log("switch joinroom");
                    room.joinRoom(ws.currentRoom, ws.id);
                    break;

                case MESSAGE_TYPE.LEAVEROOM: //LEAVE ROOM
                    console.log("switch leaveroom");
                    room.leaveRoom(ws.currentRoom, ws.id);
                    break;

                default:
                    break;
            }
        }
    }
    console.log("CLIENT >>", parsedData);
    // const reply = "No reply";
    // if (reply === "exit") {
    //     return ws.close();
    // }
    // ws.send(reply);
}
function handleError(e) {
    console.log(e instanceof ErrorEvent ? e.message : e.type);
}
async function reqHandler(req) {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket: ws, response } = Deno.upgradeWebSocket(req);
    ws.onopen = () => handleConnected(ws);
    ws.onmessage = (m) => handleMessage(ws, m.data);
    ws.onclose = () => handleDisconnect(ws);
    ws.onerror = (e) => handleError(e);
    return response;
}
console.log("Waiting for client ...");
serve(reqHandler, { port: 8080 });
