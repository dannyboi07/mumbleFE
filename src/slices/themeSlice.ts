import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getThemeFromCache } from "../features/utils";
import type { RootState } from "../app/store";

const initialState: ThemeState = getThemeFromCache();

const themeSlice = createSlice({
    name: "theme",
    initialState: initialState,
    reducers: {
        setTheme: (_, action: PayloadAction<Theme | CustomTheme>) => {
            return action.payload;
        },
    },
});

const { setTheme } = themeSlice.actions;
const selectTheme = (state: RootState) => state.theme;

export { themeSlice, setTheme, selectTheme };
export default themeSlice.reducer;
