const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.post("/login", authController.handleLogin);
router.post("/register", authController.handleRegister);
router.get("/currentUser", authController.currentUser);
router.post("/refresh", authController.handleRefreshToken);
router.post("/logout", authController.handleLogout);

module.exports = router;
