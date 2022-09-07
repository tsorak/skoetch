import { activeSockets } from "./socketHandler.ts";

const roomData = new Map() // <ROOMNAME, data:[]>
const roomChat = new Map()
const roomClients = new Map() // <ROOMNAME, clients:[]> 

function newRoom(requestedRoom, startingCanvas = []) {
    if (roomData.has(requestedRoom)) {
        return false; //ROOM EXISTS
    } else {
        roomData.set(requestedRoom, startingCanvas);
        roomChat.set(requestedRoom, []);
        roomClients.set(requestedRoom, []);
        return true; //ROOM CREATED
    }
}

function joinRoom(requestedRoom, socketID) {
    if (!roomData.has(requestedRoom)) {
        console.log("Requested room does not exist.");
        newRoom(requestedRoom);
    } else {
        roomClients.get(requestedRoom).push(socketID);
        //SEND CURRENT ROOM DATA
        activeSockets.get(socketID).send(JSON.stringify([roomData.get(requestedRoom), roomChat.get(requestedRoom)]));
    }

    console.dir(requestedRoom + "'s entries: " + roomData.get(requestedRoom).length);
    console.dir(requestedRoom + "'s chat: " + roomChat.get(requestedRoom).length);
    console.dir(roomClients.get(requestedRoom));
}

function leaveRoom(requestedRoom, socketID) {
    if (!roomData.has(requestedRoom) && !roomClients.has(requestedRoom)) return;
    const clientsConnectedToRoom = roomClients.get(requestedRoom);
    clientsConnectedToRoom.splice(clientsConnectedToRoom.indexOf(socketID), 1);
    // roomClients.set(requestedRoom, clientsConnectedToRoom);
}

function updateRoomData(roomID, data) {
    //CHECK IF CHAT MESSAGE IS PARSE-ABLE AS AN OBJECT, if not it's a chat message
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (_error) {
        parsedData = data;
    }
    // console.log("Socket id (socket.id):", socket.id, "Socket room (socket.roomID):", socket.roomID);
    if (typeof parsedData === "string") {
        roomChat.get(roomID).push(parsedData);
    } else if (typeof parsedData === "object") {
        roomData.get(roomID).push(parsedData);
    }
    
    //UPDATE ALL CLIENTS
    roomClients.get(roomID).forEach(socketID => {
        activeSockets.get(socketID).send(JSON.stringify(parsedData));
    });

    return parsedData;
}

const roomExists = (roomID: string) => {
    if (roomData.get(roomID)) {
        return true;
    } else {
        return false;
    }
}

export {
    joinRoom,
    newRoom,
    leaveRoom,
    updateRoomData,
    roomExists
}