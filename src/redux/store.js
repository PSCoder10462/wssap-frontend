import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import roomReducer from "./roomSlice";
import themeReducer from "./themeSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    theme: themeReducer,
  },
});
