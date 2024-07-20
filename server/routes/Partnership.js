const router = require("express").Router();
const partnerController = require("../controllers/Partnership");
const {
  verifyToken,
  businessOwnerMiddleware,
} = require("../middlewares/authMiddleware");

router.post(
  "/partnership/create",
  verifyToken,
  partnerController.createPartnership
);
router.get("/partnership/get", verifyToken, partnerController.getPartnerShip);
router.put(
  "/partnership/update-status/:id",
  verifyToken,
  businessOwnerMiddleware,
  partnerController.updateStatus
);

module.exports = router;
