import { leaveRoom } from "./roomHandler.ts";

const activeSockets = new Map();

const removeSocket = (socketID, socketsCurrentRoom) => {
    activeSockets.delete(socketID);
    if (!socketsCurrentRoom) return;
    leaveRoom(socketsCurrentRoom, socketID);
}

const storeSocket = (socketID, socket) => {
    activeSockets.set(socketID, socket);
    // console.log(activeSockets.get(socketID));
}

export {
    activeSockets,
    storeSocket,
    removeSocket
}