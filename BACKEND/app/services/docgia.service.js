const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("DOCGIA");
    }

    #extractDocGiaData(payload) {
        const docgia = {
            username: payload.username,
            password: payload.password,
            HOLOT: payload.HOLOT,
            TEN: payload.TEN,
            NGAYSINH: payload.NGAYSINH,
            GIOITINH: payload.GIOITINH, // <-- Dùng GIOITINH (theo code của bạn)
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI,
        };

        // Only include favorites if explicitly provided in payload
        if (payload.favorites !== undefined) {
            docgia.favorites = payload.favorites;
        }

        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return docgia;
    }

    // --- Chức năng XÁC THỰC --

    /**
     * Đăng ký một tài khoản độc giả mới.
     * @param {object} payload Dữ liệu độc giả từ req.body
     * @returns {object} Document độc giả vừa tạo (đã bỏ password)
     * (ĐÃ SỬA LỖI 'insertedId')
     */
    async create(payload) {
        const docgiaData = this.#extractDocGiaData(payload);

        // Kiểm tra xem USERNAME đã tồn tại chưa
        const existingDocGia = await this.DocGia.findOne({ username: docgiaData.username }); 
        if (existingDocGia) {
            throw new Error("Username đã tồn tại"); 
        }

        // Băm (mã hóa) mật khẩu
        if (docgiaData.password) {
            const salt = await bcrypt.genSalt(10);
            docgiaData.password = await bcrypt.hash(docgiaData.password, salt);
        } else {
            throw new Error("Mật khẩu là bắt buộc");
        }

        // --- BẮT ĐẦU SỬA LỖI ---
        // 'insertOne' sẽ tự động thêm _id vào 'docgiaData'
        await this.DocGia.insertOne(docgiaData);

        // Xóa mật khẩu trước khi trả về
        delete docgiaData.password; 
        
        // Trả về chính 'docgiaData' (đã bao gồm _id)
        return docgiaData;
        // --- KẾT THÚC SỬA LỖI ---
    }

    /**
     * Đăng nhập độc giả.
     * @param {object} payload Chứa username và password
     * @returns {object} Thông tin độc giả (đã bỏ password)
     */
    async login(payload) {
        // 1. Tìm độc giả bằng USERNAME
        const docgia = await this.DocGia.findOne({ username: payload.username }); 
        
        if (!docgia) {
            throw new Error("Username hoặc mật khẩu không đúng"); 
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(payload.password, docgia.password);
        
        if (!isMatch) {
            throw new Error("Username hoặc mật khẩu không đúng"); 
        }
        
        delete docgia.password;
        return docgia;
    }

    
    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }

    //Tìm độc giả băng tên
    async findByTen(ten) {
        return await this.find({
            TEN: { $regex: new RegExp(ten), $options: "i" },
        });
    }

    //Tìm độc giả bằng ID
    async findById(id) {
        let objectId;
        if (ObjectId.isValid(id)) {
            objectId = new ObjectId(id);
        } else {
            objectId = id;
        }
        return await this.DocGia.findOne({
            _id: objectId,
        });
    }
 
      // Cập nhật thông tin độc giả (dùng cho Admin).
    async update(id, payload) {
        let objectId;
        if (ObjectId.isValid(id)) {
            objectId = new ObjectId(id);
        } else {
            objectId = id;
        }

        const filter = {
            _id: objectId,
        };
        const update = this.#extractDocGiaData(payload);

        // Nếu người dùng cập nhật cả password, ta phải hash nó
        if (update.password) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
        } else {
            // Nếu không có pass mới, xóa trường này để không ghi đè
            delete update.password;
        }

        // Nếu không có username mới, xóa trường này để không ghi đè
        if (update.username === undefined) {
             delete update.username;
        }

        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        if (result.value) delete result.value.password;
        return result;
    }

     // Xóa độc giả (dùng cho Admin).
    async delete(id) {
        let objectId;
        if (ObjectId.isValid(id)) {
            objectId = new ObjectId(id);
        } else {
            objectId = id;
        }

        const result = await this.DocGia.findOneAndDelete({
            _id: objectId,
        });
        return result;
    }

     //Xóa tất cả độc giả (dùng cho Admin).
    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }

    // --- Chức năng YÊU THÍCH SÁCH ---

    /**
     * Thêm sách vào danh sách yêu thích của độc giả
     * @param {string} docGiaId ID của độc giả
     * @param {string} sachId ID của sách
     * @returns {object} Thông tin độc giả đã cập nhật
     */
    async addFavorite(docGiaId, sachId) {
        let objectId;
        if (ObjectId.isValid(docGiaId)) {
            objectId = new ObjectId(docGiaId);
        } else {
            objectId = docGiaId;
        }

        const filter = {
            _id: objectId,
        };

        const update = {
            $addToSet: { favorites: sachId } // $addToSet để tránh trùng lặp
        };

        await this.DocGia.updateOne(filter, update);
        const updatedDoc = await this.DocGia.findOne({ _id: objectId });

        if (!updatedDoc) {
            throw new Error("Không tìm thấy độc giả");
        }

        delete updatedDoc.password;
        return updatedDoc;
    }

    /**
     * Xóa sách khỏi danh sách yêu thích của độc giả
     * @param {string} docGiaId ID của độc giả
     * @param {string} sachId ID của sách
     * @returns {object} Thông tin độc giả đã cập nhật
     */
    async removeFavorite(docGiaId, sachId) {
        let objectId;
        if (ObjectId.isValid(docGiaId)) {
            objectId = new ObjectId(docGiaId);
        } else {
            objectId = docGiaId;
        }

        const filter = {
            _id: objectId,
        };

        const update = {
            $pull: { favorites: sachId }
        };

        await this.DocGia.updateOne(filter, update);
        const updatedDoc = await this.DocGia.findOne({ _id: objectId });

        if (!updatedDoc) {
            throw new Error("Không tìm thấy độc giả");
        }

        delete updatedDoc.password;
        return updatedDoc;
    }

    /**
     * Lấy danh sách sách yêu thích của độc giả
     * @param {string} docGiaId ID của độc giả
     * @returns {array} Danh sách ID sách yêu thích
     */
    async getFavorites(docGiaId) {
        let objectId;
        if (ObjectId.isValid(docGiaId)) {
            objectId = new ObjectId(docGiaId);
        } else {
            objectId = docGiaId;
        }

        const docgia = await this.DocGia.findOne({
            _id: objectId,
        });

        if (!docgia) {
            throw new Error("Không tìm thấy độc giả");
        }

        return docgia.favorites || [];
    }
}

module.exports = DocGiaService;
