const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");
    
const router = express.Router();

router.route("/login")
    .post(nhanvien.login);

// --- Route CRUD (cho Admin quản lý) ---

router.route("/")
    .get(nhanvien.findAll)
    .post(nhanvien.create) // Đây là Đăng Ký nhân viên
    .delete(nhanvien.deleteAll);

router.route("/:id")
    .get(nhanvien.findOne)
    .put(nhanvien.update)
    .delete(nhanvien.delete);

module.exports = router;
