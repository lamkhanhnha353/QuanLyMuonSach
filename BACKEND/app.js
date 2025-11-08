const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static('public')); // (Không cần nếu không dùng Avatar)

// Routes
const nhanvienRouter = require("./app/routes/nhanvien.route");
const docgiaRouter = require("./app/routes/docgia.route");
// 1. IMPORT ROUTER SÁCH MỚI
const sachRouter = require("./app/routes/sach.route"); 

app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/docgia", docgiaRouter);
// 2. SỬ DỤNG ROUTER SÁCH MỚI
app.use("/api/sach", sachRouter); 

// (Code xử lý lỗi 404 và ApiError của bạn...)
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;