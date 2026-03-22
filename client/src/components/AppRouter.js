import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Context } from '../index';
import AuthPage from '../pages/AuthPage';
import UserProfilePage from '../pages/UserProfilePage';
import {observer} from "mobx-react-lite";

const AppRouter = () => {
    const { auth } = useContext(Context);

    return (
        <Routes>
            {auth.isAuth ? (
                <Route path="/profile" element={<UserProfilePage />} />
            ) : (
                <Route path="/login" element={<AuthPage />} />
            )}
            <Route path="*" element={<Navigate to={auth.isAuth ? "/profile" : "/login"} />} />
        </Routes>
    );
};

export default observer(AppRouter);