const { Router } = require('express')
const router = new Router()

const authRouter = require('./auth.routes')
const userRouter = require('./user.routes');

router.use('/auth', authRouter)
router.use('/user', userRouter);

module.exports = router