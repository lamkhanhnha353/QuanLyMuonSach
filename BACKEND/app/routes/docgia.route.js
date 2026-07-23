const express = require("express");
const docgia = require("../controllers/docgia.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

router.route("/login")
    .post(docgia.login);

router.route("/")
    .get(verifyToken, checkRole(["Admin"]), docgia.findAll)
    .post(docgia.create) // Đây là Đăng Ký
    .delete(verify, checkRole(["Admin"]), docgia.deleteAll);

router.route("/:id")
    .get(verifyToken, checkRole(["Admin"]), docgia.findOne)
    .put(verifyToken, checkRole(["Admin"]), docgia.update)
    .delete(verifyToken, checkRole(["Admin"]), docgia.delete);

// Favorites routes
router.route("/:id/favorites")
    .get(verifyToken, checkToken(["DocGia"]), docgia.getFavorites)
    .post(verifyToken, checkToken(["DocGia"]), docgia.addFavorite);

router.route("/:id/favorites/:sachId")
    .delete(verifyToken, checkToken(["DocGia"]), docgia.removeFavorite);

module.exports = router;
