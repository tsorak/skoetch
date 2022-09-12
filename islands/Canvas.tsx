import { useState, useEffect, useRef } from "preact/hooks";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
// import { tw } from "@twind";

// interface CanvasProps {
    
// }

interface Point {
    x: number,
    y: number,
    size: number,
    color: string,
}

// const island = {
//     hasMounted: false,
// }

export default function Canvas(props: any) {

    // console.log(props);
    const { sendLine, recievedLines } = props;

    const canvas = useRef(null);

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);

    const [brushSize, setBrushSize] = useState(1);
    const [brushColor, setBrushColor] = useState("#00f");

    // const lines: [Line] = [{x: 0, y: 0, size: 1, color: "#fff"}];
    // const linesStorage = [{}];

    function paint(event: PointerEvent) {
        // console.log("painting", event);
        const bounds = canvas.current.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        storeLine({ x, y, size: brushSize, color: brushColor });
    }

    const storeLine = (point: Point | Record<never, never>) => {
        const data = { ...point };
        // linesStorage.push(line);
        // render(linesStorage)
        sendLine(data);
    }

    const render = (lines: [Point]) => {
        if (lines.length < 2) return console.log("Not enough points to render a line");
        const cvs = canvas.current.getContext("2d");
        for (let i = 1; i < lines.length; i++) {
            // console.log(cvs.current);
            
            cvs.beginPath();
            cvs.moveTo(lines[i - 1].x, lines[i - 1].y);
            cvs.lineWidth = lines[i].size;
            cvs.lineCap = 'round';
            cvs.strokeStyle = lines[i].color;
            cvs.lineTo(lines[i].x, lines[i].y);
            cvs.stroke();
        }
    }

    useEffect(() => {
        // if (!island.hasMounted) return;
        console.log("%cCanvas %cMounted", "color: #fff", "color: #0f0");

        // const canvas = document.getElementById("cvs");
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
                storeLine({})
            };
        };
    }, [])

    useEffect(() => {
        render(recievedLines);
    }, [recievedLines]);

    return (
        <canvas ref={canvas} width={width} height={height} />
    );
}
