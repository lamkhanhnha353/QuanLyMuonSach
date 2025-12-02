// Tên tệp: backend/app.js
// (Dán đè toàn bộ nội dung tệp)

const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
// Tăng giới hạn kích thước body để chấp nhận dữ liệu ảnh Base64 lớn
app.use(express.json({ limit: "10mb" })); // Middleware xử lý JSON với limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Middleware xử lý URL-encoded bodies

// --- IMPORT TẤT CẢ 5 ROUTES ---
const nhanvienRouter = require("./app/routes/nhanvien.route");
const docgiaRouter = require("./app/routes/docgia.route");
const sachRouter = require("./app/routes/sach.route"); 
const muonsachRouter = require("./app/routes/muonsach.route");       // <-- (BỊ THIẾU)
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");   // <-- (BỊ THIẾU)

// --- SỬ DỤNG TẤT CẢ 5 ROUTES ---
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/sach", sachRouter);
app.use("/api/muonsach", muonsachRouter);       // <-- (BỊ THIẾU)
app.use("/api/nhaxuatban", nhaxuatbanRouter);   // <-- (BỊ THIẾU)


// Xử lý lỗi 404
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Xử lý lỗi 500 (lỗi từ server)
app.use((err, req, res, next) => {
    // Đây chính là nơi trả về lỗi 500 cho bạn
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;