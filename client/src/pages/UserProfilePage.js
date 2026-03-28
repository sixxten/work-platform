import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

const UserProfilePage = observer(() => {
    
    const { auth } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.logout();
        navigate('/login');
    }
    const getRoleText = (role) => {
        switch(role) {
            case 'student':
                return 'Студент';
            case 'employer':
                return 'Работодатель';
            default:
                return 'error';
        }
    
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>Вы авторизованы</h1>
            
            {auth.user ? (
                <div style={{ marginBottom: '20px' }}>
                    <p><strong>Email:</strong> {auth.user.email}</p>
                    <p><strong>Роль:</strong> {getRoleText(auth.user.role)}</p>
                    <p><strong>ID:</strong> {auth.user.id}</p>
                </div>
            ) : (
                <p style={{ color: 'orange' }}>Загрузка данных пользователя...</p>
            )}
            
            <button 
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Выйти
            </button>
        </div>
    );
});

export default UserProfilePage;