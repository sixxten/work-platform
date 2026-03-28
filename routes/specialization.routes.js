const { Router } = require('express');
const specializationController = require('../controllers/specializationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = Router();

router.get('/', specializationController.getAll);
router.get('/:id', specializationController.getById);

router.post('/', 
    authMiddleware, 
    roleMiddleware('admin'), 
    specializationController.create
);

router.put('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    specializationController.update
);

router.delete('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    specializationController.delete
);

module.exports = router;