import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 20,

    message: {
        message: "Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau."
    },

    standardHeaders: true,

    legacyHeaders: false
});

export default loginLimiter;