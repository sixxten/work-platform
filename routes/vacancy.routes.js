const { Router } = require('express');
const vacancyController = require('../controllers/vacancyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = Router();


router.get('/', vacancyController.getAll);

router.get('/my', 
    authMiddleware,
    roleMiddleware(['employer', 'admin']), 
    vacancyController.getMyVacancies
);

router.get('/:id', vacancyController.getById);

router.use(authMiddleware);

router.get('/employer/:employerId', vacancyController.getByEmployer);

router.post(
  '/',
  roleMiddleware(['employer', 'admin']),
  vacancyController.create
);

router.put(
  '/:id',
  roleMiddleware(['employer', 'admin']),
  vacancyController.update
);

router.delete(
  '/:id',
  roleMiddleware(['employer', 'admin']),
  vacancyController.delete
);

router.patch(
  '/:id/status',
  roleMiddleware(['employer', 'admin']),
  vacancyController.changeStatus
);

module.exports = router;