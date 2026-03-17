const bcrypt = require('bcryptjs')
const User = require('../models/User')
const tokenService = require('./tokenService')

class UserService {
    async registration(email, password) {
        const currUser = await User.findOne({ where: { email } })
        if (currUser) {
            throw new Error('User already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            email,
            password: hashedPassword,
            role: 'student'
        })

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }
        const tokens = tokenService.generateTokens(payload)

        await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }

    async login(email, password) {

        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new Error('User not found')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Wrong password')
        }

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }
        const tokens = tokenService.generateTokens(payload)

        await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }

    async logout(refreshToken) {
        return await tokenService.removeRefreshToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('No refresh token')
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findRefreshToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw new Error('Invalid refresh token')
        }

        const user = await User.findByPk(userData.userId)
        if (!user) {
            throw new Error('User not found')
        }

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }
        const tokens = tokenService.generateTokens(payload)

        await tokenService.removeRefreshToken(refreshToken)
        await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }
}

module.exports = new UserService()