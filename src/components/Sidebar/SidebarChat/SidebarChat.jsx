import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import axios from "../../../axios";
import { useDispatch } from "react-redux";
import { activate } from "../../../redux/roomSlice";

function SidebarChat({ name, id, lastMessage, image }) {
  const dispatch = useDispatch();
  const [ldate, setLdate] = useState("");

  useEffect(() => {
    if (lastMessage) {
      if (
        new Date(lastMessage?.timestamp).toLocaleDateString() ===
        new Date().toLocaleDateString()
      ) {
        setLdate("TODAY");
      } else {
        setLdate(new Date(lastMessage?.timestamp).toLocaleDateString());
      }
    }
  }, [lastMessage]);

  const activateRoom = (e) => {
    if (id) {
      document
        .querySelectorAll(".sidebarChat")
        .forEach((room) => room.classList.remove("activeRoom"));

      document.getElementById(id).classList.add("activeRoom");

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
    <div id={id} className="sidebarChat" onClick={activateRoom}>
      <Avatar src={image} />
      <div className="sidebarChat__info">
        <h2>
          {name} <span>{ldate}</span>
        </h2>
        {lastMessage ? (
          <p>
            {`${lastMessage.name}: `}
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
