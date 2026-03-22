// client/src/components/AuthForm.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const AuthForm = () => {
    const { auth } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
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
            result = await auth.register(email, password);
            
            if (result.success) {
                // Если регистрация успешна, переключаем на логин
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