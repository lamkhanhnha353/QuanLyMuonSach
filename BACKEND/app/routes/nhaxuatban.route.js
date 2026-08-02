const express = require("express");
const nhaxuatban = require("../controllers/nhaxuatban.controller");
const loginLimiter = require("../middleware/loginLimiter");
const router = express.Router();

router.route("/")
    .get(loginLimiter, nhaxuatban.findAll)
    .post(loginLimiter, nhaxuatban.create)
    .delete(loginLimiter, nhaxuatban.deleteAll);

router.route("/:id")
    .get(loginLimiter, nhaxuatban.findOne)
    .put(loginLimiter, nhaxuatban.update)
    .delete(loginLimiter, nhaxuatban.delete);

module.exports = router;
