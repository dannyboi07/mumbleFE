import { createSlice } from '@reduxjs/toolkit';

const userDetails = JSON.parse(localStorage.getItem("mumble-user"));

export const userSlice = createSlice({
    name: "user",
    initialState: userDetails,
    reducers: {
        
    }
})
