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
import { useSelector } from "react-redux";
import { selectRoom } from "../../redux/roomSlice";
import { selectUser } from "../../redux/userSlice";
import wssap from "../LSForm/wssap.png";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { CLOUDINARY_API_KEY } from "../../keys";

function Chat() {
  const messagesEndRef = useRef(null);
  const room = useSelector(selectRoom);
  const user = useSelector(selectUser);

  const [input, setInput] = useState(""),
    [emoji, setEmoji] = useState(false),
    [sigTimestamp, setSigTimestamp] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [room?.messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post(
      "/rooms/addMessage",
      {
        id: room?._id,
        message: {
          message: input,
          name: user?.name,
          timestamp: Date.now(),
          userid: user._id,
        },
      },
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

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = room?._id;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "successful" : "unsuccessful";
      alert("copy: " + msg);
    } catch (err) {
      console.log("Oops, unable to copy");
    }
    document.body.removeChild(textArea);
  };

  const myWidget = window.cloudinary?.createUploadWidget(
    {
      cloudName: "pscoder10462",
      uploadPreset: "whatsapp",
      public_id: room?._id,
      api_key: CLOUDINARY_API_KEY,
      uploadSignatureTimestamp: sigTimestamp,
      uploadSignature: getSignature,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        axios
          .post(
            "/rooms/addImage",
            { id: room?._id, url: result?.info?.url },
            {
              headers: {
                Authorization: "Bearer " + window.localStorage.token,
              },
            }
          )
          .then((data) => {
            // data
          })
          .catch((err) => console.log(err));
      }
    }
  );

  const handleRoomImage = () => {
    myWidget.open();
  };

  const selectedRoom = (
    <>
      <div className="chat__header">
        <Avatar
          src={room?.image}
          onClick={handleRoomImage}
          className="avatar"
        />
        <div className="chat__headerInfo">
          <h3>{room?.name}</h3>
        </div>
        <div className="chat__headerRight">
          <IconButton onClick={copyToClipboard}>
            <FileCopyIcon />
          </IconButton>
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
        {room?.messages?.map((m, index) => (
          <React.Fragment key={index}>
            {new Date(
              room?.messages[index - 1]?.timestamp
            ).toLocaleDateString() !==
              new Date(m?.timestamp).toLocaleDateString() && (
              <span className="chat__centerTimestamp">
                {new Date(m?.timestamp).toLocaleDateString() ===
                new Date().toLocaleDateString()
                  ? "TODAY"
                  : new Date(m?.timestamp).toLocaleDateString()}
              </span>
            )}
            <p
              className={`chat__message ${
                m.userid === user?._id && "chat__sender"
              }`}
            >
              <span className="chat__name">{m?.name}</span>
              {m.message}
              <span className="chat__timestamp">
                {new Date(m.timestamp).toLocaleTimeString()}
              </span>
            </p>
          </React.Fragment>
        ))}

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
    </>
  );

  const noRoomSelected = (
    <div className="chat__noRoomSelected">
      <img src={wssap} alt="whatsapp" className="whatsapp__image" />
      <h1>Whatsapp</h1>
      <h4>Select a room / create one</h4>
    </div>
  );

  return <div className="chat">{room ? selectedRoom : noRoomSelected}</div>;
}

export default Chat;
