import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import React, { useState, useEffect, useRef } from "react";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
import AttachmentOutlinedIcon from "@material-ui/icons/AttachmentOutlined";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import axios from "../../axios";
import "./Chat.css";

function Chat({ messages }) {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState(""),
    [emoji, setEmoji] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post(
      "/messages/new",
      {
        message: input,
        name: "Demo app",
        timestamp: new Date().toLocaleDateString(),
        received: true,
      },

      // User: {name, email, pass, rooms: , string: dp}
      // Room: {name, messages: [], string: dp}
      // Messages...
      {
        headers: {
          Authorization: "Bearer " + window.localStorage.token,
        },
      }
    );

    setInput("");
  };

  const addEmoji = (e) => {
    setInput(input + e.native);
  };
  const emojiPicker = (
    <ClickAwayListener onClickAway={() => setEmoji(false)}>
      <Picker
        autoFocus={true}
        theme="auto"
        title="Pick your emoji…"
        emoji="point_up"
        set="apple"
        onSelect={addEmoji}
        style={{ position: "absolute", bottom: 65, left: 5 }}
      />
    </ClickAwayListener>
  );

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at ...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((m) => {
          return (
            <p
              key={m._id}
              className={`chat__message ${
                m.user?._id === window.localStorage.user?._id &&
                "chat__receiver"
              }`}
            >
              <span className="chat__name">{m.user?.name}</span>
              {m.message}
              <span className="chat__timestamp">{m.timestamp}</span>
            </p>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      {emoji && emojiPicker}
      <div className="chat__footer">
        <IconButton onClick={() => setEmoji(!emoji)}>
          <InsertEmoticonOutlinedIcon />
        </IconButton>
        <AttachmentOutlinedIcon id="attachmentOutlinedIcon" />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit">Send a message</button>
        </form>
        <MicNoneOutlinedIcon />
      </div>
    </div>
  );
}

export default Chat;
