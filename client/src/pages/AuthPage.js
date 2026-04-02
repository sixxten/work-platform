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
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        
                        {!isLogin && (
                            <div className="mb-3">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="role"
                                        id="roleStudent"
                                        value="student"
                                        checked={role === 'student'}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="roleStudent">
                                        Студент
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="role"
                                        id="roleEmployer"
                                        value="employer"
                                        checked={role === 'employer'}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="roleEmployer">
                                        Работодатель
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={auth.isLoading}
                        >
                            {auth.isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Загрузка...
                                </>
                            ) : (
                                isLogin ? 'Войти' : 'Зарегистрироваться'
                            )}
                        </button>
                    </form>
                    
                    <div className="text-center mt-3">
                        {isLogin ? (
                            <>
                                <span className="text-muted">Нет аккаунта? </span>
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="btn btn-link p-0"
                                    style={{ textDecoration: 'none', verticalAlign: 'baseline' }}
                                >
                                    Создать аккаунт
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-muted">Уже есть аккаунт? </span>
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="btn btn-link p-0"
                                    style={{ textDecoration: 'none', verticalAlign: 'baseline' }}
                                >
                                    Войти
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(AuthForm);