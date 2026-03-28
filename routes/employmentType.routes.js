const { Router } = require('express');
const employmentTypeController = require('../controllers/employmentTypeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = Router();


router.get('/', authMiddleware, employmentTypeController.getAll);
router.get('/:id', authMiddleware, employmentTypeController.getById);

router.post('/', 
    authMiddleware, 
    roleMiddleware('admin'), 
    employmentTypeController.create
);

router.put('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    employmentTypeController.update
);

router.delete('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    employmentTypeController.delete
);

module.exports = router;