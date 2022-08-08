import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
	name: "toast",
	initialState: null,
	reducers: {
		setToast: (_, action) => {
			return action.payload;
		},
		clearToast: () => {
			return null;
		},
	},
});

export const { setToast, clearToast } = toastSlice.actions;

export const selectToast = (state) => state.toast;

export default toastSlice.reducer;
