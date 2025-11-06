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
            GIOITINH: payload.GIOITINH,
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI, 
        };

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

        const result = await this.DocGia.insertOne(docgiaData);

        // Lấy lại thông tin độc giả vừa tạo để trả về
        const newDocGia = await this.findById(result.insertedId);
        
        delete newDocGia.password; 
        return newDocGia;
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
        return await this.DocGia.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
  
     // Cập nhật thông tin độc giả (dùng cho Admin). 
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
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
        const result = await this.DocGia.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result; 
    }

     //Xóa tất cả độc giả (dùng cho Admin).
    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = DocGiaService;