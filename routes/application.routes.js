const { Router } = require('express');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', applicationController.create);
router.get('/my', applicationController.getMyApplications);
router.get('/vacancy/:vacancyId', applicationController.getByVacancyId);
router.patch('/:id/status', applicationController.updateStatus);

module.exports = router;