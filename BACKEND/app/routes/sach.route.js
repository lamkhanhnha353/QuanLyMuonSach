const express = require("express");
const sach = require("../controllers/sach.controller");
const loginLimiter = require("../middleware/loginLimiter");
const router = express.Router();

router.route("/")
    .get(sach.findAll)
    .post(sach.create)
    .delete(sach.deleteAll);

router.route("/:id")
    .get(sach.findOne)
    .put(sach.update)
    .delete(sach.delete);

// Route để upload ảnh
router.post("/upload/image", sach.uploadImage);

module.exports = router;