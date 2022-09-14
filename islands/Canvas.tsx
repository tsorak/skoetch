import { useState, useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import getType from "@/utils/getType.ts";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
// import { tw } from "@twind";

// interface CanvasProps {
    
// }

// interface Point {
//     x: number,
//     y: number,
//     size: number,
//     color: string,
// }

interface Line {
    1: {x: number, y: number} | undefined,
    2: {x: number, y: number} | undefined,
    size: number,
    color: string,
}

// const island = {
//     hasMounted: false,
// }

export default function Canvas(props: unknown) {

    // console.log(props);
    // const { sendLine, recievedLines } = props;
    const recievedLines = useSignal<Array<Line>>([]);

    const canvas = useRef<HTMLCanvasElement>(null);

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);

    const [brushSize, setBrushSize] = useState(1);
    const [brushColor, setBrushColor] = useState("#00f");

    // const lines: [Line] = [{x: 0, y: 0, size: 1, color: "#fff"}];
    // const linesStorage = [{}];

    let lastLine: Line = { 1: undefined, 2: undefined, size: brushSize, color: brushColor };
    function paint(event: PointerEvent) {
        // console.log("Type", event.type);
        const bounds = canvas.current.getBoundingClientRect();
        const x = Math.floor(event.clientX - bounds.left);
        const y = Math.floor(event.clientY - bounds.top);
        // console.log(`Type: ${event.type} %c${x} %c${y}`, "color: red", "color: blue");
        

        if (typeof lastLine[1] === "undefined") {
            lastLine[1] = { x, y };
        } else if (typeof lastLine[2] === "undefined") {
            lastLine[2] = { x, y };
            lastLine.size = brushSize;
            lastLine.color = brushColor;
            storeLine(lastLine);
            lastLine = { 1: { x, y }, 2: undefined, size: brushSize, color: brushColor };
        }

        if (event.type === "pointerup") {
            lastLine = { 1: undefined, 2: undefined, size: brushSize, color: brushColor };
        }
    }

    const storeLine = (line: Line | Record<never, never>) => {
        const data = { ...line };
        // linesStorage.push(line);
        // render(linesStorage)
        socket?.send(JSON.stringify(data));
    }

    const render = (data: Array<Line> | Line) => {
        // if (lines.length < 2) return console.log("Not enough points to render a line");
        const cvs = canvas.current.getContext("2d");
        
        switch (getType(data)) {
            case "array":
                data.forEach((line: Line) => {
                    cvs.beginPath();
                    cvs.moveTo(line[1].x, line[1].y);
                    cvs.lineWidth = line.size;
                    cvs.lineCap = 'round';
                    cvs.strokeStyle = line.color;
                    cvs.lineTo(line[2].x, line[2].y);
                    cvs.stroke();
                });
            break;

            case "object":
                cvs.beginPath();
                cvs.moveTo(data[1].x, data[1].y);
                cvs.lineWidth = data.size;
                cvs.lineCap = 'round';
                cvs.strokeStyle = data.color;
                cvs.lineTo(data[2].x, data[2].y);
                cvs.stroke();
            break;

            default:
                throw new Error("Invalid type to render");
        }
    }

    let socket: WebSocket | null;

    useEffect(() => {
        // if (!island.hasMounted) return;
        console.log("[%cMOUNTED%c] Canvas", "color: #0f0", "color: #fff");

        //socket
        try {
            socket = new WebSocket("ws://" + location.host + "/api/canvas/" + location.pathname.split("/")[2]);
            socket.onopen = () => console.log("socket opened");
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log(data);
                
                switch (data.type) {
                    case "initialCanvasObjects":
                        recievedLines.value = [...data.body];
                        break;
                    
                    case "canvasObject":
                        recievedLines.value = [...recievedLines.value, data.body];
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
        
        //pointer events
        canvas.current.onpointerdown = function(event) {
            paint(event);

            let wait = false;
            canvas.current.onpointermove = function(event) {
                if (wait) return;
                if (!wait) {
                    wait = true;
                    paint(event);

                    setTimeout(() => {
                        wait = false;
                    }, 50);
                }
            };

            canvas.current.onpointerup = function(event) {
                canvas.current.onpointermove = null;
                canvas.current.onpointerup = null;
                paint(event);
                // storeLine({})
            };
        };
    }, [])

    useEffect(() => {
        // console.log("recievedLines:", recievedLines);
        render(recievedLines.value);
    }, [recievedLines.value]);

    return (
        <div class="flex">
            <canvas ref={canvas} class="relative flex-none border-2 border-gray-200 place-self-center" width={width} height={height} />
        </div>
    );
}
