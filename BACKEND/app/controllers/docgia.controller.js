const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// 1. Create (Register): Đăng ký độc giả mới
exports.create = async (req, res, next) => {
    // Kiểm tra USERNAME và Password
    if (!req.body?.username || !req.body?.password) { 
        return next(new ApiError(400, "Username và mật khẩu là bắt buộc")); 
    }

    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.create(req.body);
        return res.send({ message: "Đăng ký độc giả thành công", data: document });
    } catch (error) {
        if (error.message.includes("Username")) { 
            return next(new ApiError(409, error.message)); // 409 = Conflict
        }
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang đăng ký độc giả")
        );
    }
};

// 2. Login: Đăng nhập
exports.login = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) { 
        return next(new ApiError(400, "Username và Mật khẩu là bắt buộc")); 
    }

    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const docgia = await docGiaService.login(req.body);
        return res.send({ message: "Đăng nhập thành công", data: docgia });

    } catch (error) {
        // Bắt lỗi "Username hoặc mật khẩu không đúng"
        return next(new ApiError(401, error.message)); 
    }
};

// 3. FindAll: Lấy tất cả độc giả (hoặc tìm theo tên)
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const { TEN } = req.query; 

        if (TEN) {
            documents = await docGiaService.findByTen(TEN);
        } else {
            documents = await docGiaService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang lấy thông tin độc giả")
        );
    }
    return res.send(documents);
};

// 4. FindOne: Tìm một độc giả qua ID
exports.findOne = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        delete document.password;
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi lấy độc giả với id=${req.params.id}`
            )
        );
    }
};

// 5. Update: Cập nhật thông tin độc giả
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không thể rỗng"));
    }

    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả để cập nhật"));
        }
        return res.send({ message: "Độc giả được cập nhật thành công", data: document });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`)
        );
    }
};

// 6. Delete: Xóa một độc giả
exports.delete = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.delete(req.params.id);
        
        if (!document || (document.value === null && document.ok !== 1)) {
            return next(new ApiError(404, "Không tìm thấy độc giả để xóa"));
        }
        return res.send({ message: "Độc giả đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi xóa độc giả với id=${req.params.id}`
            )
        );
    }
};

// 7. DeleteAll: Xóa tất cả độc giả
exports.deleteAll = async (_req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const deletedCount = await docGiaService.deleteAll();
        return res.send({
            message: `${deletedCount} độc giả đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi xảy ra khi đang xóa tất cả độc giả")
        );
    }
};

// 8. Add Favorite: Thêm sách vào yêu thích
exports.addFavorite = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.addFavorite(req.params.id, req.body.sachId);
        return res.send({ message: "Đã thêm sách vào yêu thích", data: document });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi thêm sách vào yêu thích cho độc giả với id=${req.params.id}`)
        );
    }
};

// 9. Remove Favorite: Xóa sách khỏi yêu thích
exports.removeFavorite = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.removeFavorite(req.params.id, req.params.sachId);
        
        return res.status(200).json({ 
            message: "Đã xóa sách khỏi yêu thích", 
            data: document 
        });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi xóa sách khỏi yêu thích cho độc giả với id=${req.params.id}`)
        );
    }
};

// 10. Get Favorites: Lấy danh sách sách yêu thích
exports.getFavorites = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const favorites = await docGiaService.getFavorites(req.params.id);
        return res.send(favorites);
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi lấy danh sách yêu thích cho độc giả với id=${req.params.id}`)
        );
    }
};
