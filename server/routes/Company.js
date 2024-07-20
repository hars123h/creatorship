const router = require("express").Router();
const companyController = require("../controllers/Companies");

const { verifyToken } = require("../middlewares/authMiddleware");

// router.post("/message", verifyToken, messageController.sendMessage);
router.get("/companies", companyController.getAllCompany);
router.get("/companies/:id", companyController.getCompanyDetail);


module.exports = router;
