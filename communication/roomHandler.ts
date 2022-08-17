import { activeSockets } from "./socketHandler.ts";

const roomData = new Map() // <ROOMNAME, data:[]> 
const roomClients = new Map() // <ROOMNAME, clients:[]> 

function newRoom(requestedRoom, startingCanvas = []) {
    if (roomData.has(requestedRoom)) {
        return false; //ROOM EXISTS
    } else {
        roomData.set(requestedRoom, startingCanvas);
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
        activeSockets.get(socketID).send(JSON.stringify(roomData.get(requestedRoom)));
    }

    console.dir(requestedRoom + "'s entries: " + roomData.get(requestedRoom).length);
    console.dir(roomClients.get(requestedRoom));
}

function leaveRoom(requestedRoom, socketID) {
    if (!roomData.has(requestedRoom) && !roomClients.has(requestedRoom)) {
        return;
    } else {
        const clientsConnectedToRoom = roomClients.get(requestedRoom);
        clientsConnectedToRoom.splice(clientsConnectedToRoom.indexOf(socketID), 1);
        // roomClients.set(requestedRoom, clientsConnectedToRoom);
    }
}

function updateRoomData(roomID, line) {
    roomData.get(roomID).push(line);

    //UPDATE ALL CLIENTS
    roomClients.get(roomID).forEach(socketID => {
        activeSockets.get(socketID).send(JSON.stringify(line));
    });
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