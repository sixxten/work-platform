const { Router } = require('express');
const router = new Router();

const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const employmentTypeRouter = require('./employmentType.routes');
const workFormatRouter = require('./workFormat.routes');
const specializationRouter = require('./specialization.routes');
const vacancyRouter = require('./vacancy.routes');
const studentProfileRouter = require('./studentProfile.routes')
const applicationRouter = require('./application.routes');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/employment-types', employmentTypeRouter);
router.use('/work-formats', workFormatRouter);
router.use('/specializations', specializationRouter);
router.use('/vacancies', vacancyRouter);
router.use('/student-profile', studentProfileRouter)
router.use('/applications', applicationRouter);

module.exports = router;