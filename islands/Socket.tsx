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
  // let socket: WebSocket;
  const socket = useRef(null)

  const island = {
    hasMounted: false,
  }
  // useEffect should only be run on mount
  useEffect(() => {
    if (!island.hasMounted) return;
    console.log("%cSocket %cMounted", "color: #fff", "color: #0f0");
    
    try {
      socket.current = new WebSocket("ws://" + location.host + location.pathname);
  
      socket.current.onopen = () => console.log("socket opened");
      socket.current.onmessage = (e) => {
        let parsed: any;
        try {
          parsed = JSON.parse(e.data);
        } catch (error) {
          parsed = e.data;
        }
        console.log("socket message:", parsed);

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
  
        // if (typeof parsed === "string") {
        //   // setIncomingMessages(arr => [...arr, parsed]);
        //   updateChat(parsed);
        // } else {
        //   updateCanvas(parsed);
        //   // try {
        //   //   parsed.forEach(msg => {
        //   //     setIncomingMessages(arr => [...arr, msg]);
        //   //   });
        //   // } catch (error) {
        //   //   console.log(error);
        //   // }
        // }
  
      };
      socket.current.onerror = (e) => console.log("socket errored:", e);
      socket.current.onclose = () => console.log("socket closed");
  
    } catch (error) {
      console.log(error);
    }
  }, [island.hasMounted])
  island.hasMounted = true;
  
  function sendMsg(e) {
    e.preventDefault();
    const msg = e.srcElement.clientMsg.value;
    if (!msg) return;
    socket.current.send(msg);
  }

  function sendLine(line) {    
    socket.current.send(JSON.stringify(line));
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
