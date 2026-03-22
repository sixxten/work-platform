// routes/user.routes.js
const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = Router();

// Получить профиль текущего пользователя
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // req.user приходит из authMiddleware (данные из токена)
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] } // не отдаем пароль
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message });
    }
});

module.exports = router;