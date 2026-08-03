const express = require("express");
const sach = require("../controllers/sach.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.route("/")
    .get(sach.findAll)
    .post(verifyToken, checkRole(["Admin"]), sach.create)
    .delete(verifyToken, checkRole(["Admin"]), sach.deleteAll);

router.route("/:id")
    .get(sach.findOne)
    .put(verifyToken, checkRole(["Admin"]), sach.update)
    .delete(verifyToken, checkRole(["Admin"]), sach.delete);

// Route để upload ảnh
router.post("/upload/image", verifyToken, checkRole(["Admin"]), sach.uploadImage);

module.exports = router;

