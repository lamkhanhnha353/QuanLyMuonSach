
const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 

const nhanvienRouter = require("./app/routes/nhanvien.route");
const docgiaRouter = require("./app/routes/docgia.route");
const sachRouter = require("./app/routes/sach.route"); 
const muonsachRouter = require("./app/routes/muonsach.route");
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");
const chatbotRouter = require("./app/routes/chatbot.route");

app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/sach", sachRouter);
app.use("/api/muonsach", muonsachRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);
app.use("/api/chatbot", chatbotRouter);


// Xử lý lỗi 404
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});


app.use((err, req, res, next) => {
   
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;