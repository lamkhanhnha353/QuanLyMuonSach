import http from "./http-common";

class AuthService {
  // 
  // --- SỬA LỖI TRONG HÀM LOGIN NÀY ---
  //
  login(user) {
    return http
      .post("/docgia/login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        // response.data (từ API) là: { message: "...", data: { ...user... } }
        
        // 1. Kiểm tra xem 'response.data.data' (thông tin user) có tồn tại không
        if (response.data && response.data.data) {
          
          // 2. Chỉ lưu thông tin user (response.data.data) vào localStorage
          localStorage.setItem("user", JSON.stringify(response.data.data));
          
          // 3. Trả về chỉ thông tin user (response.data.data) cho component
          return response.data.data;
        } else {
          // Xử lý nếu API trả về không đúng (hiếm khi)
          return null; 
        }
      });
  }

  // Hàm Đăng xuất (Giữ nguyên)
  logout() {
    localStorage.removeItem("user");
  }

  // Hàm Đăng ký (Giữ nguyên)
  register(user) {
    return http.post("/docgia", {
      username: user.username,
      password: user.password,
      HOLOT: user.HOLOT,
      TEN: user.TEN,
      NGAYSINH: user.NGAYSINH,
      GIOITINH: user.GIOITINH,
      DIACHI: user.DIACHI,
      DIENTHOAI: user.DIENTHOAI,
    });
  }

  // Hàm getCurrentUser (Giữ nguyên)
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();