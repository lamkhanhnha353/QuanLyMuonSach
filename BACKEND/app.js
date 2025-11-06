const express = require("express");
const cors = require("cors");

//import routes
const docgiaRouter = require("./app/routes/docgia.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const sachRouter = require("./app/routes/sach.route");
const nxbRouter = require("./app/routes/nhaxuatban.route");
const muonSachRouter = require("./app/routes/muonsach.route");

const ApiError = require("./app/api-error"); // Import

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to book borrowing management application." }); // Đã thay đổi
});

//Sử dụng các API routes
app.use("/api/docgia", docgiaRouter);
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/sach", sachRouter);
app.use("/api/nhaxuatban", nxbRouter);
app.use("/api/muonsach", muonSachRouter);

// Bắt đầu 2 middleware xử lý lỗi
app.use( (req,res, next) => {
  return next(new ApiError(404, "Resource not found")); //khi không có route nào khớp
}) 

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({  // Đây là middleware xử lý lỗi tập trung khi gọi next(new error)
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
