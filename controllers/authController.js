const { validationResult } = require('express-validator')
const userService = require('../services/userService')

class AuthController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect login or password during registration"
                })
            }
            
            const { email, password, role } = req.body
            const userData = await userService.registration(email, password, role)

            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(201).json({ 
                message: "User created successfully",
                accessToken: userData.accessToken,
                userId: userData.user.id,
                role: userData.user.role
            })
            
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data while logging"
                })
            }

            const { email, password } = req.body
            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.json({
                accessToken: userData.accessToken,
                userId: userData.user.id,
                role: userData.user.role,
                message: "Login successful"
            })

        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }

    async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found' })
            }

            const userData = await userService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.json({ 
                accessToken: userData.accessToken,
                userId: userData.user.id,
                role: userData.user.role
            })

        } catch (e) {
            res.status(401).json({ message: e.message })
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (refreshToken) {
                await userService.logout(refreshToken)
                res.clearCookie('refreshToken')
            }
            res.json({ message: "Logged out successfully" })
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
}

module.exports = new AuthController()