import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: string;
}

const initialState: UserState = {
    user: '',
};

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = '';
        },
    },
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
