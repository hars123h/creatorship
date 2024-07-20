const router = require("express").Router();
const userController = require("../controllers/User");
const { verifyToken, businessOwnerMiddleware } = require("../middlewares/authMiddleware");

router.post("/user/register", userController.registerUser);
router.post("/user/login", userController.login);
router.post("/user/create-company", verifyToken, businessOwnerMiddleware, userController.createCompany);
router.get("/user/get-company", verifyToken, businessOwnerMiddleware, userController.getCompany);
router.get("/user/profile", verifyToken, userController.getProfile);
router.put("/user/profile", verifyToken, userController.updateProfile);

module.exports = router;
