
module.exports = (allowedRoles) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const userRole = req.user.role;
            
            if (!roles.includes(userRole)) {
                return res.status(403).json({ 
                    message: `Доступ запрещен. Требуется роль: ${roles.join(' или ')}` 
                });
            }

            next();
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка проверки роли' });
        }
    };
};