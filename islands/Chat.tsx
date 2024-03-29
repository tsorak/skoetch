/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

// interface CanvasProps {
    
// }

interface Chat {
    socket: WebSocket;
}


export default function Chat(props: any) {

    console.log(props);
    const { sendMsg, recievedMsgs } = props;
    const [outMsg, setOutMsg] = useState("");

    // console.log(recievedMsgs[0])

    const form = useRef()

    const island = {
        hasMounted: false,
    }

    useEffect(() => {
        if (!island.hasMounted) return;
        console.log("%cChat %cMounted", "color: #fff", "color: #0f0");

        form.current.addEventListener("submit", sendMsg);

    }, [island.hasMounted])
    island.hasMounted = true;

    return (
        <>
            <ul class={tw`text-sm flex-none justify-end overflow-y-scroll`}>
                {recievedMsgs.map((msg: string) => <li key={msg}>{msg}</li>)}
            </ul>
            <form ref={form}>
                <input class={tw`focus:outline-none border-2 border-gray-200 rounded`} type="text" name="clientMsg" autoComplete="off" autofocus value={outMsg} />
            </form>
        </>
    );
}
