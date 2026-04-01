import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import studentProfileService from '../services/studentProfileService';

const UserProfilePage = observer(() => {
    const { auth } = useContext(Context);
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        group: '',
        skills: '',
        contacts: '',
        about: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (auth.user?.role === 'student') {
                try {
                    const data = await studentProfileService.getMyProfile();
                    setProfile(data);
                    if (data && Object.keys(data).length > 0) {
                        setFormData({
                            fullName: data.fullName || '',
                            group: data.group || '',
                            skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
                            contacts: data.contacts?.phone || '',
                            about: data.about || ''
                        });
                    }
                } catch (err) {
                    console.error('Ошибка загрузки профиля:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadProfile();
    }, [auth.user]);

    const handleSave = async () => {
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const updated = await studentProfileService.upsertProfile({
                fullName: formData.fullName,
                group: formData.group,
                skills: skillsArray,
                contacts: { phone: formData.contacts },
                about: formData.about
            });
            setProfile(updated);
            setEditing(false);
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            alert('Не удалось сохранить');
        }
    };

    const handleLogout = async () => {
        await auth.logout();
        navigate('/');
    };

    const getRoleText = (role) => {
        switch(role) {
            case 'student': return 'Студент';
            case 'employer': return 'Работодатель';
            default: return 'admin';
        }
    };

    return (
        <>
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
                            {auth.user?.role === "employer" && (
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
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5 mb-4">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column">
                                <h3 className="card-title h5 mb-4 text-primary">Информация</h3>
                                
                                {auth.user ? (
                                    <>
                                        <div className="mb-4">
                                            <label className="text-muted small text-uppercase mb-1">Email</label>
                                            <p className="fw-semibold mb-0">{auth.user.email}</p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-muted small text-uppercase mb-1">Роль</label>
                                            <p className="fw-semibold mb-0">{getRoleText(auth.user.role)}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-danger">Ошибка</p>
                                )}
                                
                                <hr className="my-4" />
                                
                                <div className="mt-auto text-center">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-danger px-4 py-2"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column">
                                <h3 className="card-title h5 mb-4 text-primary">О себе</h3>
                                
                                {auth.user?.role === 'student' ? (
                                    <>
                                        {loading ? (
                                            <div className="text-center py-3">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Загрузка...</span>
                                                </div>
                                            </div>
                                        ) : editing ? (
                                            <div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">ФИО</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Группа</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.group}
                                                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Навыки (через запятую)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.skills}
                                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                                        placeholder="React, JavaScript, Node.js"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Контакты (телефон, Telegram)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.contacts}
                                                        onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
                                                        placeholder="+7 999 123-45-67, @telegram"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">О себе</label>
                                                    <textarea
                                                        className="form-control"
                                                        value={formData.about}
                                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button onClick={handleSave} className="btn btn-primary">
                                                        Сохранить
                                                    </button>
                                                    <button onClick={() => setEditing(false)} className="btn btn-secondary">
                                                        Отмена
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {profile && Object.keys(profile).length > 0 ? (
                                                    <div>
                                                        <div className="mb-3">
                                                            <label className="text-muted small text-uppercase mb-1">ФИО</label>
                                                            <p className="fw-semibold mb-0">{profile.fullName || '—'}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="text-muted small text-uppercase mb-1">Группа</label>
                                                            <p className="fw-semibold mb-0">{profile.group || '—'}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="text-muted small text-uppercase mb-1">Навыки</label>
                                                            <p className="fw-semibold mb-0">{profile.skills || '—'}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="text-muted small text-uppercase mb-1">Контакты</label>
                                                            <p className="fw-semibold mb-0">{profile.contacts?.phone || '—'}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="text-muted small text-uppercase mb-1">О себе</label>
                                                            <p className="fw-semibold mb-0">{profile.about || '—'}</p>
                                                        </div>
                                                        <button onClick={() => setEditing(true)} className="btn btn-outline-primary mt-3">
                                                            Редактировать
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3">
                                                        <p className="text-muted">Профиль не заполнен</p>
                                                        <button onClick={() => setEditing(true)} className="btn btn-primary">
                                                            Заполнить
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : auth.user?.role === 'employer' ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted">Для работодателей нет дополнительной информации</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default UserProfilePage;