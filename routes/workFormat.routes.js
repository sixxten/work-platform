const { Router } = require('express');
const workFormatController = require('../controllers/workFormatController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = Router();

router.get('/', workFormatController.getAll);
router.get('/:id', workFormatController.getById);


router.post('/', 
    authMiddleware, 
    roleMiddleware('admin'), 
    workFormatController.create
);

router.put('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    workFormatController.update
);

router.delete('/:id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    workFormatController.delete
);

module.exports = router;