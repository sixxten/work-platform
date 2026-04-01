import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(Context);

    const handleProfileClick = () => {
        if (auth.isAuth) {
            navigate('/profile');
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg sticky-top" style={{ 
                backgroundColor: "rgba(102, 126, 234, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
                <div className="container">
                    <span 
                        className="navbar-brand fw-bold text-white" 
                        onClick={() => navigate("/")} 
                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    >
                        Platform
                    </span>
                    
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                        style={{ borderColor: "rgba(255,255,255,0.5)" }}
                    >
                        <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center gap-3">
                            {auth.isAuth && (
                                <li className="nav-item">
                                    <button
                                        onClick={handleProfileClick}
                                        className="btn btn-outline-light px-4"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        Профиль
                                    </button>
                                </li>
                            )}
                            {auth.isAuth && auth.user?.role === "employer" && (
                                <li className="nav-item">
                                    <button
                                        onClick={() => navigate("/vacancies")}
                                        className="btn btn-success px-4"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        Мои вакансии
                                    </button>
                                </li>
                            )}
                            {auth.isAuth && (
                                <li className="nav-item">
                                    <button
                                        onClick={async () => {
                                            await auth.logout();
                                            navigate("/");
                                        }}
                                        className="btn btn-danger px-4"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        Выйти
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Основной контент */}
            <AuthForm />
        </>
    );
};

export default AuthPage;