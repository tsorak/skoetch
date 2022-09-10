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

    console.log(props);
    const { sendLine, recievedLines } = props;

    const cvs = useRef(null);

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);

    const [brushSize, setBrushSize] = useState(1);
    const [brushColor, setBrushColor] = useState("#00f");

    // const lines: [Line] = [{x: 0, y: 0, size: 1, color: "#fff"}];
    // const linesStorage = [{}];

    const storeLine = (point: Point | Record<never, never>) => {
        const data = { ...point };
        // linesStorage.push(line);
        // render(linesStorage)
        sendLine(data);
    }

    const render = (lines: [Point]) => {
        if (lines.length < 2) return console.log("Not enough points to render a line");
        for (let i = 1; i < lines.length; i++) {
            // console.log(cvs.current);
            
            cvs.current.beginPath();
            cvs.current.moveTo(lines[i - 1].x, lines[i - 1].y);
            cvs.current.lineWidth = lines[i].size;
            cvs.current.lineCap = 'round';
            cvs.current.strokeStyle = lines[i].color;
            cvs.current.lineTo(lines[i].x, lines[i].y);
            cvs.current.stroke();
        }
    }

    useEffect(() => {
        // if (!island.hasMounted) return;
        console.log("%cCanvas %cMounted", "color: #fff", "color: #0f0");

        const canvas = document.getElementById("cvs");
        if (!canvas) return;
        cvs.current = canvas.getContext("2d");
        function paint(event: PointerEvent) {
            console.log("painting", event);
            const bounds = canvas.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            storeLine({ x, y, size: brushSize, color: brushColor });
        }
        canvas.onpointerdown = function(event) {
            // retarget all pointer events (until pointerup) to cvs
            // canvas.setPointerCapture(event.pointerId);
            paint(event);
            
            // start tracking pointer moves
            // let wait = false;
            // if (!wait) {
            //     wait = true;
            //     canvas.onpointermove = function(event) {
            //         // Get pointer position and store coordinates
            //         paint(event);
            //     };

            //     setTimeout(() => {
            //         wait = false;
            //         canvas.onpointermove = null;
            //     }, 100);
            // }
            let wait = false;
            canvas.onpointermove = function(event) {
                if (wait) return;
                // Get pointer position and store coordinates

                if (!wait) {
                    wait = true;
                    paint(event);

                    setTimeout(() => {
                        wait = false;
                    }, 50);
                }
            };

            // on pointer up finish tracking pointer moves
            canvas.onpointerup = function(event) {
                canvas.onpointermove = null;
                canvas.onpointerup = null;
                // ...also process the "drag end" if needed
                storeLine({})
            };
        };
    }, [])
    // island.hasMounted = true;

    useEffect(() => {
        render(recievedLines);
    }, [recievedLines]);

    return (
        <canvas id="cvs" width={width} height={height} />
    );
}
