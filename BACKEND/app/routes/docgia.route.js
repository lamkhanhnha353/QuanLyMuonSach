const express = require("express");
const docgia = require("../controllers/docgia.controller");
const loginLimiter = require("../middleware/loginLimiter");
    
const router = express.Router();

router.route("/login")
    .post(loginLimiter, docgia.login);

router.route("/")
    .get(loginLimiter, docgia.findAll)
    .post(loginLimiter, docgia.create) // Đây là Đăng Ký
    .delete(loginLimiter, docgia.deleteAll);

router.route("/:id")
    .get(loginLimiter, docgia.findOne)
    .put(loginLimiter, docgia.update)
    .delete(loginLimiter, docgia.delete);

// Favorites routes
router.route("/:id/favorites")
    .get(loginLimiter, docgia.getFavorites)
    .post(loginLimiter, docgia.addFavorite);

router.route("/:id/favorites/:sachId")
    .delete(loginLimiter, docgia.removeFavorite);

module.exports = router;
