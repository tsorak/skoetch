/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
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
        let parsed: string;
        try {
          parsed = JSON.parse(e.data);
        } catch (error) {
          parsed = e.data;
        }

        console.log("socket message:", parsed);

        setIncomingMessages(arr => [...arr, parsed]);
      };
      socket.onerror = (e) => console.log("socket errored:", e);
      socket.onclose = () => console.log("socket closed");

      const form = document.getElementById("letroll");
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
    <div class={tw`flex w-full`}>
      <form id="letroll">
        <p>Send Message:</p>
        <input class={tw`focus:outline-none border-2 border-gray-200 rounded`} type="text" name="clientMsg" autoComplete="off" autofocus value={outgoingMessage} />
      </form>
      <div>
          <p>Recieved Messages:</p>
          <ul class={tw`text-sm`}>
            {incomingMessages.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
    </div>
  );
}
