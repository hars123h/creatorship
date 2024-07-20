const router = require("express").Router();
const messageController = require("../controllers/Message");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/message", verifyToken, messageController.sendMessage);
router.get("/message/:userId", verifyToken, messageController.getMessage);

module.exports = router;
