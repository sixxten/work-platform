import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const AuthForm = () => {
    const { auth } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isLogin) {
            result = await auth.login(email, password);
            if (result.success) {
                navigate('/profile');
            }
        } else {
            result = await auth.register(email, password, role);
            
            if (result.success) {
                setIsLogin(true);
                setEmail('');
                setPassword('');
            }
        }

        if (!result?.success) {
            setError(result?.error || 'Ошибка');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                 {!isLogin && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '20px' }}>
                            <input
                                type="radio"
                                value="student"
                                checked={role === 'student'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            Студент
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="employer"
                                checked={role === 'employer'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            Работодатель
                        </label>
                    </div>
                )}
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit" disabled={auth.isLoading}>
                    {auth.isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            </button>
        </div>
    );
};

export default observer(AuthForm);