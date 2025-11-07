import http from "./http-common";

class NhanVienService {
  // Lấy tất cả nhân viên
  getAll() {
    return http.get("/nhanvien");
  }

  // Lấy 1 nhân viên
  get(id) {
    return http.get(`/nhanvien/${id}`);
  }

  // Tạo nhân viên mới (Đăng ký nội bộ)
  create(data) {
    return http.post("/nhanvien", data);
  }

  // Cập nhật nhân viên
  update(id, data) {
    return http.put(`/nhanvien/${id}`, data);
  }

  // Xóa nhân viên
  delete(id) {
    return http.delete(`/nhanvien/${id}`);
  }
}

export default new NhanVienService();