// Tên tệp: src/router/index.js
// (Dán đè toàn bộ nội dung tệp này)

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
import NhanVienAdd from "@/views/NhanVienAdd.vue";
import NhanVienEdit from "@/views/NhanVienEdit.vue";

import SachManagement from "@/views/SachManagement.vue";
import SachAdd from "@/views/SachAdd.vue";
import SachEdit from "@/views/SachEdit.vue";

// 1. IMPORT TRANG QUẢN LÝ MƯỢN SÁCH
import MuonSachManagement from "@/views/MuonSachManagement.vue";


const routes = [
  // --- Luồng Public ---
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "home", component: Home },
      { path: "docgia/register", name: "docgia.register", component: DocGiaRegister },
      { path: "login", name: "login", component: Login },
      // (Bạn có thể thêm route xem sách cho độc giả ở đây, ví dụ: /sach)
    ],
  },

  // --- Luồng Admin ---
  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: (to, from, next) => {
      // (Lính gác kiểm tra quyền Admin/Nhân Viên)
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

    children: [
      {
        path: "", // /admin
        name: "admin.dashboard",
        component: Dashboard,
      },
      // Routes Quản lý Nhân Viên
      { path: "nhanvien", name: "admin.nhanvien", component: NhanVienManagement },
      { path: "nhanvien/add", name: "admin.nhanvien.add", component: NhanVienAdd },
      { path: "nhanvien/edit/:id", name: "admin.nhanvien.edit", component: NhanVienEdit },

      // Routes Quản lý Sách
      { path: "sach", name: "admin.sach", component: SachManagement },
      { path: "sach/add", name: "admin.sach.add", component: SachAdd },
      { path: "sach/edit/:id", name: "admin.sach.edit", component: SachEdit },

      // 2. THÊM ROUTE MỚI CHO QUẢN LÝ MƯỢN SÁCH
      {
        path: "muonsach",
        name: "admin.muonsach",
        component: MuonSachManagement,
      },
      
      // (Bạn có thể thêm route cho Quản lý Độc Giả và NXB ở đây)
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;