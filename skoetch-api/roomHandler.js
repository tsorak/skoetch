import { activeSockets } from "./socketHandler.js";

const roomData = new Map() // <ROOMNAME, data:[]> 
const roomClients = new Map() // <ROOMNAME, clients:[]> 

function newRoom(requestedRoom, startingCanvas = []) {
    if (roomData.has(requestedRoom)) { //SHOULDNT EVER BE TRIGGERED.
        // joinRoom(requestedRoom, socketID);
        console.log("this shouldn't have happened. 9 @ roomhandler.js")
        Deno.exit(1);
    } else {
        roomData.set(requestedRoom, startingCanvas);
        roomClients.set(requestedRoom, []);
        // console.dir(roomClients.get(requestedRoom));
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

    console.dir(roomData)
    console.dir(roomClients)
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

export {
    newRoom,
    joinRoom,
    leaveRoom,
    updateRoomData
}