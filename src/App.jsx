import { useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import LSForm from "./components/LSForm/LSForm";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./redux/userSlice";
// import axios from "./axios";
// import Pusher from "pusher-js";
// import { pusher_key } from "./keys";

function App() {
  const user = useSelector(selectUser),
    dispatch = useDispatch();

  useEffect(() => {
    if (window.localStorage?.user) {
      dispatch(login(JSON.parse(window.localStorage.user)));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   const pusher = new Pusher(pusher_key, {
  //     cluster: "eu",
  //   });

  //   const channel = pusher.subscribe("messages");
  //   channel.bind("inserted", function (data) {
  //     // alert(JSON.stringify(data));
  //     setMessages([...messages, data]);
  //   });

  //   // clean up
  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, [messages]);

  return (
    <div className="app">
      <div className="app__body">
        {!user ? (
          <LSForm />
        ) : (
          <>
            <Sidebar />
            <Chat />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
