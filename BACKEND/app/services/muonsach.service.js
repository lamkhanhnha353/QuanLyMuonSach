const { ObjectId } = require("mongodb");

class MuonSachService {
    constructor(client) {
        this.MuonSach = client.db().collection("THEODOIMUONSACH");
        // Phải truy cập được collection "SACH" để kiểm tra số quyển
        this.Sach = client.db().collection("SACH");
    }
    /**
     * 1. Create: Chức năng cho Độc Giả tạo phiếu mượn mới.
     * (Đã thêm logic kiểm tra SOQUYEN)
     */
   // DÁN ĐÈ TOÀN BỘ HÀM NÀY VÀO 'muonsach.service.js'

async create(payload) {

    // --- 1. LÀM SẠCH VÀ KIỂM TRA ID SÁCH ---
    // Đọc 'payload.sachId'
    const cleanSachId = payload.sachId ? String(payload.sachId).trim().replace(/"/g, '') : null;
    const sachId = ObjectId.isValid(cleanSachId) ? new ObjectId(cleanSachId) : null;
    if (!sachId) {
        throw new Error("ID Sách không hợp lệ");
    }

    // --- 2. LÀM SẠCH VÀ KIỂM TRA ID ĐỘC GIẢ ---
    // Đọc 'payload.docGiaId' (CHÍNH XÁC TỪNG CHỮ HOA, THƯỜNG)
    const cleanDocGiaId = payload.docGiaId ? String(payload.docGiaId).trim().replace(/"/g, '') : null;
    const docGiaId = ObjectId.isValid(cleanDocGiaId) ? new ObjectId(cleanDocGiaId) : null;

    if (!docGiaId) {
        // Lỗi 500 của bạn xuất phát từ đây
        throw new Error("ID Độc Giả không hợp lệ (Lỗi đọc payload)"); 
    }

    // --- 3. KIỂM TRA LOGIC SÁCH (TRỪ KHO) ---
    const sach = await this.Sach.findOne({ _id: sachId });
    if (!sach) throw new Error("Không tìm thấy sách");
    if (sach.SOQUYEN <= 0) {
        throw new Error("Sách đã hết, không thể mượn");
    }
    await this.Sach.updateOne(
        { _id: sachId },
        { $inc: { SOQUYEN: -1 } } 
    );

    // --- 4. NÂNG CẤP LOGIC NHÂN VIÊN ---
    let trangThaiMoi = "chờ duyệt";
    let nhanVienXuLyId = null;

    // Đọc 'payload.nhanVienId'
    if (payload.nhanVienId) {
        const cleanNhanVienId = payload.nhanVienId ? String(payload.nhanVienId).trim().replace(/"/g, '') : null;
        if (ObjectId.isValid(cleanNhanVienId)) {
            nhanVienXuLyId = new ObjectId(cleanNhanVienId);
            trangThaiMoi = "đã duyệt"; // Tự động duyệt luôn
        }
    }
    // --- KẾT THÚC NÂNG CẤP ---

    const phieuMuonData = {
        docGiaId: docGiaId,
        sachId: sachId,
        ngayMuon: payload.ngayMuon,
        ngayTra: payload.ngayTra,
        trangThai: trangThaiMoi, 
        nhanVienId: nhanVienXuLyId,
        ngayTraThucTe: null, 
    };

    const result = await this.MuonSach.insertOne(phieuMuonData);
    return await this.findById(result.insertedId);
}

    
     //2. Find: Chức năng cho Nhân Viên/Admin xem tất cả phiếu mượn.
     
    async find(filter) {
        const cursor = await this.MuonSach.find(filter);
        return await cursor.toArray();
    }

     //3. Find by ID: Lấy chi tiết 1 phiếu mượn. 
    async findById(id) {
        return await this.MuonSach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

     //4. Find by DocGiaId: Chức năng cho Độc Giả xem lịch sử mượn.
    async findByDocGia(docGiaId) {
        const filter = {
             docGiaId: ObjectId.isValid(docGiaId) ? new ObjectId(docGiaId) : null
        };
        return await this.find(filter);
    }

    /**
     * 5. Update: Nhân Viên cập nhật trạng thái phiếu.
     * (Đã thêm logic trả sách vào kho)
     */
    async update(id, payload) {
        const phieuMuonId = ObjectId.isValid(id) ? new ObjectId(id) : null;
        if (!phieuMuonId) throw new Error("ID Phiếu Mượn không hợp lệ");

        // --- LOGIC TRẢ SÁCH ---
        // A. Lấy phiếu mượn HIỆN TẠI để biết trạng thái cũ
        const currentPhieuMuon = await this.findById(phieuMuonId);
        if (!currentPhieuMuon) throw new Error("Không tìm thấy phiếu mượn");
        
        const newTrangThai = payload.trangThai;
        const oldTrangThai = currentPhieuMuon.trangThai;
        const sachId = currentPhieuMuon.sachId;

        // B. Kiểm tra xem có cần trả sách về kho không?
        // Trả sách (+1 SOQUYEN) nếu:
        // 1. Trạng thái mới là "đã trả" (VÀ trạng thái cũ chưa phải là "đã trả")
        // 2. Trạng thái mới là "từ chối" (VÀ trạng thái cũ là "chờ duyệt")
        
        const isReturning = (newTrangThai === "đã trả" && oldTrangThai !== "đã trả");
        const isRejected = (newTrangThai === "từ chối" && oldTrangThai === "chờ duyệt");
        
        // Chỉ cộng lại sách nếu sách ĐANG ở ngoài (chưa được trả/từ chối)
        const isBookOut = ["chờ duyệt", "đã duyệt", "đang mượn"].includes(oldTrangThai);

        if ((isReturning || isRejected) && isBookOut) {
            // Cộng 1 trả lại SOQUYEN cho sách
            await this.Sach.updateOne(
                { _id: sachId },
                { $inc: { SOQUYEN: +1 } }
            );
        }
        // --- KẾT THÚC LOGIC TRẢ SÁCH ---

        // C. Cập nhật phiếu mượn
        const filter = { _id: phieuMuonId };
        const updateData = {};
        const validStates = ["chờ duyệt", "đã duyệt", "đang mượn", "đã trả", "từ chối"];
        
        if (newTrangThai && validStates.includes(newTrangThai)) {
            updateData.trangThai = newTrangThai;
        } else {
             throw new Error("Trạng thái cập nhật không hợp lệ");
        }
        
        if (payload.nhanVienId) {
            updateData.nhanVienId = ObjectId.isValid(payload.nhanVienId) ? new ObjectId(payload.nhanVienId) : null;
        } else {
            // Bất kỳ ai cập nhật (trừ độc giả) đều phải có ID
             throw new Error("ID Nhân viên xử lý là bắt buộc");
        }

        if (newTrangThai === "đã trả") {
            updateData.ngayTraThucTe = new Date().toISOString().split('T')[0]; // Ghi nhận ngày hôm nay
        }

        const result = await this.MuonSach.findOneAndUpdate(
            filter,
            { $set: updateData },
            { returnDocument: "after" }
        );
        return result;
    }

    /**
     * 6. Delete: Xóa phiếu mượn.
     * (Đã thêm logic trả sách vào kho nếu phiếu bị xóa khi đang mượn)
     */
    async delete(id) {
        // A. Lấy phiếu mượn TRƯỚC KHI XÓA
        const phieuMuon = await this.findById(id);
        if (phieuMuon) {
            const { trangThai, sachId } = phieuMuon;
            // Nếu phiếu bị xóa khi sách đang ở ngoài (chờ, đã duyệt, đang mượn)
            // thì phải trả sách về kho
            if (["chờ duyệt", "đã duyệt", "đang mượn"].includes(trangThai)) {
                 await this.Sach.updateOne(
                    { _id: sachId },
                    { $inc: { SOQUYEN: +1 } }
                );
            }
        }

        // B. Xóa phiếu mượn
        const result = await this.MuonSach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result; 
    }
}

module.exports = MuonSachService;