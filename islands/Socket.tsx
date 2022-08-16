/** @jsx h */
import { h } from "preact";
// import { useState } from "preact/hooks";
import { tw } from "@twind";

interface SocketProps {
  roomID: string;
}

export default function Socket(props: SocketProps) {
//   const [roomID, setRoomID] = useState(props.roomID);
  return (
    <div class={tw`flex w-full`}>
        👍{props.roomID}
    </div>
  );
}
