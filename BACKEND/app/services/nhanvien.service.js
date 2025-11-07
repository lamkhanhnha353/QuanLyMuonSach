const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); 

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("NHANVIEN");
    }

    #extractNhanVienData(payload) {
        const nhanvien = {
            MSNV: payload.MSNV,
            Password: payload.password, // Nhận "password" (thường)
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu, // <-- FIX 1: Bỏ (|| "staff")
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        };

        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

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
        
        // FIX 2: Sửa logic kiểm tra (chấp nhận "Admin" (hoa))
        if (!nhanvienData.ChucVu || !["Staff", "Admin"].includes(nhanvienData.ChucVu)) {
             nhanvienData.ChucVu = "Staff"; // Mặc định là "Staff" (hoa)
        }

        // (Đã sửa lỗi insertedId)
        await this.NhanVien.insertOne(nhanvienData);
        
        delete nhanvienData.Password; 
        return nhanvienData;
    }

    async login(payload) {
        // (Hàm này đã sửa ở bước trước, giữ nguyên)
        const nhanvien = await this.NhanVien.findOne({ MSNV: payload.MSNV });
        
        if (!nhanvien) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        const isMatch = await bcrypt.compare(payload.password, nhanvien.Password);
        
        if (!isMatch) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        delete nhanvien.Password;
        return nhanvien;
    }

    // --- Chức năng CRUD (Giữ nguyên) ---
 
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
        // FIX 3: Sửa lại extractData khi update
        const updatePayload = {
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        }
        // Xóa các trường undefined
         Object.keys(updatePayload).forEach(
            (key) => updatePayload[key] === undefined && delete updatePayload[key]
        );

        const result = await this.NhanVien.findOneAndUpdate(
            filter,
            { $set: updatePayload },
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