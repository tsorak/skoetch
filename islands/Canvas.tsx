/** @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
// import { tw } from "@twind";

// interface CanvasProps {
    
// }

interface Line {
    x: number,
    y: number,
    size: number,
    color: string,
}

export default function Canvas(props: any) {

    console.log(props);

    let cvs: any;

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);

    const [brushSize, setBrushSize] = useState(1);
    const [brushColor, setBrushColor] = useState("#00f");

    const lines: [Line] = [{x: 0, y: 0, size: 1, color: "#fff"}];

    const storeLine = (x: number, y: number) => {
        lines.push({ x, y, size: brushSize, color: brushColor});
        render(lines)
    }

    const render = (lines: [Line]) => {
        for (let i = 1; i < lines.length; i++) {
            console.log(cvs);
            
            cvs.beginPath();
            cvs.moveTo(lines[i - 1].x, lines[i - 1].y);
            cvs.lineWidth = lines[i].size;
            cvs.lineCap = 'round';
            cvs.strokeStyle = lines[i].color;
            cvs.lineTo(lines[i].x, lines[i].y);
            cvs.stroke();
        }
    }

    const island = {
        hasMounted: false,
    }

    useEffect(() => {
        if (!island.hasMounted) return;
        console.log("%cCanvas %cMounted", "color: #fff", "color: #0f0");

        const canvas = document.getElementById("cvs");
        if (!canvas) return;
        cvs = canvas.getContext("2d");
        function paint(event: PointerEvent) {
            console.log("painting", event);
            const bounds = canvas.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            storeLine(x, y);
        }
        canvas.onpointerdown = function(event) {
            // retarget all pointer events (until pointerup) to cvs
            canvas.setPointerCapture(event.pointerId);
            paint(event);
            
            // start tracking pointer moves
            canvas.onpointermove = function(event) {
                // Get pointer position and store coordinates
                paint(event);
            };
          
            // on pointer up finish tracking pointer moves
            canvas.onpointerup = function(event) {
                canvas.onpointermove = null;
                canvas.onpointerup = null;
                // ...also process the "drag end" if needed
                storeLine({})
            };
        };
    }, [island.hasMounted])
    island.hasMounted = true;

    return (
        <canvas id="cvs" width={width} height={height} />
    );
}
