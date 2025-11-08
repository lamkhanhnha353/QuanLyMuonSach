const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
        this.Sach = client.db().collection("SACH");
    }

    // Hàm trích xuất dữ liệu sách
    #extractSachData(payload) {
        const sach = {
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            TACGIA: payload.TACGIA, 
            HinhAnh: payload.HinhAnh, // <-- FIX 1: THÊM TRƯỜNG HÌNH ẢNH
        };

        // Loại bỏ các trường không xác định (undefined)
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );
        return sach;
    }

    // 1. Tạo sách mới
    async create(payload) {
        const sachData = this.#extractSachData(payload);

        // A. Kiểm tra xem TENSACH đã tồn tại chưa
        const existingBook = await this.Sach.findOne({ TENSACH: sachData.TENSACH });
        if (existingBook) {
            throw new Error("Tên sách đã tồn tại");
        }

        // B. Chèn sách mới vào CSDL
        const result = await this.Sach.insertOne(sachData);

        // FIX 2: SỬA LỖI (Không trả về 'result' mà trả về document)
        const newDocument = await this.Sach.findOne({ _id: result.insertedId });
        return newDocument;
    }

    // 2. Tìm tất cả sách
    async find(filter) {
        const cursor = await this.Sach.find(filter);
        return await cursor.toArray();
    }

    // 3. Tìm sách bằng Tên
    async findByName(name) {
        return await this.find({
            TENSACH: { $regex: new RegExp(name), $options: "i" }, 
        });
    }

    // 4. Tìm sách bằng ID
    async findById(id) {
        return await this.Sach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // 5. Cập nhật sách
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.#extractSachData(payload);
        
        const result = await this.Sach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" } // Trả về document sau khi update
        );
        return result;
    }

    // 6. Xóa sách
    async delete(id) {
        const result = await this.Sach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result; 
    }

    // 7. Xóa tất cả
    async deleteAll() {
        // FIX 3: Sửa lỗi (NhanVien -> Sach)
        const result = await this.Sach.deleteMany({}); 
        return result.deletedCount;
    }
}

module.exports = SachService;