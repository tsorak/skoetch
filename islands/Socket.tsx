import { useEffect, useRef, useState } from "preact/hooks";
import Canvas from "./Canvas.tsx";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import Chat from "./Chat.tsx";
import getType from "@/utils/getType.ts";

interface SocketProps {
  roomID: string;
}

export default function Socket(props: SocketProps) {
  const [recievedLines, setRecievedLines] = useState([]);
  const [recievedMsgs, setRecievedMsgs] = useState([]);
  // const [outgoingMessage, setOutgoingMessage] = useState("");
  let socket: WebSocket | null;
  // const socket = useRef(null)

  // useEffect should only be run on mount
  useEffect(() => {
    console.log("[%cMOUNTED%c] Socket", "color: #0f0", "color: #fff");
    
    try {
      socket = new WebSocket("ws://" + location.host + location.pathname);
      // console.log(socket);
      
  
      socket.onopen = () => console.log("socket opened");
      socket.onmessage = (e) => {
        let parsed: any;
        try {
          parsed = JSON.parse(e.data);
        } catch (error) {
          parsed = e.data;
        }
        // console.log("socket message:", parsed);

        switch (getType(parsed)) {
          case "string":
            //chat msg
            setRecievedMsgs(arr => [...arr, parsed]);
            break;
          case "object":
            //single paint object
            //we dont want solo paint objects at all.
            setRecievedLines(arr => [...arr, parsed]);
            break;
          case "array":
            //multiple paint objects or chat messages
            switch (getType(parsed[0])) {
              case "string":
                //chat messages
                parsed.forEach(msg => {
                  setRecievedMsgs(arr => [...arr, msg]);
                });

                break;
              case "object":
                //canvas points
                parsed.forEach(line => {
                  setRecievedLines(arr => [...arr, line]);
                });
                break;
              case "array":
                //initial room data
                setRecievedLines(arr => [...arr, ...parsed[0]]);
                setRecievedMsgs(arr => [...arr, ...parsed[1]]);
                break;
              default:
                throw new Error("invalid socket message type");
            }
            break;
          default:
            throw new Error("invalid socket message type");
        }
      };
      
      socket.onerror = (e) => console.log("socket errored:", e);
      socket.onclose = () => console.log("socket closed");
  
    } catch (error) {
      console.log(error);
    }
  }, [])
  
  function sendMsg(e) {
    e.preventDefault();
    const msg = e.srcElement.clientMsg.value;
    e.srcElement.clientMsg.value = "";
    if (!msg) return;
    
    socket.send(msg);
  }

  function sendLine(line) {
    socket.send(JSON.stringify(line));
  }

  return (
    <div class="flex flex-none">
      <div class="flex border-1 border-gray-600">
        <Canvas sendLine={sendLine} recievedLines={recievedLines} />
      </div>
      
      <div class="flex flex-col h-auto max-w-min place-content-stretch">
        <Chat sendMsg={sendMsg} recievedMsgs={recievedMsgs} />
      </div>
    </div>
  );
}
