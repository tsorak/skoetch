use std::time::SystemTime;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    pub room: String,
    pub username: String,
    pub timestamp: u64,
    pub data: MessageData,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MessageData {
    Join,
    Leave,
    Message(String),
    // Paint(???),
}

impl TryFrom<&str> for Message {
    type Error = serde_json::Error;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        serde_json::from_str(s)
    }
}

impl TryFrom<&Message> for String {
    type Error = serde_json::Error;

    fn try_from(message: &Message) -> Result<Self, Self::Error> {
        serde_json::to_string(message)
    }
}

impl Message {
    pub fn new(room: String, username: String, data: MessageData) -> Self {
        Message {
            room,
            username,
            timestamp: SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            data,
        }
    }

    pub fn join(room: &str, username: &str) -> Self {
        Message::new(room.into(), username.into(), MessageData::Join)
    }

    pub fn leave(room: &str, username: &str) -> Self {
        Message::new(room.into(), username.into(), MessageData::Leave)
    }

    pub fn message(room: &str, username: &str, message: &str) -> Self {
        Message::new(
            room.into(),
            username.into(),
            MessageData::Message(message.into()),
        )
    }
}
