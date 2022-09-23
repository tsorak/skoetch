import { PageProps, Handlers } from "$fresh/server.ts";
import Canvas from "@/islands/Canvas.tsx";
import Chat from "@/islands/Chat.tsx";
import { roomExists } from "../../communication/roomHandler.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const roomID = url.pathname.split("/")[2];

    if (!roomExists(roomID)) return Response.redirect(url.origin);
    // const res: Response = new Response;
    // console.log(ctx, req, res);
    
    return ctx.render();
  }
}

export default function RoomCanvasPage(props: PageProps) {
  return (
  <div class="flex flex-none w-screen h-screen items-center justify-center overflow-visible">
    {/* <h1 class="mt-16 text-xl">Welcome to {props.params.roomCode}!</h1> */}
    {/* <Socket roomID={props.params.roomCode} /> */}
    <div class="flex min-h-[600px]">
      <Canvas />
      <Chat />
    </div>
  </div>
  );
}