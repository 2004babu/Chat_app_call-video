import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './Slices/UserSlice'
import ConversationSlice from './Slices/messageSlice'




const store = configureStore({
    reducer: {
        user: UserSlice,
        conversation: ConversationSlice,
    }
})


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store