import { createSlice } from "@reduxjs/toolkit";

// dark -> true , light -> false

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: false,
  },
  reducers: {
    dark: (state) => {
      state.theme = true;
    },
    light: (state) => {
      state.theme = false;
    },
  },
});

export const { dark, light } = themeSlice.actions;

export const selectTheme = (state) => state.theme.theme;

export default themeSlice.reducer;
