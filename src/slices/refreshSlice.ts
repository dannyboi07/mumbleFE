import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

const refreshSlice = createSlice({
    name: "refresh",
    initialState: null,
    reducers: {
        setRefreshTrue: () => {
            return true;
        },
        setRefreshHold: () => {
            return "hold";
        },
        setRefreshFalse: () => {
            return false;
        },
    },
});

const { setRefreshTrue, setRefreshHold, setRefreshFalse } =
    refreshSlice.actions;

const selectRefresh = (state: RootState) => {
    // Refresh slice is not included in the store
    // return state.refresh;
};

export {
    refreshSlice,
    setRefreshTrue,
    setRefreshHold,
    setRefreshFalse,
    selectRefresh,
};
export default refreshSlice.reducer;
