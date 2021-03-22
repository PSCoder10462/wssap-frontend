import { useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import LSForm from "./components/LSForm/LSForm";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./redux/userSlice";
import { dark, light, selectTheme } from "./redux/themeSlice";
import "./variables.css";
import Pusher from "pusher-js";
import { pusher_key } from "./keys";
import { activate } from "./redux/roomSlice";

function App() {
  const user = useSelector(selectUser),
    theme = useSelector(selectTheme),
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

    const userChannel = pusher.subscribe("user");
    userChannel.bind("updated", function (data) {
      if (data.user?._id === user?._id) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(login(data.user));
      }
    });

    const roomChannel = pusher.subscribe("room");
    roomChannel.bind("updated", (data) => {
      dispatch(activate(data.room));
    });

    // clean up
    return () => {
      userChannel.unbind_all();
      userChannel.unsubscribe();
      roomChannel.unbind_all();
      roomChannel.unsubscribe();
    };
  }, [dispatch, user?._id]);

  return (
    <div className={`app ${theme ? "dark" : "light"}`}>
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
