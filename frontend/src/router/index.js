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
// 1. IMPORT TRANG SỬA SÁCH MỚI
import SachEdit from "@/views/SachEdit.vue"; 

const routes = [
  // --- (Luồng Public giữ nguyên) ---
  {
    path: "/",
    component: PublicLayout, 
    children: [
      { path: "", name: "home", component: Home },
      { path: "docgia/register", name: "docgia.register", component: DocGiaRegister },
      { path: "login", name: "login", component: Login },
    ]
  },

  // --- (Luồng Admin giữ nguyên) ---
  {
    path: "/admin",
    component: AdminLayout, 
    beforeEnter: (to, from, next) => {
      // (Code lính gác giữ nguyên)
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
      // (Route Nhân Viên giữ nguyên)
      { path: "nhanvien", name: "admin.nhanvien", component: NhanVienManagement, },
      { path: "nhanvien/add", name: "admin.nhanvien.add", component: NhanVienAdd, },
      { path: "nhanvien/edit/:id", name: "admin.nhanvien.edit", component: NhanVienEdit, },

      // (Route Sách)
      {
        path: "sach", 
        name: "admin.sach",
        component: SachManagement, 
      },
      {
        path: "sach/add", 
        name: "admin.sach.add",
        component: SachAdd, 
      },
      // 2. THÊM ROUTE SỬA SÁCH MỚI
      {
        path: "sach/edit/:id", // /admin/sach/edit/123
        name: "admin.sach.edit",
        component: SachEdit, 
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;