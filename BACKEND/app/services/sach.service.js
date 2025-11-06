const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
        this.Sach = client.db().collection("SACH");
    }

    // Hàm trích xuất dữ liệu sách (theo CSDL Quanlymuonsach.pdf)
    #extractSachData(payload) {
        const sach = {
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            TACGIA: payload.TACGIA, 
        };

        // Loại bỏ các trường không xác định (undefined)
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );
        return sach;
    }

    // 1. Tạo sách mới (chức năng của người quản lý)
    async create(payload) {
        const sachData = this.#extractSachData(payload);

        // A. Kiểm tra xem TENSACH đã tồn tại chưa
        const existingBook = await this.Sach.findOne({ TENSACH: sachData.TENSACH });
        if (existingBook) {
            throw new Error("Tên sách đã tồn tại");
        }

        // B. Chèn sách mới vào CSDL
        const result = await this.Sach.insertOne(sachData);

        // C. Lấy lại thông tin sách vừa tạo để trả về
        const newBook = await this.findById(result.insertedId);
        return newBook;
    }

    // 2. Tìm tất cả sách (hoặc tìm theo tên or tác giả)
    async find(filter) {
        const cursor = await this.Sach.find(filter);
        return await cursor.toArray();
    }

    // 3. Tìm sách bằng Tên (cho chức năng tìm kiếm)
    async findByName(name) {
        return await this.find({
            TENSACH: { $regex: new RegExp(name), $options: "i" }, // "i" = không phân biệt hoa thường
        });
    }

    // 4. Tìm sách bằng ID
    async findById(id) {
        return await this.Sach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // 5. Cập nhật sách (chức năng của người quản lý)
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.#extractSachData(payload);
        
        const result = await this.Sach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" } 
        );
        return result;
    }

    // 6. Xóa sách (chức năng của người quản lý)
    async delete(id) {

        const result = await this.Sach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // 7. Xóa tất cả sách 
    async deleteAll() {
        const result = await this.Sach.deleteMany({}); // {} = không có điều kiện, xóa tất cả
        return result.deletedCount; 
    }
}

module.exports = SachService;