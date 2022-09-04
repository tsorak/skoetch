/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Canvas from "./Canvas.tsx";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface SocketProps {
  roomID: string;
}

export default function Socket(props: SocketProps) {
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessage, setOutgoingMessage] = useState("");
  const form = useRef()
  let socket: WebSocket;

  const island = {
    hasMounted: false,
  }
  // useEffect should only be run on mount
  useEffect(() => {
    if (!island.hasMounted) return;
    console.log("%cSocket %cMounted", "color: #fff", "color: #0f0");

    form.current.addEventListener("submit", sendMsg);
    
    try {
      socket = new WebSocket("ws://" + location.host + location.pathname);
  
      socket.onopen = () => console.log("socket opened");
      socket.onmessage = (e) => {
        let parsed: any;
        try {
          parsed = JSON.parse(e.data);
        } catch (error) {
          parsed = e.data;
        }
  
        console.log("socket message:", parsed);
  
        if (typeof parsed === "string") {
          setIncomingMessages(arr => [...arr, parsed]);
        } else {
          try {
            parsed.forEach(msg => {
              setIncomingMessages(arr => [...arr, msg]);
            });
          } catch (error) {
            console.log(error);
          }
        }
  
      };
      socket.onerror = (e) => console.log("socket errored:", e);
      socket.onclose = () => console.log("socket closed");
  
    } catch (error) {
      console.log(error);
    }
  }, [island.hasMounted])
  island.hasMounted = true;

  function sendMsg(e) {
    e.preventDefault();
    const msg = e.srcElement.clientMsg.value;
    if (!msg) return;
    socket.send(msg);
  }

  return (
    <div class={tw`flex flex-none`}>
      <div class={tw`flex border-1 border-gray-600`}>
        <Canvas />
      </div>
      
      <div class={tw`flex flex-col max-h-initial max-w-min justify-end`}>
        <div class={tw`flex flex-col grow-0 max-h-initial`}>
          {/* <p>Recieved Messages:</p> */}
          <ul class={tw`text-sm flex-none justify-end overflow-scroll`}>
            {incomingMessages.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
        <form ref={form}>
          {/* <p>Send Message:</p> */}
          <input class={tw`focus:outline-none border-2 border-gray-200 rounded`} type="text" name="clientMsg" autoComplete="off" autofocus value={outgoingMessage} />
        </form>
      </div>
    </div>
  );
}
