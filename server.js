import { serve } from "https://deno.land/std/http/mod.ts";

const lines = [], activeSockets = new Map();

const pushLine = (line) => {
    lines.push(line);
    pushNewLineToAllSockets(JSON.stringify(line));
}
const getLines = () => {
    return lines;
}
const pushNewLineToAllSockets = (line) => {
    activeSockets.forEach(socket => {
        if (socket.readyState !== 1) return;
        socket.send(line);
    })
}

function logError(msg) {
    console.log(msg);
    Deno.exit(1);
}
function handleConnected(socket) {
    console.log("Connected to client ...");
    socket.id = crypto.randomUUID();
    activeSockets.set(socket.id, socket);
    socket.send(JSON.stringify(getLines()));
}

function handleDisconnect(socket) {
    console.log("Disconnected from client ...");
    activeSockets.delete(socket.id);
}

function handleMessage(ws, data) {
    const parsedData = JSON.parse(data);
    if (typeof parsedData === "object") {
        pushLine(parsedData);
    }
    console.log("CLIENT >>", parsedData, lines.length);
    // const reply = "No reply";
    // if (reply === "exit") {
    //     return ws.close();
    // }
    // ws.send(reply);
}
function handleError(e) {
    console.log(e instanceof ErrorEvent ? e.message : e.type);
}
async function reqHandler(req) {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket: ws, response } = Deno.upgradeWebSocket(req);
    ws.onopen = () => handleConnected(ws);
    ws.onmessage = (m) => handleMessage(ws, m.data);
    ws.onclose = () => handleDisconnect(ws);
    ws.onerror = (e) => handleError(e);
    return response;
}
console.log("Waiting for client ...");
serve(reqHandler, { port: 8080 });

// import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

// const lines = [];
// const wss = new WebSocketServer(8080);
// wss.on("connection", (ws) => {
//     // console.log("New connection:", ws._events);
//     // redraw();
//     ws.send("Pong!");
//     setTimeout(() => {
//         ws.send("LeTroll");
//     }, 1000);

//     setTimeout(() => {
//         ws.send("Hohoho");
//     }, 2000);

//     ws.on("message", (message) => {
//         ws.send("reee");
//         console.log("Recieved:", message);
//         lines = JSON.parse(message);
//         console.log(lines);
//     });
// });

// function redraw() {
//     console.clear()
//     console.log(wss.clients);
// }

// import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// const router = new Router();

// router
//     .post("/", async (ctx) => {
//         const payload = await ctx.request.body().value;
//         console.log(payload);

//         ctx.response.type = "json";
//         ctx.response.body = { message: "Recieved data" }
//     })

// const app = new Application();

// app.use(async (ctx, next) => {
//     //LOG
//     console.log("NEW", ctx.request.method, "FROM", ctx.request.ip, "TO", ctx.request.url.pathname);
//     // console.log(ctx.request);

//     //CORS
//     ctx.response.headers.set("Access-Control-Allow-Origin", ctx.request.headers.get("origin"));
//     ctx.response.headers.set("Access-Control-Allow-Credentials", true);
//     ctx.response.headers.set("Access-Control-Allow-Headers", ['content-type', '*']);

//     if (ctx.request.method === "OPTIONS") {
//         ctx.response.status = 200;
//         return;
//     }

//     await next();
// });

// app.use(router.routes());

// await app.listen({ port: 8080 });