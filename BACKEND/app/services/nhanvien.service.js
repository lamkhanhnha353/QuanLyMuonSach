const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); 

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("NHANVIEN");
    }

    #extractNhanVienData(payload) {
        const nhanvien = {
            MSNV: payload.MSNV, // Dùng làm username
            Password: payload.Password,
            HoTenNV: payload.HoTenNV,
            // Đặt ChucVu mặc định là "staff" nếu không được cung cấp
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
     * @param {object} payload Dữ liệu nhân viên từ req.body
     * @returns {object} Document nhân viên vừa tạo (đã bỏ password)
     */
    async create(payload) {
        const nhanvienData = this.#extractNhanVienData(payload);

        // Kiểm tra xem MSNV (username) đã tồn tại chưa
        const existingNhanVien = await this.NhanVien.findOne({ MSNV: nhanvienData.MSNV });
        if (existingNhanVien) {
            throw new Error("MSNV đã tồn tại");
        }

        // Băm (mã hóa) mật khẩu
        if (nhanvienData.Password) {
            const salt = await bcrypt.genSalt(10);
            nhanvienData.Password = await bcrypt.hash(nhanvienData.Password, salt);
        } else {
            throw new Error("Mật khẩu là bắt buộc");
        }
        
        // Chỉ cho phép tạo "staff" hoặc "admin"
        if (!["staff", "admin"].includes(nhanvienData.ChucVu)) {
             nhanvienData.ChucVu = "staff"; // Mặc định là staff nếu nhập bậy
        }

        // Chèn nhân viên mới vào CSDL
        const result = await this.NhanVien.insertOne(nhanvienData);
        const newNhanVien = await this.findById(result.insertedId);
        
        delete newNhanVien.Password; 
        return newNhanVien;
    }

    /**
     * Đăng nhập nhân viên.
     * @param {object} payload Chứa MSNV và Password
     * @returns {object} Thông tin nhân viên (đã bỏ password)
     */
    async login(payload) {
        // 1. Tìm nhân viên bằng MSNV
        const nhanvien = await this.NhanVien.findOne({ MSNV: payload.MSNV });
        
        if (!nhanvien) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(payload.Password, nhanvien.Password);
        
        if (!isMatch) {
            throw new Error("MSNV hoặc Mật khẩu không đúng");
        }

        // 3. Đăng nhập thành công, xóa pass và trả về
        delete nhanvien.Password;
        return nhanvien;
    }

    // --- Chức năng CRUD (Quản lý bởi Admin) ---
 
     //Tìm nhân viên (có thể lọc).
    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
    }
    
     //Tìm nhân viên bằng ID.
    async findById(id) {
        return await this.NhanVien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
   
     // Cập nhật thông tin nhân viên (dùng cho Admin).  
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        // Lấy dữ liệu update, nhưng không cho update MSNV và Password qua đường này
        const update = this.#extractNhanVienData(payload);
        delete update.MSNV; // Không cho đổi MSNV
        delete update.Password; // Không cho đổi pass (cần làm chức năng đổi pass riêng)

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