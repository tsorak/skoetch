import { PageProps } from "$fresh/server.ts";
import Canvas from "@/islands/Canvas.tsx";
import Chat from "@/islands/Chat.tsx";

// export const handler: Handlers = {
//   GET(req, ctx) {
//     const res: Response = new Response;
//     console.log(ctx, req, res);
    
//     return ctx.render();
//   }
// }

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