const router = require("express").Router();
const { sendMessage, allMessages } = require("../CONTROLLERS/message.controllers");
const { protect } = require("../MIDDLEWARES/auth.middleware");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
