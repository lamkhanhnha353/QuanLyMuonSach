// Tên tệp: backend/app/services/nhanvien.service.js
// (Dán đè toàn bộ nội dung tệp)

const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); 

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("NHANVIEN");
    }

    // HÀM NÀY ĐƯỢC CẬP NHẬT
    #extractNhanVienData(payload) {
        const nhanvien = {
            MSNV: payload.MSNV,
            Password: payload.password, // Nhận "password" (thường)
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
            // 3 TRƯỜNG MỚI
            EMAIL: payload.EMAIL,
            CCCD: payload.CCCD,
            AVATAR: payload.AVATAR,
        };

        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    // HÀM NÀY ĐƯỢC CẬP NHẬT (THÊM KIỂM TRA TRÙNG EMAIL/CCCD)
    async create(payload) {
        const nhanvienData = this.#extractNhanVienData(payload);

        // 1. Kiểm tra MSNV
        const existingMSNV = await this.NhanVien.findOne({ MSNV: nhanvienData.MSNV });
        if (existingMSNV) {
            throw new Error("MSNV đã tồn tại");
        }
        
        // 2. KIỂM TRA EMAIL MỚI
        if (nhanvienData.EMAIL) {
             const existingEmail = await this.NhanVien.findOne({ EMAIL: nhanvienData.EMAIL });
             if (existingEmail) {
                throw new Error("Email đã tồn tại");
            }
        }
       
        // 3. KIỂM TRA CCCD MỚI
         if (nhanvienData.CCCD) {
            const existingCCCD = await this.NhanVien.findOne({ CCCD: nhanvienData.CCCD });
            if (existingCCCD) {
                throw new Error("CCCD đã tồn tại");
            }
        }

        // 4. Băm mật khẩu
        if (nhanvienData.Password) {
            const salt = await bcrypt.genSalt(10);
            nhanvienData.Password = await bcrypt.hash(nhanvienData.Password, salt);
        }

        // 5. Thêm vào CSDL
        const result = await this.NhanVien.insertOne(nhanvienData);
        const newNhanVien = await this.findById(result.insertedId);
        
        if (newNhanVien) delete newNhanVien.Password;
        return newNhanVien;
    }

    // --- (Các hàm find, findById, findByMSNV giữ nguyên) ---
    async findByMSNV(MSNV) {
         return await this.NhanVien.findOne({ MSNV: MSNV });
    }
    
    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
    }
    
    async findById(id) {
        return await this.NhanVien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
   
    // HÀM NÀY ĐƯỢC CẬP NHẬT (Thêm 3 trường mới)
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        
        const updatePayload = {
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
            // 3 TRƯỜNG MỚI
            EMAIL: payload.EMAIL,
            CCCD: payload.CCCD,
            AVATAR: payload.AVATAR,
        };
        
        // (Chúng ta sẽ bỏ qua logic kiểm tra trùng EMAIL/CCCD khi update để đơn giản hóa)
        // (Nếu bạn muốn, có thể thêm logic tương tự hàm create)

        // Xóa các trường undefined
         Object.keys(updatePayload).forEach(
            (key) => updatePayload[key] === undefined && delete updatePayload[key]
        );

        // Xử lý nếu có mật khẩu mới
        if (payload.password) {
             const salt = await bcrypt.genSalt(10);
             updatePayload.Password = await bcrypt.hash(payload.password, salt);
        }

        const result = await this.NhanVien.findOneAndUpdate(
            filter,
            { $set: updatePayload },
            { returnDocument: "after" }
        );
        
        if (result.value) delete result.value.Password;
        return result;
    }

    // --- (Hàm delete giữ nguyên) ---
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

     // --- (Hàm login giữ nguyên) ---
     async login(MSNV, password) {
        const nhanvien = await this.findByMSNV(MSNV);
        if (!nhanvien) {
            throw new Error("MSNV không tồn tại");
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            nhanvien.Password 
        );
        if (!isPasswordCorrect) {
            throw new Error("Mật khẩu không chính xác");
        }
        
        delete nhanvien.Password;
        return nhanvien;
    }
}

module.exports = NhanVienService;