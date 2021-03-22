import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat/SidebarChat";
import { useDispatch, useSelector } from "react-redux";
import { logout, login, selectUser } from "../../redux/userSlice";
import { selectRoom } from "../../redux/roomSlice";
import { selectTheme } from "../../redux/themeSlice";
import axios from "../../axios.js";
import CreateIcon from "@material-ui/icons/Create";
// import cloudinary from "https://widget.cloudinary.com/v2.0/global/all.js";
import { CLOUDINARY_API_KEY } from "../../keys";

function Sidebar() {
  const user = useSelector(selectUser),
    room = useSelector(selectRoom),
    theme = useSelector(selectTheme),
    dispatch = useDispatch(),
    [rooms, setRooms] = useState([]),
    [srooms, setSrooms] = useState([]),
    [profile, setProfile] = useState(false),
    [sigTimestamp, setSigTimestamp] = useState(0);

  const getSignature = (callback, params_to_sign) => {
    axios
      .post(
        "/cloudinary/signature",
        { params_to_sign },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then(({ data }) => {
        callback(data.signature);
        setSigTimestamp(data.timestamp);
      })
      .catch((err) => console.log(err));
  };

  const compare = (a, b) => {
    let x = a?.lastMessage?.timestamp,
      y = b?.lastMessage?.timestamp;

    if (!x) x = 0;
    if (!y) y = 0;

    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    let objs = [...rooms];
    for (let i = 0; i < objs.length; i++) {
      if (objs[i]._id === room?._id) {
        objs[i].lastMessage = room?.lastMessage;
      }
    }
    objs.sort(compare);
    setRooms(objs);
    setSrooms(objs);

    return () => {
      setRooms([]);
      setSrooms([]);
    };
    // eslint-disable-next-line
  }, [room]);

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
        .then(({ data }) => {
          dispatch(login(data));
          window.localStorage.setItem("user", JSON.stringify(data));
          axios
            .get("/rooms/getRoom", {
              headers: { Authorization: "Bearer " + window.localStorage.token },
            })
            .then(({ data }) => {
              let objs = [...data];
              objs.sort(compare);
              setRooms(objs);
              setSrooms(objs);
            });
        })
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
        .then(({ data }) => {
          dispatch(login(data));
          window.localStorage.setItem("user", JSON.stringify(data));
          axios
            .get("/rooms/getRoom", {
              headers: { Authorization: "Bearer " + window.localStorage.token },
            })
            .then(({ data }) => {
              let objs = [...data];
              objs.sort(compare);
              setRooms(objs);
              setSrooms(objs);
            });
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    axios
      .get("/rooms/getRoom", {
        headers: { Authorization: "Bearer " + window.localStorage.token },
      })
      .then(({ data }) => {
        let objs = [...data];
        objs.sort(compare);
        setRooms(objs);
        setSrooms(objs);
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

  const myWidget = window.cloudinary?.createUploadWidget(
    {
      cloudName: "pscoder10462",
      uploadPreset: "whatsapp",
      public_id: user.email,
      api_key: CLOUDINARY_API_KEY,
      uploadSignatureTimestamp: sigTimestamp,
      uploadSignature: getSignature,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        axios
          .post(
            "/auth/addImage",
            { url: result?.info?.url },
            {
              headers: {
                Authorization: "Bearer " + window.localStorage.token,
              },
            }
          )
          .catch((err) => console.log(err));
      }
    }
  );

  const handleUserImage = () => {
    myWidget.open();
  };

  const changeUsername = () => {
    // const name = prompt("Enter new username:");
    // if (name) {
    //   axios
    //     .post(
    //       "/auth/changeName",
    //       { name },
    //       {
    //         headers: {
    //           Authorization: "Bearer " + window.localStorage.token,
    //         },
    //       }
    //     )
    //     .then(async ({ data }) => {
    //       console.log(data);
    //       await dispatch(changeName(name));
    //       localStorage.setItem("user", JSON.stringify(data));
    //     })
    //     .catch((err) => console.log(err));
    // }
    alert("This feature will be available soon!");
  };

  // components

  const sidebarHeader = (
    <>
      <Avatar onClick={() => setProfile(true)} src={user?.image} />
      <div
        className={`sidebar__headerRight ${
          theme && "sidebar__headerRightDark"
        }`}
      >
        <IconButton onClick={joinRoom}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={createRoom}>
          <ChatIcon />
        </IconButton>
        <IconButton title="Logout" onClick={handleLogout}>
          <MoreVertIcon />
        </IconButton>
      </div>
    </>
  );

  const profileHeader = (
    <div className="profileHeader">
      <IconButton onClick={() => setProfile(false)}>
        <KeyboardBackspaceIcon style={{ color: "white" }} />
      </IconButton>
      <h3>PROFILE</h3>
    </div>
  );

  const sidebarBody = (
    <>
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
            image={room.image}
          />
        ))}
      </div>
    </>
  );

  const profileBody = (
    <div className="profileBody">
      <div className="container">
        <Avatar onClick={() => setProfile(true)} src={user?.image} />
        <div className="overlay">
          <IconButton onClick={handleUserImage}>
            <CreateIcon className="overlay__edit" />
          </IconButton>
        </div>
      </div>

      <div className="username">
        <p>Your name</p>
        <div className="changeName">
          <p>{user?.name}</p>
          <IconButton onClick={changeUsername}>
            <CreateIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sidebar">
      <div
        className={`sidebar__header ${profile && "profileHeader__background"} ${
          theme && ""
        }`}
      >
        {profile ? profileHeader : sidebarHeader}
      </div>
      {profile ? profileBody : sidebarBody}
    </div>
  );
}

export default Sidebar;
