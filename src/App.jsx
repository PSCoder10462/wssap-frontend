import { useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import LSForm from "./components/LSForm/LSForm";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./redux/userSlice";
import { dark, light } from "./redux/themeSlice";
// import axios from "./axios";
import Pusher from "pusher-js";
import { pusher_key } from "./keys";

function App() {
  const user = useSelector(selectUser),
    dispatch = useDispatch();

  useEffect(() => {
    // login for user
    if (window.localStorage?.user) {
      dispatch(login(JSON.parse(window.localStorage.user)));
    }

    // default theme for user
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // dark mode
      dispatch(dark());
    } else {
      dispatch(light());
    }
  }, [dispatch]);

  useEffect(() => {
    const pusher = new Pusher(pusher_key, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("user");
    channel.bind("updated", function (data) {
      console.log(data.user);
      if (data.user?._id === user?._id) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(login(data.user));
      }
    });

    // clean up
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

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
