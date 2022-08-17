/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
// import Form from "../islands/Form.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { roomExists, newRoom } from "@/communication/roomHandler.ts"

interface Data {
  roomID: string;
  status: {
    error: string;
    info: string;
  }
}

const config: Data = {
  roomID: "",
  status: {
    error: "",
    info: ""
  }
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    if (!url.searchParams.has("roomID")) return ctx.render(config)

    const query = url.searchParams.get("roomID") || "";
    //validate
    try {
      if (query === "") throw new Error("No room code provided");
      if (query.length < 6 || query.length > 24) throw new Error("Room code must be between 6-24 characters");
    } catch (e) {
      config.status.error = e.message;
      return ctx.render(config)
    }

    config.roomID = query;

    // if (config.roomID === "") return ctx.render({ roomID: config.roomID, status: config.status });
    // if (!roomExists(roomID)) return new Response("Room doesn't exist", {status: 418});

    const redirectURL = url.origin + "/" + config.roomID;

    if (!roomExists(config.roomID)) {
      // console.log("roomExists:", roomExists(config.roomID));
      newRoom(config.roomID);
    }

    return Response.redirect(redirectURL);
  },  
};

export default function Home({ data }: PageProps<Data>) {
  const { roomID, status } = data;
  return (
    <div class={tw`flex flex-col justify-center items-center h-screen`}>
      <div class={tw`relative group flex flex-col max-w-min gap-[2px]`}>
        <p class={tw`font-bold self-center text-gray-600`}>ENTER ROOM CODE</p>
        <div class={tw`absolute scale-x-0 translate-y-5 transition-scale group-focus-within:scale-x-75 w-full h-[2px] bg-sky-500`}></div>
        <form>
          
          <input class={tw`p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-sky-500`} type="text" name="roomID" placeholder="Room Code" autoComplete="off" autofocus={true} required={false} />
          <div class={tw`min-h-[40px]`}>
            <p class={tw`pl-1 text-red-500 text-sm font-semibold`}>{status.error}</p>
            <p class={tw`pl-1 text-lime-500 text-sm font-semibold`}>{status.info}</p>
          </div>
          {status.error = ""}
          {status.info = ""}
        </form>
      </div>
    </div>
  );
}
