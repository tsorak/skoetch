/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Form from "../islands/Form.tsx";

export default function Home() {
  return (
    <div class={tw`flex flex-col p-4 mx-auto max-w-screen-md gap-2`}>
      {/* <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <p class={tw`my-6`}>
        Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
        file, and refresh.
      </p>
      <Counter start={3} /> */}

      <p class={tw`font-bold`}>ENTER <span class={tw`font-normal`}>room code</span></p>
      <Form id="roomID_form" />
    </div>
  );
}
