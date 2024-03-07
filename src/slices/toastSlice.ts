import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const initialState: ToastState | null = null;

export const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<ToastPayload>) => {
            const { payload: { type, title, message, contactDetails } } = action;


            state.toast = action.payload;
            // state?.type = type;
            // state?.title = title;
            // return {
            //     type,
            //     title,
            //     message,
            //     contactDetails
            // };
        },
        clearToast: () => {
            return null;
        },
    },
});

export const { setToast, clearToast } = toastSlice.actions;

export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
