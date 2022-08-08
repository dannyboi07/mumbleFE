import { createSlice } from "@reduxjs/toolkit";
import { theme } from "../features/utils";

export const themeSlice = createSlice({
	name: "theme",
	initialState: theme,
	reducers: {
		setTheme: (_, action) => {
			return action.payload;
		},
	},
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme;

export default themeSlice.reducer;
