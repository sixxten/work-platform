import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";

const Navbar = ({ unreadCount, unreadMessagesCount, showNotifications, setShowNotifications, showChats, setShowChats }) => {
  const navigate = useNavigate();
  const { auth } = useContext(Context);

  const handleProfileClick = () => {
    if (!auth.isAuth) navigate("/login");
    else navigate("/profile");
  };

  return (
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
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <button
                onClick={handleProfileClick}
                className="btn btn-outline-light px-3"
                style={{ borderRadius: "20px" }}
              >
                {auth.isAuth ? "Профиль" : "Авторизоваться"}
              </button>
            </li>

            {auth.isAuth && auth.user?.role === "employer" && (
              <li className="nav-item">
                <button
                  onClick={() => navigate("/vacancies")}
                  className="btn btn-outline-light px-4"
                  style={{ borderRadius: "20px" }}
                >
                  Мои вакансии
                </button>
              </li>
            )}
            
            {auth.isAuth && (
              <li className="nav-item">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="btn btn-outline-light position-relative px-3"
                  style={{ borderRadius: "20px" }}
                >
                  Уведомления
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px", padding: "4px 6px" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            )}

            {auth.isAuth && auth.user?.role === "student" && (
              <li className="nav-item position-relative">
                <button
                  onClick={() => setShowChats(true)}
                  className="btn btn-outline-light position-relative px-3"
                  style={{ borderRadius: "20px" }}
                >
                  Чаты
                  {unreadMessagesCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;