import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import React, { useState, useEffect, useRef } from "react";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
import AttachmentOutlinedIcon from "@material-ui/icons/AttachmentOutlined";
import axios from "../../axios";
import "./Chat.css";

function Chat({ messages }) {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("/messages/new", {
      message: input,
      name: "Demo app",
      timestamp: "Just now!",
      received: true,
    });

    setInput("");
  };

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
        {messages.map((m) => (
          <p className={`chat__message ${m.received && "chat__receiver"}`}>
            <span className="chat__name">{m.name}</span>
            {m.message}
            <span className="chat__timestamp">{m.timestamp}</span>
          </p>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat__footer">
        <InsertEmoticonOutlinedIcon />
        <AttachmentOutlinedIcon id="attachmentOutlinedIcon" />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send a message</button>
        </form>
        <MicNoneOutlinedIcon />
      </div>
    </div>
  );
}

export default Chat;
