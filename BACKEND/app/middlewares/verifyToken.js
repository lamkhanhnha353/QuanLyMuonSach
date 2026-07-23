const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "Không có token xác thực"));
    }
    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, config.jwt.secret); // { id, role }
        next();
    } catch (err) {
        return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
    }
};