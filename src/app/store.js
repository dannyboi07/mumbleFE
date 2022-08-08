import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import contactsReducer from "../slices/contactsSlice";
import chatReducer from "../slices/chatSlice";
import toastReducer from "../slices/toastSlice";
import themeReducer from "../slices/themeSlice";

export const store = configureStore({
	reducer: {
		toast: toastReducer,
		user: userReducer,
		contacts: contactsReducer,
		chats: chatReducer,
		theme: themeReducer,
	},
});
