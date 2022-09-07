/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Canvas from "./Canvas.tsx";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import Chat from "./Chat.tsx";

interface SocketProps {
  roomID: string;
}

export default function Socket(props: SocketProps) {
  const [lastCanvasObject, setLastCanvasObject] = useState({})
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessage, setOutgoingMessage] = useState("");
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

  return (
    <div class={tw`flex flex-none`}>
      <div class={tw`flex border-1 border-gray-600`}>
        <Canvas lastCanvasObject={lastCanvasObject} socket={socket} />
      </div>
      
      <div class={tw`flex flex-col max-h-initial max-w-min place-content-stretch`}>
        <Chat socket={socket}/>
      </div>
    </div>
  );
}
