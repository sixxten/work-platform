import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Context } from "../index";
import AuthPage from "../pages/AuthPage";
import UserProfilePage from "../pages/UserProfilePage";
import MyVacanciesPage from "../pages/MyVacanciesPage";
import VacancyPage from "../pages/VacancyPage";
import Main from "../pages/Main";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { auth } = useContext(Context);

   if (auth.isLoading) return null;


   const canViewEmployerVacancies = auth.isAuth && (auth.user?.role === 'employer' || auth.user?.role === 'admin');

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={!auth.isAuth ? <AuthPage /> : <Navigate to="/profile" />} />
      <Route path="/vacancies/:id" element={<VacancyPage />} />

      {auth.isAuth && (
        <>
          <Route path="/profile" element={<UserProfilePage />} />
           {canViewEmployerVacancies && (
            <Route path="/vacancies" element={<MyVacanciesPage />} />
          )}
        </>
      )}

      <Route path="*" element={<Navigate to={auth.isAuth ? "/profile" : "/"} replace />} />
    </Routes>
  );
});
export default AppRouter;
