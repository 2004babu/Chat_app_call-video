import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import Login from '../Auth/Login';

const IsAuthUser: React.FC<{ children: ReactNode }> = ({ children }) => {



    const { user } = useSelector((state: RootState) => state.user)


    
    if (!user?.uid) {
        return <Login />
    }
    return children

}

export default IsAuthUser
