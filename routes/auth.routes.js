const { Router } = require('express')
const { body } = require('express-validator')
const authController = require('../controllers/authController')

const router = Router()

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 32 }),
    body('role').optional().isIn(['student', 'employer']),
    authController.register
)

router.post('/login',
    body('email').isEmail(),
    body('password').exists(),
    authController.login
)

router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

module.exports = router