const express = require("express");
const nhaxuatban = require("../controllers/nhaxuatban.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

router.route("/")
    .get(nhaxuatban.findAll)
    .post(verifyToken, checkRole(["Admin"]), nhaxuatban.create)
    .delete(verifyToken, checkRole(["Admin"]), nhaxuatban.deleteAll);

router.route("/:id")
    .get(nhaxuatban.findOne)
    .put(verifyToken, checkRole(["Admin"]), nhaxuatban.update)
    .delete(verifyToken, checkRole(["Admin"]), nhaxuatban.delete);

module.exports = router;
