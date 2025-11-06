const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); 

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("NHANVIEN");
    }

    #extractNhanVienData(payload) {
        const nhanvien = {
            MSNV: payload.MSNV,
            // FIX 1: Nhận "password" (thường) từ controller
            Password: payload.password, 
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu || "staff", 
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        };

        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    /**
     * Đăng ký (tạo) một nhân viên mới.
     * (ĐÃ SỬA LỖI insertedId)
     */
    async create(payload) {
        const nhanvienData = this.#extractNhanVienData(payload);

        // (Kiểm tra MSNV đã tồn tại - giữ nguyên)
        const existingNhanVien = await this.NhanVien.findOne({ MSNV: nhanvienData.MSNV });
        if (existingNhanVien) {
            throw new Error("MSNV đã tồn tại");
        }

        // (Băm mật khẩu - giữ nguyên)
        if (nhanvienData.Password) {
            const salt = await bcrypt.genSalt(10);
            nhanvienData.Password = await bcrypt.hash(nhanvienData.Password, salt);
        } else {
            throw new Error("Mật khẩu là bắt buộc");
        }
        
        // (Kiểm tra ChucVu - giữ nguyên)
        if (!["staff", "admin"].includes(nhanvienData.ChucVu)) {
             nhanvienData.ChucVu = "staff";
        }

        // FIX 2: SỬA LỖI insertedId
        // 'insertOne' sẽ tự thêm _id vào 'nhanvienData'
        await this.NhanVien.insertOne(nhanvienData);
        
        // Xóa mật khẩu và trả về
        delete nhanvienData.Password; 
        return nhanvienData;
    }

    /**
     * Đăng nhập nhân viên.
     */
    async login(payload) {
        // 1. Tìm nhân viên bằng MSNV (giữ nguyên)
        const nhanvien = await this.NhanVien.findOne({ MSNV: payload.MSNV });
        
        if (!nhanvien) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        // 2. So sánh mật khẩu
        // FIX 3: Dùng "payload.password" (thường)
        const isMatch = await bcrypt.compare(payload.password, nhanvien.Password);
        
        if (!isMatch) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        // 3. Đăng nhập thành công (giữ nguyên)
        delete nhanvien.Password;
        return nhanvien;
    }

    // --- Chức năng CRUD (Giữ nguyên code của bạn) ---
 
    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
    }
    
    async findById(id) {
        return await this.NhanVien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
   
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.#extractNhanVienData(payload);
        delete update.MSNV; 
        delete update.Password; 

        const result = await this.NhanVien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        
        if (result.value) delete result.value.Password;
        return result;
    }

    async delete(id) {
        const result = await this.NhanVien.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result; 
    }

    async deleteAll() {
        const result = await this.NhanVien.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NhanVienService;