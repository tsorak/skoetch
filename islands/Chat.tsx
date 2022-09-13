import { useState, useEffect, useRef, MutableRef } from "preact/hooks";
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

    const form = useRef(null)
    const messageDiv = useRef(null)

    useEffect(() => {
        console.log("[%cMOUNTED%c] Chat", "color: #0f0", "color: #fff");

        form.current.addEventListener("submit", sendMsg);

    }, [])

    useEffect(() => {
        messageDiv.current.scrollTop = messageDiv.current.scrollHeight - messageDiv.current.offsetHeight
    }, [recievedMsgs])
    

    return (
        <div class="flex flex-col">
            <div ref={messageDiv} class="px-1 inline flex-grow text-sm overflow-y-scroll h-0">
                {!recievedMsgs.length && <p class="text-gray-400">Connecting to chat...</p>}
                {recievedMsgs && recievedMsgs.map((msg: string) => <p><span class="text-xs text-gray-400">{(new Date).getHours()}:{(new Date).getMinutes()}</span> {msg}</p>)}
            </div>
            <form ref={form}>
                <input class="focus:outline-none border-2 border-gray-200 rounded" type="text" name="clientMsg" autoComplete="off" autofocus />
            </form>
        </div>
    );
}
