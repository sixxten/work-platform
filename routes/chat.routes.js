const { Router } = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', chatController.getMyChats);
router.get('/:id/messages', chatController.getMessages);
router.post('/:id/messages', chatController.sendMessage);
router.get('/unread-count', chatController.getUnreadCount);
router.delete('/:id', chatController.deleteChat);

module.exports = router;