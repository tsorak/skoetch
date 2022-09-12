import { useState, useEffect, useRef } from "preact/hooks";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
// interface CanvasProps {
    
// }

interface Chat {
    socket: WebSocket;
}


export default function Chat(props: any) {

    // console.log(props);
    const { sendMsg, recievedMsgs } = props;

    // console.log(recievedMsgs[0])

    const form = useRef()

    useEffect(() => {
        console.log("%cChat %cMounted", "color: #fff", "color: #0f0");

        form.current.addEventListener("submit", sendMsg);

    }, [])

    return (
        <>
            <ul class="text-sm flex-none justify-end overflow-y-scroll">
                {recievedMsgs.map((msg: string) => <li key={msg}>{msg}</li>)}
            </ul>
            <form ref={form}>
                <input class="focus:outline-none border-2 border-gray-200 rounded" type="text" name="clientMsg" autoComplete="off" autofocus />
            </form>
        </>
    );
}
