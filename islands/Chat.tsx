import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
// interface CanvasProps {
    
// }

// interface Chat {
//     socket: WebSocket;
// }


export default function Chat(props: any) {

    // console.log(props);
    // const { sendMsg, recievedMsgs } = props;
    const recievedMsgs = useSignal<Array<string>>([]);

    // console.log(recievedMsgs[0])

    const form = useRef(null)
    const messageDiv = useRef(null)

    let socket: WebSocket | null;

    useEffect(() => {
        // console.log("lule");
        console.log("[%cMOUNTED%c] Chat", "color: #0f0", "color: #fff");
        
        try {
            if (location.host.split(":")[0] === "localhost") {
                socket = new WebSocket("ws://" + location.host + "/api/chat/" + location.pathname.split("/")[2]);
            } else {
                socket = new WebSocket("wss://" + location.host + "/api/chat/" + location.pathname.split("/")[2]);
            }
            socket.onopen = () => console.log("socket opened");
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                // console.log(data);
                
                switch (data.type) {
                    case "initialMessages":
                        recievedMsgs.value = [...data.body];
                        break;
                    
                    case "chatMessage":
                        recievedMsgs.value = [...recievedMsgs.value, data.body];
                        break;
                
                    default:
                        break;
                }
                
            };
            socket.onerror = (e) => console.log("socket errored:", e);
            socket.onclose = () => console.log("socket closed");
    
        } catch (error) {
            console.log(error);
        }

        form.current.addEventListener("submit", sendMsg);
    }, [])

    useEffect(() => {
        messageDiv.current.scrollTop = messageDiv.current.scrollHeight - messageDiv.current.offsetHeight
    }, [recievedMsgs.value.length])
    
    function sendMsg(e) {
        e.preventDefault();
        const msg = e.srcElement.clientMsg.value;
        e.srcElement.clientMsg.value = "";
        if (!msg) return;
        
        socket?.send(msg);
    }

    return (
        <div class="flex flex-col border-y-2 border-r-2 border-gray-200">
            <div ref={messageDiv} class="flex flex-col flex-grow text-sm overflow-y-scroll h-0">
                {(!recievedMsgs || !recievedMsgs.value.length) && <p class="text-gray-400">Connecting to chat...</p>}
                {recievedMsgs && recievedMsgs.value.map((msg: string) => <p>{msg}</p>)}
            </div>
            <form ref={form}>
                <input class="focus:outline-none bg-gray-200 p-1" type="text" name="clientMsg" autoComplete="off" />
            </form>
        </div>
    );
}
