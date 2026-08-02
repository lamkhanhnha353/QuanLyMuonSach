const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");
const loginLimiter = require("../middleware/loginLimiter");
const router = express.Router();

router.route("/login")
    .post(loginLimiter, nhanvien.login);

// --- Route CRUD (cho Admin quản lý) ---

router.route("/")
    .get(loginLimiter,nhanvien.findAll)
    .post(loginLimiter, nhanvien.create) // Đây là Đăng Ký nhân viên
    .delete(loginLimiter, nhanvien.deleteAll);

router.route("/:id")
    .get(loginLimiter, nhanvien.findOne)
    .put(loginLimiter, nhanvien.update)
    .delete(loginLimiter, nhanvien.delete);

module.exports = router;
