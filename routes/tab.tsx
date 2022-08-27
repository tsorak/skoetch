/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Tab from "@/islands/Tab.tsx";
import { PageProps } from "$fresh/server.ts";
// import { roomExists, newRoom } from "@/communication/roomHandler.ts"

export default function Home({ data }: PageProps) {
  // const tabs = [
  //   tab1:true,
  //   {tab2: false},
  //   {tab3: false}
  // ]
  const tabs = new Map();
  tabs.set("tab1", true);
  tabs.set("tab2", false);
  tabs.set("tab3", false);

  const tabNames: string[] = [];
  Array.from(tabs.keys()).forEach(key => {
    tabNames.push(key);
    console.log(key, tabs.get(key));
  });

  return (
    <div class={tw`flex flex-col items-center h-screen`}>
      <form class={tw`flex justify-between w-[33vw]`}>
        {tabNames.map(tab => 
          <a class={tw`flex flex-col border-b-4 border-sky-600`} href={"tab/" + tab}>
            <input type="radio" name="page" id={tab} class={tw`hidden`} checked />
            {tab}
          </a>
        )}
      </form>
      <Tab data={tabs} />
    </div>
  );
}
