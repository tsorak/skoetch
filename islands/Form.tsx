/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";

export default function Form(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [infoMsg, setInfoMsg] = useState("");

    function formAlert(msg: string, type: string) {
        setErrorMsg("");
        setInfoMsg("");
        
        switch (type) {
            case "ERROR": {
                setErrorMsg(msg);
                break;
            }
            case "INFO": {
                setInfoMsg(msg);
                break;
            }
            default: {
                break;
            }
        }

        return;
    }

    async function fetchRoom(roomID: string) {
        console.log("body:", roomID);
        
        const response = fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({roomID}),
        })

        await response;
        console.log(response);

        return;
    }

    function validate(e: any) {
        e.preventDefault();
        
        try {
            const formID = props.id;
            if (!formID) throw new Error("Form not found. Reload the page."); 

            console.log("Target form:", formID);
            const form = document.getElementById(formID);

            const requestedRoomCode = form.roomCode.value;
            if (requestedRoomCode === "") throw new Error("No room code was provided");
            if (requestedRoomCode.length < 6 || requestedRoomCode.length > 24) throw new Error("Room code must be between 6-24 characters");
            console.log(requestedRoomCode);
            
            formAlert("Joining room", "INFO");
            
            fetchRoom(requestedRoomCode);

        } catch (error) {
            // console.log(error);
            formAlert(error.message, "ERROR");
        }
    }

    
    return (
        <form class={tw`flex flex-col w-full gap-1`} onSubmit={validate} id={props.id}>
            <input class={tw`p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-sky-500`} type="text" name="roomCode" placeholder="Room Code" autoComplete="off" autofocus={true} />
            <div>
                <p class={tw`pl-1 text-red-500 text-sm font-semibold`}>{errorMsg}</p>
                <p class={tw`pl-1 text-lime-500 text-sm font-semibold`}>{infoMsg}</p>
            </div>
        </form>
    );
}
