/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import Socket from "../islands/Socket.tsx";


export default function RoomCanvas(props: PageProps) {
  return (
  <div>
    <p>Welcome to: {props.params.roomCode}</p>
    <Socket roomID={props.params.roomCode} />
  </div>
  );
}
