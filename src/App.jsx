import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";
import { pusher_key } from "./keys";
import LSForm from "./components/LSForm/LSForm";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./redux/userSlice";

function App() {
  const [messages, setMessages] = useState([]),
    user = useSelector(selectUser),
    dispatch = useDispatch();

  useEffect(() => {
    if (window.localStorage?.user) {
      dispatch(login(JSON.parse(window.localStorage.user)));
      axios.get("/messages/sync").then((res) => {
        setMessages(res.data);
      });
      // axios
      //   .get("/rooms/getRoom", {
      //     headers: { Authorization: "Bearer " + window.localStorage.token },
      //   })
      //   .then(({data}) => {
      //     console.log(data);
      //     localStorage.setItem("user", )
      //     console.log("yo");
      //   });
    }
  }, [dispatch]);

  useEffect(() => {
    const pusher = new Pusher(pusher_key, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      // alert(JSON.stringify(data));
      setMessages([...messages, data]);
    });

    // clean up
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  // if (auth !== "" || !auth) {
  //   dispatch(login(JSON.parse(window.localStorage.user)));
  // }

  return (
    <div className="app">
      <div className="app__body">
        {!user ? (
          <LSForm />
        ) : (
          <>
            <Sidebar />
            <Chat messages={messages} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
