import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    room: null,
  },
  reducers: {
    activate: (state, action) => {
      state.room = action.payload;
    },
  },
});

export const { activate } = roomSlice.actions;

export const selectRoom = (state) => state.room.room;

export default roomSlice.reducer;
