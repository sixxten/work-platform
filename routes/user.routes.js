const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] }
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