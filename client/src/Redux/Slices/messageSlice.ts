import { createSlice, PayloadAction } from "@reduxjs/toolkit";




export interface messageType {
    senderId: string,
    receiverId: string,
    message: string,
    reply?: string,
    _id?: string,


}
export interface ConversationType {
    conversation: {
        _id: string,
        participants: string[],
        messages: messageType[]
    }
}


const initialState: ConversationType = {
    conversation: {
        _id: '',
        messages: [],
        participants: []
    }
}





const messageSlice = createSlice({
    name: 'msg', initialState,
    reducers: {
        setConversation: (state, action: PayloadAction<ConversationType>) => {
            state.conversation = action.payload.conversation
        },
        setSigleMessage: (state, action: PayloadAction<ConversationType>) => {
            state.conversation.messages = action.payload.conversation.messages
        },
        clearConversation: (state) => {
            state.conversation = {
                _id: '',
                messages: [],
                participants: []
            };
        }

    }
})


export const { clearConversation, setConversation, setSigleMessage } = messageSlice.actions
export default messageSlice.reducer