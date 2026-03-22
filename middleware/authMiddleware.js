const tokenService = require('../services/tokenService')

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'No authorization header' })
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return res.status(401).json({ message: 'Invalid token format' })
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return res.status(401).json({ message: 'Invalid or expired token' })
        }

        req.user = userData
        
        next()
        
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}