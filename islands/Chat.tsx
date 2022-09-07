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
    const { sendMsg, incMsgs } = props;
    const [outMsg, setOutMsg] = useState("");

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

    // function sendMsg(e) {
    //     e.preventDefault();
    //     const msg = e.srcElement.clientMsg.value;
    //     if (!msg) return;
    //     socket.current.send(msg);
    // }

    return (
        <>
            <ul class={tw`text-sm flex-none justify-end overflow-y-scroll`}>
                {/* {incomingMessages.map((name) => <li key={name}>{name}</li>)} */}
            </ul>
            <form ref={form}>
                <input class={tw`focus:outline-none border-2 border-gray-200 rounded`} type="text" name="clientMsg" autoComplete="off" autofocus value={outMsg} />
            </form>
        </>
    );
}
