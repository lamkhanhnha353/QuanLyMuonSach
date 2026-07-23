// Load biến môi trường từ .env file
require("dotenv").config();

const config = {
    app: {
        port: process.env.PORT || 8080,
    },
    // Cấu hình Database
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/QuanLyMuonSach"
    },
    // Cấu hình Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
};

module.exports = config;