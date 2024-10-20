const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
// 1. 회원가입 엔드포인트
router.post("/", userController.createUser);
router.post("/login", userController.loginWithEmail);
module.exports = router;
