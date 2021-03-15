import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChat.css";
import axios from "../../../axios";
import { useDispatch } from "react-redux";
import { activate } from "../../../redux/roomSlice";

function SidebarChat({ name, id, lastMessage }) {
  const dispatch = useDispatch();
  const activateRoom = () => {
    if (id) {
      axios
        .get("/rooms/activateRoom", {
          headers: {
            Authorization: "Bearer " + window.localStorage.token,
            id,
          },
        })
        .then(({ data }) => {
          dispatch(activate(data));
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="sidebarChat" onClick={activateRoom}>
      <Avatar />
      <div className="sidebarChat__info">
        {/* <p className="time">{lastMessage?.timestamp}</p> */}
        <h2>
          {name} <span>{lastMessage?.timestamp}</span>
        </h2>
        {lastMessage ? (
          <p>
            {lastMessage.name}:
            <span>
              {lastMessage?.message.length > 25
                ? lastMessage?.message.substring(0, 25) + "..."
                : lastMessage?.message}
            </span>
          </p>
        ) : (
          <p>No Message Yet</p>
        )}
      </div>
    </div>
  );
}

export default SidebarChat;
