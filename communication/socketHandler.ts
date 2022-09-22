import socketTypes from "../utils/socketTypes.ts";

const canvasSockets = new Map();
const chatSockets = new Map();

const storeSocket = (type, socketID, socket) => {
    switch (type) {
        case socketTypes.CANVAS:
            canvasSockets.set(socketID, socket);
            break;

        case socketTypes.CHAT:
            chatSockets.set(socketID, socket);
            break;
    
        default:
            break;
    }
    // activeSockets.set(socketID, socket);
    // console.log(activeSockets.get(socketID));
}

const removeSocket = (type, socketID, socketsCurrentRoom) => {
    switch (type) {
        case socketTypes.CANVAS:
            canvasSockets.delete(socketID);
            break;

        case socketTypes.CHAT:
            chatSockets.delete(socketID);
            break;
    
        default:
            break;
    }
    // activeSockets.delete(socketID);
    // if (!socketsCurrentRoom) return; //FIXME: move to caller
    // leaveRoom(socketsCurrentRoom, socketID); //FIXME: move to caller
}

export {
    canvasSockets,
    chatSockets,
    storeSocket,
    removeSocket
}