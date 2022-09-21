import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
    return (
        <div class="flex flex-col h-screen w-screen justify-center items-center bg-[#111] text-lime-500">
            <p class="text-9xl">404</p>
            <p>Invalid path</p>
            {url.pathname}
        </div>
    );
}