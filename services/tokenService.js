const jwt = require('jsonwebtoken')
const config = require('config')
const RefreshToken  = require('../models/RefreshToken')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        
        const refreshToken = jwt.sign(
            { userId: payload.userId, email: payload.email },
            config.get('jwtRefreshSecret'),
            { expiresIn: '7d' } 
        )
        
        return { accessToken, refreshToken }
    }

    async saveRefreshToken(userId, refreshToken) {
        return await RefreshToken.create({
            token: refreshToken,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
    }

    async removeRefreshToken(refreshToken) {
        return await RefreshToken.destroy({ 
            where: { token: refreshToken } 
        })
    }

    async findRefreshToken(refreshToken) {
        return await RefreshToken.findOne({ 
            where: { token: refreshToken } 
        })
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, config.get('jwtSecret'))
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, config.get('jwtRefreshSecret'))
        } catch (e) {
            return null
        }
    }
}

module.exports = new TokenService()