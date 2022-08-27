/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
// import Form from "../islands/Form.tsx";
import { PageProps } from "$fresh/server.ts";
// import { roomExists, newRoom } from "@/communication/roomHandler.ts"

export default function Tab({ data }: PageProps<Map<string, boolean>>) {
    const tabs:Map<string, boolean> = data;
    const tabNames: string[] = [];
    const bajsApor: string[] = ["FOO","BAJ","BAR","XD"];

    return (
        <form class={tw`flex justify-between w-[33vw]`}>
            {/* <a class={tw`flex flex-col border-b-4 border-sky-600`} href="tab/tab1">
                <input type="radio" name="page" id="tab1" class={tw`hidden`} checked />
                THIS
            </a>
            <a class={tw`flex flex-col border-b-4 border-white`} href="tab/tab2">
                <input type="radio" name="page" id="tab2" class={tw`hidden`} />
                THAT
            </a>
            <a class={tw`flex flex-col border-b-4 border-white`} href="tab/tab3">
                <input type="radio" name="page" id="tab3" class={tw`hidden`} />
                THESE
            </a> */}
            {/* {tabNames.forEach(key => <p>{key}</p>)} */}
            {bajsApor.map(tab => <p>{tab}</p>)}
        </form>
    );
}