// import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// export interface Usertype {

//     friendlist: [string],
//     friendRequestlist: [string],
//     isNewUser: boolean,
//     privateAccount: boolean,
//     _id: string,
//     userName: string,
//     email: string


// }
// export interface UserState {
//     user: Usertype | null,
//     ChatUser: Usertype | null,
//     users: Usertype[],
//     searchUsers: Usertype[]
// }
// const initialState: UserState = {
//     user: null,
//     ChatUser: null,
//     users: [],
//     searchUsers: []
// };

// const UserSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         setUser: (state, action: PayloadAction<UserState>) => {
//             state.user = action.payload.user;
//         },
//         clearUser: (state) => {
//             state.user = null
//         },
//         setChatUser: (state, action: PayloadAction<UserState>) => {
//             state.ChatUser = action.payload.user;
//         },
//         clearChatUser: (state) => {
//             state.ChatUser = null
//         },
//         setUsers: (state, action: PayloadAction<UserState>) => {
//             state.users = action.payload.users;
//         },
//         clearUsers: (state) => {
//             state.users = []
//         },
//         setsearchUsers: (state, action: PayloadAction<UserState>) => {
//             state.searchUsers = action.payload.searchUsers;
//         },
//         clearsearchUsers: (state) => {
//             state.searchUsers = []
//         },
//     },
// });

// export const { setChatUser, clearChatUser, setUser, clearUser, setUsers, clearUsers, setsearchUsers, clearsearchUsers } = UserSlice.actions;
// export default UserSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Usertype {
    uid: string; // Firebase UID
    email: string;
    userName?: string; // Can store displayName from Firebase
    profilePic?: string; // Firebase photoURL
    friendlist: string[];
    friendRequestlist: string[];
    isNewUser: boolean;
    privateAccount: boolean;
}

export interface UserState {
    user: Usertype | null;
    ChatUser: Usertype | null;
    users: Usertype[];
    searchUsers: Usertype[];
}

const initialState: UserState = {
    user: null,
    ChatUser: null,
    users: [],
    searchUsers: [],
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Usertype | null>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setChatUser: (state, action: PayloadAction<Usertype | null>) => {
            state.ChatUser = action.payload;
        },
        clearChatUser: (state) => {
            state.ChatUser = null;
        },
        setUsers: (state, action: PayloadAction<Usertype[]>) => {
            state.users = action.payload;
        },
        clearUsers: (state) => {
            state.users = [];
        },
        setSearchUsers: (state, action: PayloadAction<Usertype[]>) => {
            state.searchUsers = action.payload;
        },
        clearSearchUsers: (state) => {
            state.searchUsers = [];
        },
    },
});

export const {
    setUser,
    clearUser,
    setChatUser,
    clearChatUser,
    setUsers,
    clearUsers,
    setSearchUsers,
    clearSearchUsers,
} = UserSlice.actions;

export default UserSlice.reducer;
