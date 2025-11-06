// (Tạm thời chúng ta cũng tạo các hàm CRUD cho nhân viên, 
const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// 1. Create (Register): Tạo nhân viên mới
exports.create = async (req, res, next) => {
    // Kiểm tra MSNV và Password
    if (!req.body?.MSNV || !req.body?.Password) {
        return next(new ApiError(400, "MSNV và Mật khẩu là bắt buộc"));
    }

    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const document = await nhanVienService.create(req.body);
        return res.send({ message: "Tạo nhân viên thành công", data: document });
    } catch (error) {
        // Bắt lỗi "MSNV đã tồn tại"
        if (error.message.includes("MSNV")) {
            return next(new ApiError(409, error.message)); // 409 = Conflict
        }
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang tạo nhân viên")
        );
    }
};

// 2. Login: Đăng nhập
exports.login = async (req, res, next) => {
    if (!req.body?.MSNV || !req.body?.Password) {
        return next(new ApiError(400, "MSNV và Mật khẩu là bắt buộc"));
    }

    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const nhanvien = await nhanVienService.login(req.body);
        
        return res.send({ message: "Đăng nhập thành công", data: nhanvien });
    } catch (error) {
        // Bắt lỗi "MSNV hoặc Mật khẩu không đúng"
        return next(new ApiError(401, error.message)); // 401 = Unauthorized
    }
};

// 3. FindAll: Lấy tất cả nhân viên
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        documents = await nhanVienService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang lấy thông tin nhân viên")
        );
    }
    documents.forEach(doc => delete doc.Password);
    return res.send(documents);
};

// 4. FindOne: Tìm một nhân viên qua ID
exports.findOne = async (req, res, next) => {
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const document = await nhanVienService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        delete document.Password; 
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi lấy nhân viên với id=${req.params.id}`
            )
        );
    }
};

// 5. Update: Cập nhật thông tin nhân viên
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không thể rỗng"));
    }

    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const document = await nhanVienService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên để cập nhật"));
        }
        return res.send({ message: "Nhân viên được cập nhật thành công", data: document });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const document = await nhanVienService.delete(req.params.id);
        
        if (!document || (document.value === null && document.ok !== 1)) {
            return next(new ApiError(404, "Không tìm thấy nhân viên để xóa"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi xóa nhân viên với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const deletedCount = await nhanVienService.deleteAll();
        return res.send({
            message: `${deletedCount} nhân viên đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang xóa tất cả nhân viên")
        );
    }
};
