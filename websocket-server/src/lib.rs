mod msg;

use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};
// use tokio::sync::broadcast::channel;

pub use msg::{Message, MessageData};

// struct State {}

pub async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(_: WebSocket) {
    todo!();
}
