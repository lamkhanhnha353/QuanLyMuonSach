const express = require("express");
const muonsach = require("../controllers/muonsach.controller");
    
const router = express.Router();

// Route cho Độc Giả: Tạo phiếu mượn
// Route cho Nhân Viên: Xem tất cả phiếu mượn
router.route("/")
    .get(muonsach.findAll)
    .post(muonsach.create);

// Route cho Độc Giả: Xem lịch sử mượn của mình
// :id ở đây là ID của Độc Giả
router.route("/docgia/:id") 
    .get(muonsach.findByDocGia);

// Route cho Nhân Viên: Quản lý 1 phiếu mượn cụ thể
// :id ở đây là ID của Phiếu Mượn
router.route("/:id") 
    .get(muonsach.findOne)
    .put(muonsach.update) // Dùng để duyệt/trả/từ chối
    .delete(muonsach.delete);

module.exports = router;