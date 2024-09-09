import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, UserState } from "./types/userSlice";
import { RootState } from "../app/store";

function getUserFromLocalStorage(): User | null {
    const localStorageUser = (JSON.parse(
        localStorage.getItem("mumble-user") || "",
    ) || null) as User | null;

    if (
        !localStorageUser?.userId ||
        !localStorageUser?.name ||
        !localStorageUser?.email
    ) {
        return null;
    }

    return {
        ...localStorageUser,
    };
}

const initialState: UserState | null = getUserFromLocalStorage();

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (_, action: PayloadAction<User>) => {
            return {
                ...action.payload,
            };
        },
        clearUser: () => {
            return null;
        },
    },
});

const { setUser, clearUser } = userSlice.actions;

const selectUser = (state: RootState) => state.user;
const selectUserId = (state: RootState) => state.user?.userId || null;

export { userSlice, setUser, clearUser, selectUser, selectUserId };
export default userSlice.reducer;
