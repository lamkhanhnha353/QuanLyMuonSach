const express = require("express");
const docgia = require("../controllers/docgia.controller");
    
const router = express.Router();

router.route("/login")
    .post(docgia.login);

router.route("/")
    .get(docgia.findAll)
    .post(docgia.create) // Đây là Đăng Ký
    .delete(docgia.deleteAll);

router.route("/:id")
    .get(docgia.findOne)
    .put(docgia.update)
    .delete(docgia.delete);

// Favorites routes
router.route("/:id/favorites")
    .get(docgia.getFavorites)
    .post(docgia.addFavorite);

router.route("/:id/favorites/:sachId")
    .delete(docgia.removeFavorite);

module.exports = router;
