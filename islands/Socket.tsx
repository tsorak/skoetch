/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import Canvas from "./Canvas.tsx";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface SocketProps {
  roomID: string;
}

export default function Socket(props: SocketProps) {
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessage, setOutgoingMessage] = useState("");
  
  let socket: WebSocket;

  window.onload = () => {
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

      const form = document.getElementById("form");
      form?.addEventListener("submit", sendMsg);

      function sendMsg(e: any) {
        e.preventDefault();
        const msg = e.srcElement.clientMsg.value;
        if (!msg) return;
        socket.send(msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div class={tw`flex flex-none`}>
      <Canvas />
      <div class={tw`flex flex-col max-h-initial max-w-min justify-end`}>
        <div class={tw`flex flex-col grow-0 max-h-initial`}>
          {/* <p>Recieved Messages:</p> */}
          <ul class={tw`text-sm flex-none justify-end overflow-scroll`}>
            {incomingMessages.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
        <form id="form">
          {/* <p>Send Message:</p> */}
          <input class={tw`focus:outline-none border-2 border-gray-200 rounded`} type="text" name="clientMsg" autoComplete="off" autofocus value={outgoingMessage} />
        </form>
      </div>
    </div>
  );
}
