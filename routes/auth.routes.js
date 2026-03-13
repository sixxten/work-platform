const { Router } = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require("config")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")
const RefreshToken = require("../models/RefreshToken")

const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Min password length is 6 symbols").isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect login or password during registration"
                })
            }
            
            const { email, password } = req.body

            const currUser = await User.findOne({ where: { email } })
            if (currUser) {
                return res.status(400).json({ message: "This user already exists" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            
            const user = await User.create({
                email,
                password: hashedPassword
            })

            res.status(201).json({ 
                message: "User created successfully",
                userId: user.id 
            })
            
        } catch (e) {
            res.status(500).json({ message: "Registration error", error: e.message })
        }
    }
)




// /api/auth/login


// /api/auth/login
router.post(
    "/login",
    [
        check('email', "Enter correct email").normalizeEmail().isEmail(),
        check("password", "Enter the password").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data while logging"
                })
            }

            const { email, password } = req.body

            const user = await User.findOne({ where: { email } })
            
            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Wrong password" })
            }

            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email,
                    role: user.role 
                },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            const refreshToken = jwt.sign(
                { userId: user.id, email: user.email },
                config.get('jwtRefreshSecret'),
                { expiresIn: '7d' }
            )

            await RefreshToken.create({
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })


            res.json({
                accessToken: token,
                userId: user.id,
                role: user.role,
                message: "Login successful"
            })

        } catch (e) {
            res.status(500).json({ 
                message: "Login error", 
                error: e.message 
            })
        }
    }
)


// /api/auth/refresh
router.post(
    '/refresh', 
    async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' })
        }

        // Проверяем токен
        let userData
        try {
            userData = jwt.verify(refreshToken, config.get('jwtRefreshSecret'))
        } catch (e) {
            return res.status(401).json({ message: 'Invalid refresh token' })
        }

        const tokenRecord = await RefreshToken.findOne({
            where: { token: refreshToken }
        })

        if (!tokenRecord) {
            return res.status(401).json({ message: 'Refresh token not found in database' })
        }


        const newToken = jwt.sign(
            { userId: userData.userId, email: userData.email },
            config.get('jwtSecret'),
            { expiresIn: '15m' }
        )

        res.json({ accessToken: newToken })

    } catch (e) {
        res.status(500).json({ 
            message: 'Refresh error', 
            error: e.message
         })
    }
})

// /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            await RefreshToken.destroy({ where: { token: refreshToken } })
            res.clearCookie('refreshToken')
        }
        res.json({ message: "Logged out successfully" })
    } catch (e) {
        res.status(500).json({ message: "Logout error", error: e.message })
    }
})