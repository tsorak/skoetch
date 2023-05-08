use std::net::SocketAddr;

use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};
use axum::{routing::get, Router, Server};
// use futures::stream::{SplitSink, SplitStream};

// use skoetch_websocket_server::ws_handler;

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    let app = Router::new().route("/", get(upgrade_handler));
    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn upgrade_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket))
}

async fn handle_socket(mut socket: WebSocket) {
    println!("new socket");
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            // client disconnected
            println!("client disconnected on handshake?");
            return;
        };

        println!("msg: {:?}", msg);

        if socket.send(msg).await.is_err() {
            println!("client disconnected");
            return;
        }
    }

    if socket.send("Hello, World!".into()).await.is_ok() {
        println!("clueless");
        return;
    };

    // tokio::spawn(write(sender));
    // tokio::spawn(read(receiver));
}

// async fn read(receiver: SplitStream<WebSocket>) {
//     // ...
// }

// async fn write(sender: SplitSink<WebSocket, Message>) {
//     // ...
// }
