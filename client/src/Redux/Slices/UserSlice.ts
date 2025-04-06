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

export interface UnreadedMSGType {

    Re_user: string
    message: string
    Re_time?: string
    count?: number
    seened?: boolean

}

export interface Usertype {
    uid: string; // Firebase UID
    email: string;
    userName?: string; // Can store displayName from Firebase
    profilePic?: string; // Firebase photoURL
    friendlist: string[];
    friendRequestlist: string[];
    isNewUser: boolean;
    privateAccount: boolean;
    lastChat?: [
        {
            userId: String,
            time: Date,
        },
    ],
    UnReadedMsg: UnreadedMSGType[]
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
        setUnReadedMsg: (state, action: PayloadAction<UnreadedMSGType>) => {

            // if (state.UnreadedMSG.some(ite => ite.Re_user === action.payload.Re_user)) {

            const countExist = state?.user?.UnReadedMsg?.find(item => item.Re_user === action.payload.Re_user)
            let incressedCount: UnreadedMSGType = {
                count: countExist?.count ? countExist.count + 1 : 1,
                message: action.payload.message,
                Re_time: Date.now().toString(),
                Re_user: action.payload.Re_user,
                seened: false
            }
            if (state.user && state.user.UnReadedMsg) {
                state.user.UnReadedMsg = [incressedCount, ...state.user?.UnReadedMsg.filter(item => item.Re_user !== action.payload.Re_user)]
            }
            // }
            // state.UnreadedMSG.msg = action.payload.UnreadedMSG.msg
            // state.UnreadedMSG.Re_time = Date.now().toString()
            // state.UnreadedMSG.count = state.UnreadedMSG.count + 1

        },
        setSeenUnReadedMsg: (state, action: PayloadAction<{ Re_user: string }>) => {

            // if (state.UnreadedMSG.some(ite => ite.Re_user === action.payload.Re_user)) {

            let countExist = state?.user?.UnReadedMsg?.find(item => item.Re_user === action.payload.Re_user)
            // let incressedCount: UnreadedMSGType = {
            //     count: countExist?.count ? countExist.count + 1 : 1,
            //     message: countExist?.message ?? '',
            //     Re_time: Date.now().toString(),
            //     Re_user: action.payload.Re_user,
            //     seened: true
            // }
            
            if (countExist?.seened===false) {

                countExist.seened = true
                countExist.count = 0
            }
            
            if (state.user && state.user.UnReadedMsg && countExist?.Re_user) {
                state.user.UnReadedMsg = [countExist, ...state.user?.UnReadedMsg.filter(item => item.Re_user !== action.payload.Re_user)]
            }
            // }
            // state.UnreadedMSG.msg = action.payload.UnreadedMSG.msg
            // state.UnreadedMSG.Re_time = Date.now().toString()
            // state.UnreadedMSG.count = state.UnreadedMSG.count + 1

        },
        clearUnreadMSg: (state, action: PayloadAction<string>) => {
            if (state.user && state.user.UnReadedMsg) {
                state.user.UnReadedMsg = state.user.UnReadedMsg.filter(ite => ite.Re_user !== action.payload)
            }
        }
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
    setUnReadedMsg, clearUnreadMSg, setSeenUnReadedMsg
} = UserSlice.actions;

export default UserSlice.reducer;
