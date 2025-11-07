import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";

// Layouts
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// Trang Public
import Home from "@/views/Home.vue";
import DocGiaRegister from "@/views/DocGiaRegister.vue";
import Login from "@/views/Login.vue"; 

// Trang Admin
import Dashboard from "@/views/Dashboard.vue";
import NhanVienManagement from "@/views/NhanVienManagement.vue";
import NhanVienAdd from "@/views/NhanVienAdd.vue"; // <-- 1. IMPORT TRANG MỚI

const routes = [
  // --- LUỒNG PUBLIC (Dùng PublicLayout) ---
  {
    path: "/",
    component: PublicLayout, 
    children: [
      { path: "", name: "home", component: Home },
      { path: "docgia/register", name: "docgia.register", component: DocGiaRegister },
      { path: "login", name: "login", component: Login },
    ]
  },

  // --- LUỒNG ADMIN (Dùng AdminLayout) ---
  {
    path: "/admin",
    component: AdminLayout, 
    beforeEnter: (to, from, next) => {
      const user = AuthService.getCurrentUser();
      if (user && user.ChucVu && (user.ChucVu === "Admin" || user.ChucVu === "Staff")) {
        next(); 
      } else if (user) {
        alert("Bạn không có quyền truy cập trang này!");
        next("/"); 
      } else {
        alert("Vui lòng đăng nhập với tư cách Nhân Viên!");
        next("/login");
      }
    },
    
    // CÁC TRANG CON CỦA ADMIN
    children: [
      {
        path: "", // /admin
        name: "admin.dashboard",
        component: Dashboard,
      },
      {
        path: "nhanvien", // /admin/nhanvien
        name: "admin.nhanvien",
        component: NhanVienManagement, // Trang Danh Sách
      },
      // 2. THÊM ROUTE MỚI
      {
        path: "nhanvien/add", // /admin/nhanvien/add
        name: "admin.nhanvien.add",
        component: NhanVienAdd, // Trang Form Thêm Mới
      },
      // (Chúng ta sẽ thêm Sửa/Chi tiết sau)
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;