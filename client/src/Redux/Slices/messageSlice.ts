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
export interface UnreadedMSGType {

    Re_user: string
    message: string
    Re_time?: string
    count?: number
    seened?: boolean

}

export interface initialType {
    conversation: {
        _id: string,
        participants: string[],
        messages: messageType[]
    }, UnreadedMSG: UnreadedMSGType[]
}

const initialState: initialType = {
    conversation: {
        _id: '',
        messages: [],
        participants: []
    },
    UnreadedMSG: []
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