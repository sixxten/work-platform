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

    // Загружаем профиль при загрузке страницы
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
                            contacts: data.contacts?.phone || '',  // ← добавил
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
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Профиль</h1>
            
            {auth.user ? (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <p><strong>Email:</strong> {auth.user.email}</p>
                    <p><strong>Роль:</strong> {getRoleText(auth.user.role)}</p>
                </div>
            ) : (
                <p>Ошибка</p>
            )}

            {auth.user?.role === 'student' && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Обо мне</h2>
                    
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : editing ? (
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label><strong>ФИО:</strong></label><br />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label><strong>Группа:</strong></label><br />
                                <input
                                    type="text"
                                    value={formData.group}
                                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label><strong>Навыки (через запятую):</strong></label><br />
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="React, JavaScript, Node.js"
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label><strong>Контакты (телефон, Telegram):</strong></label><br />
                                <input
                                    type="text"
                                    value={formData.contacts}
                                    onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
                                    placeholder="+7 999 123-45-67, @telegram"
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label><strong>О себе:</strong></label><br />
                                <textarea
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    rows={4}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <button onClick={handleSave} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                                Сохранить
                            </button>
                            <button onClick={() => setEditing(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                                Отмена
                            </button>
                        </div>
                    ) : (
                        // Режим просмотра
                        <div>
                            {profile && Object.keys(profile).length > 0 ? (
                                <div>
                                    <p><strong>ФИО:</strong> {profile.fullName || '—'}</p>
                                    <p><strong>Группа:</strong> {profile.group || '—'}</p>
                                    <p><strong>Навыки:</strong> {profile.skills || '—'}</p>
                                    <p><strong>Контакты:</strong> {profile.contacts?.phone || '—'}</p>
                                    <p><strong>О себе:</strong> {profile.about || '—'}</p>
                                    <button onClick={() => setEditing(true)} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                                        Редактировать
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p>Профиль не заполнен</p>
                                    <button onClick={() => setEditing(true)} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                                        Заполнить
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <button 
                onClick={handleLogout}
                style={{
                    marginTop: '30px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Выйти
            </button>
        </div>
    );
});

export default UserProfilePage;