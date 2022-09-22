import { chatSockets, canvasSockets } from "./socketHandler.ts";
import socketTypes from "@/utils/socketTypes.ts";

const roomCanvas = new Map() // <ROOMNAME, data:[]>
const roomChat = new Map()
const roomCanvasClients = new Map() // <ROOMNAME, clients:[]> 
const roomChatClients = new Map() // <ROOMNAME, clients:[]> 

function newRoom(requestedRoom, startingCanvas = []) {
    if (roomCanvas.has(requestedRoom)) {
        return false; //ROOM EXISTS
    } else {
        roomCanvas.set(requestedRoom, startingCanvas);
        roomChat.set(requestedRoom, [`Welcome to ${requestedRoom}!`]);
        roomCanvasClients.set(requestedRoom, []);
        roomChatClients.set(requestedRoom, []);
        return true; //ROOM CREATED
    }
}
newRoom("lulexdd"); 
for (let i = 0; i < 32; i++) {
    updateRoomData(socketTypes.CHAT, "lulexdd", "forsen")
}

function joinRoom(type, requestedRoom, socketID) {
    if (!roomCanvas.has(requestedRoom)) {
        console.log("Requested room does not exist.");
        // newRoom(requestedRoom);
        return;
    } else {
        switch (type) {
            case socketTypes.CANVAS:
                roomCanvasClients.get(requestedRoom).push(socketID);
                canvasSockets.get(socketID).send(JSON.stringify({type: "initialCanvasObjects", body: roomCanvas.get(requestedRoom)}));
                break;

            case socketTypes.CHAT:
                roomChatClients.get(requestedRoom).push(socketID);
                chatSockets.get(socketID).send(JSON.stringify({type: "initialMessages", body: roomChat.get(requestedRoom)}));
                break;

            default:
                break;
        }
        // roomClients.get(requestedRoom).push(socketID);
        // //SEND CURRENT ROOM DATA
        // activeSockets.get(socketID).send(JSON.stringify([roomCanvas.get(requestedRoom), roomChat.get(requestedRoom)])); //SPLIT
    }

    // console.dir(requestedRoom + "'s entries: " + roomCanvas.get(requestedRoom).length);
    // console.dir(requestedRoom + "'s chat: " + roomChat.get(requestedRoom).length);
    // console.dir(roomClients.get(requestedRoom));
}

function leaveRoom(type, requestedRoom, socketID) {
    if (!roomChatClients.has(requestedRoom) || !roomCanvasClients.has(requestedRoom)) return;
    switch (type) {
        case socketTypes.CANVAS:
            roomCanvasClients.get(requestedRoom).splice(roomCanvasClients.get(requestedRoom).indexOf(socketID), 1);
            break;

        case socketTypes.CHAT:
            roomChatClients.get(requestedRoom).splice(roomChatClients.get(requestedRoom).indexOf(socketID), 1);
            break;

        default:
            break;
    }
    // const clientsConnectedToRoom = roomClients.get(requestedRoom);
    // clientsConnectedToRoom.splice(clientsConnectedToRoom.indexOf(socketID), 1);
    // roomClients.set(requestedRoom, clientsConnectedToRoom);
}

function updateRoomData(type, roomID, data) {
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (_error) {
        parsedData = data;
    }

    // console.dir(parsedData);
    
    switch (type) {
        case socketTypes.CANVAS:
            roomCanvas.get(roomID).push(parsedData);
            roomCanvasClients.get(roomID).forEach((socketID: string) => {
                canvasSockets.get(socketID).send(JSON.stringify({type: "canvasObject", body: parsedData}));
            });
            break;

        case socketTypes.CHAT:
            roomChat.get(roomID).push(parsedData);
            roomChatClients.get(roomID).forEach((socketID: string) => {
                chatSockets.get(socketID).send(JSON.stringify({type: "chatMessage", body: parsedData}));
            });
            break;

        default:
            break;
    }
    
    // //CHECK IF CHAT MESSAGE IS PARSE-ABLE AS AN OBJECT, if not it's a chat message
    // let parsedData;
    // try {
    //     parsedData = JSON.parse(data);
    // } catch (_error) {
    //     parsedData = data;
    // }
    // // console.log("Socket id (socket.id):", socket.id, "Socket room (socket.roomID):", socket.roomID);
    // if (typeof parsedData === "string") {
    //     roomChat.get(roomID).push(parsedData);
    // } else if (typeof parsedData === "object") {
    //     roomCanvas.get(roomID).push(parsedData);
    // }
    
    // //UPDATE ALL CLIENTS
    // roomClients.get(roomID).forEach(socketID => {
    //     activeSockets.get(socketID).send(JSON.stringify(parsedData));
    // });

    return parsedData;
}

const roomExists = (roomID: string) => {
    if (roomCanvas.get(roomID)) {
        return true;
    } else {
        return false;
    }
}

const connectedClients = (roomID: string) => {
    return [...roomCanvasClients.get(roomID), ...roomChatClients.get(roomID)].length;
}

export {
    joinRoom,
    newRoom,
    leaveRoom,
    updateRoomData,
    roomExists,
    connectedClients
}