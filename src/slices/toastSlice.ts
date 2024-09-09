import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import type { ToastState, ToastPayload } from "./types/toastSlice";

const initialState: ToastState | null = null;

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        setToast: (_: ToastState, action: PayloadAction<ToastPayload>) => {
            const {
                payload: { type, title, message, contactDetails },
            } = action;

            return {
                type,
                title,
                message,
                contactDetails,
            };
        },
        clearToast: () => {
            return null;
        },
    },
});

const { setToast, clearToast } = toastSlice.actions;

const selectToast = (state: RootState) => state.toast;

export { toastSlice, setToast, clearToast, selectToast };
export default toastSlice.reducer;
