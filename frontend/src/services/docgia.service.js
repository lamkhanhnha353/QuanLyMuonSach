// Tên tệp: src/services/docgia.service.js

import http from "./http-common";

// Service này dùng cho Admin quản lý,
// (AuthService đã xử lý đăng nhập/đăng ký)
class DocGiaService {
  // Admin: Lấy tất cả độc giả
  getAll() {
    return http.get("/docgia");
  }

  // Admin: Lấy 1 độc giả
  get(id) {
    return http.get(`/docgia/${id}`);
  }

  // Admin: Cập nhật độc giả
  update(id, data) {
    return http.put(`/docgia/${id}`, data);
  }

  // Admin: Xóa độc giả
  delete(id) {
    return http.delete(`/docgia/${id}`);
  }
}

export default new DocGiaService();