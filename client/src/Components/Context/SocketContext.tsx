import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { RootState } from '../../Redux/Store'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { setUsers } from '../../Redux/Slices/UserSlice'

interface SocketType {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
    onlineUsers?: string[]
}

const contextSoc = createContext<SocketType | null>(null);

const SocketContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
    const [onlineUsers, setonlineUsers] = useState<string[]>([]);

    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?.uid;
    // console.log(userId);

    const dispatch = useDispatch()
    const { users } = useSelector((state: RootState) => state.user)




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


        // return () => {
        //     newSocket.disconnect();
        // };
    }, [userId]);

    useEffect(() => {
        if (socket) {
            socket?.on('onlineUsers', (data) => {
                setonlineUsers(data || [])
                // console.log(data)
            })
        }
        socket?.on('recieveMSG', (data) => {




            const ShowNOtification = async (message: string) => {
                if (!("Notification" in window)) {
                    console.error("This browser does not support desktop notifications.");
                    return;
                }

                if (Notification.permission === 'granted') {
                    new Notification("New Message", {
                        body: message,
                        icon: "./unknown.png", // Make sure this image exists
                        tag: "new-msg", // Prevent duplicate notifications
                        // renotify: true, // Replaces old notifications with the same tag
                        silent: false, // Play default sound if applicable
                        // vibrate: [200, 100, 200], // Useful for mobile devices
                        data: { extraInfo: "babu data" }, // Extra data can be accessed later
                        requireInteraction: true, // Keeps the notification visible until user interacts
                    });
                } else if (Notification.permission !== "denied") {
                    // Ask for permission if not yet granted or denied
                    Notification.requestPermission().then((permission) => {
                        if (permission === "granted") {
                            ShowNOtification(message);
                        }
                    });
                }

            }

            ShowNOtification(data.msg)

            let filteredUsers = [];
            if (data.senderId) {

                filteredUsers = users.filter(Item => Item.uid.toString() !== data.senderId.toString())
                let findedUser = users.filter(Item => Item.uid.toString() === data.senderId.toString())
                // console.log(findedUser, filteredUsers);

                dispatch(setUsers([...findedUser, ...filteredUsers]))
            }
        })


    }, [socket, users])
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
