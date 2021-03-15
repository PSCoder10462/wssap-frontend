import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChat.css";

function SidebarChat({ name }) {
  return (
    <div className="sidebarChat">
      <Avatar />
      <div className="sidebarChat__info">
        <h2>{name}</h2>
        <p>This is the last message</p>
      </div>
    </div>
  );
}

export default SidebarChat;
