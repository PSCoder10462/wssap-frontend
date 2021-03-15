import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import roomReducer from "./roomSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
});
