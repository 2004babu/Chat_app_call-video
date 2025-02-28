import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Usertype {

    friendlist: [string],
    friendRequestlist: [string],
    isNewUser: boolean,
    privateAccount: boolean,
    _id: string,
    userName: string,
    email: string


}
export interface UserState {
    user: Usertype | null,
    ChatUser: Usertype | null,
    users: Usertype[],
    searchUsers: Usertype[]
}
const initialState: UserState = {
    user: null,
    ChatUser: null,
    users: [],
    searchUsers: []
};

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.user = action.payload.user;
        },
        clearUser: (state) => {
            state.user = null
        },
        setChatUser: (state, action: PayloadAction<UserState>) => {
            state.ChatUser = action.payload.user;
        },
        clearChatUser: (state) => {
            state.ChatUser = null
        },
        setUsers: (state, action: PayloadAction<UserState>) => {
            state.users = action.payload.users;
        },
        clearUsers: (state) => {
            state.users = []
        },
        setsearchUsers: (state, action: PayloadAction<UserState>) => {
            state.searchUsers = action.payload.searchUsers;
        },
        clearsearchUsers: (state) => {
            state.searchUsers = []
        },
    },
});

export const { setChatUser, clearChatUser, setUser, clearUser, setUsers, clearUsers, setsearchUsers, clearsearchUsers } = UserSlice.actions;
export default UserSlice.reducer;
