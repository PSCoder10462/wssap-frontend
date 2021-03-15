import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat/SidebarChat";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import axios from "../../axios.js";

function Sidebar() {
  const dispatch = useDispatch(),
    [rooms, setRooms] = useState([]),
    [srooms, setSrooms] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const createRoom = () => {
    const roomName = prompt("Enter Room Name:");
    if (roomName) {
      axios
        .post(
          "/rooms/createRoom",
          { roomName },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.token,
            },
          }
        )
        .catch((err) => console.log(err));
    }
  };

  const joinRoom = () => {
    const id = prompt("Enter Room ID:");
    if (id) {
      axios
        .post(
          "/rooms/joinRoom",
          { id },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.token,
            },
          }
        )
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    axios
      .get("/rooms/getRoom", {
        headers: { Authorization: "Bearer " + window.localStorage.token },
      })
      .then(({ data }) => {
        setRooms(data);
        setSrooms(data);
      });
  }, []);

  const searchRoom = (e) => {
    if (e.target.value) {
      const temp = srooms?.filter((t) =>
        t.name.toUpperCase().includes(e.target.value.toUpperCase())
      );
      setRooms(temp);
    } else {
      setRooms(srooms);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar title="Logout" onClick={handleLogout} />
        <div className="sidebar__headerRight">
          <IconButton onClick={joinRoom}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={createRoom}>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search or start new chat"
            onChange={searchRoom}
          />
        </div>
      </div>

      <div className="sidebar__chats">
        {rooms?.map((room, index) => (
          <SidebarChat
            name={room.name}
            key={index}
            id={room._id}
            lastMessage={room.lastMessage}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
