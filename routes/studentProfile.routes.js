const { Router } = require('express');
const studentProfileController = require('../controllers/studentProfileController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('student'));

router.get('/', studentProfileController.getMyProfile);
router.post('/', studentProfileController.create);
router.put('/', studentProfileController.update);
router.patch('/', studentProfileController.upsert);

module.exports = router;