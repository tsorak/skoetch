/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
// import { SELF, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

// interface CanvasProps {
    
// }

export default function Canvas(props: any) {


    return (
        <div class={tw`flex border-1 border-gray-600`}>
            <canvas></canvas>
        </div>
    );
}
