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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">
                                {isLogin ? 'Вход' : 'Регистрация'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                
                                {!isLogin && (
                                    <div className="form-group mb-3">
                                        <label>Кто вы?</label>
                                        <div className="d-flex gap-3 mt-2">
                                            <div className="form-check">
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
                                            <div className="form-check">
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
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="alert alert-danger py-2" role="alert">
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
                            
                            <p className="mt-3 text-center">
                                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="btn btn-link p-0 ms-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    {isLogin ? 'Создать аккаунт' : 'Войти'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(AuthForm);