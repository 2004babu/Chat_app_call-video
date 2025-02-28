import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { RootState } from '../../Redux/Store'
import { useSelector } from 'react-redux'
import { DefaultEventsMap } from '@socket.io/component-emitter'

interface SocketType {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
    onlineUsers?: string[]
}

const contextSoc = createContext<SocketType | null>(null);

const SocketContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
    const [onlineUsers, setonlineUsers] = useState<string[]>([]);

    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?._id;

    useEffect(() => {
        if (!userId) return;

        const socketUrl = import.meta.env.VITE_WEPSOCKET_URL;

        const newSocket = io(socketUrl, {
            query: { userId },
            autoConnect: true,
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket']
        });

        setSocket(newSocket);


        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (socket) {
            socket?.on('onlineUsers', (data) => {
                setonlineUsers(data || [])
                // console.log(data)
            })
        }
    }, [socket])
    // console.log(onlineUsers);



    return (
        <contextSoc.Provider value={{ socket, onlineUsers }}>
            {children}
        </contextSoc.Provider>
    );
};

export default SocketContext;

export const useSocketContext = () => {
    return useContext(contextSoc);
};
