const router = require('express').Router();
const { accessChat, fetchChats, creatGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../CONTROLLERS/chat.controllers');
const { protect } = require('../MIDDLEWARES/auth.middleware');

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.route('/group').post(protect, creatGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupAdd').put(protect, addToGroup)
router.route('/groupRemove').put(protect, removeFromGroup)

module.exports = router;