// Tên tệp: src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";

// Layouts
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import StaffLayout from "@/layouts/StaffLayout.vue";

// Trang Public
import HomePage from "@/views/HomePage.vue";
import BooksExplore from "@/views/BooksExplore.vue";
import BookDetail from "@/views/BookDetail.vue";
import DocGiaRegister from "@/views/DocGiaRegister.vue";
import Login from "@/views/Login.vue";

// Trang Admin
import Dashboard from "@/views/Dashboard.vue";
import NhanVienManagement from "@/views/NhanVienManagement.vue";
import NhanVienAdd from "@/views/NhanVienAdd.vue";
import NhanVienEdit from "@/views/NhanVienEdit.vue";

import DocGiaManagement from "@/views/DocGiaManagement.vue";
import DocGiaEdit from "@/views/DocGiaEdit.vue";

import SachManagement from "@/views/SachManagement.vue";
import SachAdd from "@/views/SachAdd.vue";
import SachEdit from "@/views/SachEdit.vue";

import MuonSachManagement from "@/views/MuonSachManagement.vue";

import NhaXuatBanManagement from "@/views/NhaXuatBanManagement.vue";
import NhaXuatBanAdd from "@/views/NhaXuatBanAdd.vue";
import NhaXuatBanEdit from "@/views/NhaXuatBanEdit.vue";

// Trang Staff
// import StaffDashboard from "@/views/StaffDashboard.vue"; // <-- Dòng này không cần nữa
import StaffOverview from "@/views/StaffOverview.vue"; // <-- THAY ĐỔI 1: IMPORT FILE MỚI
import StaffSachManagement from "@/views/StaffSachManagement.vue";
import StaffMuonSachManagement from "@/views/StaffMuonSachManagement.vue";


const routes = [
  // --- Luồng Public ---
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "home", component: HomePage },
      { path: "books", name: "books.explore", component: BooksExplore },
      { path: "books/:id", name: "books.detail", component: BookDetail },
      { path: "docgia/register", name: "docgia.register", component: DocGiaRegister },
      { path: "login", name: "login", component: Login },
    ],
  },

  // --- Luồng Admin (Chỉ Admin) ---
  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: (to, from, next) => {
      const user = AuthService.getCurrentUser();
      if (user && user.ChucVu && user.ChucVu === "Admin") {
        next();
      } else if (user && user.ChucVu === "Staff") {
        next("/staff");
      } else if (user) {
        next("/");
      } else {
        next("/login");
      }
    },
    children: [
      { path: "", name: "admin.dashboard", component: Dashboard },
      
      { path: "nhanvien", name: "admin.nhanvien", component: NhanVienManagement },
      { path: "nhanvien/add", name: "admin.nhanvien.add", component: NhanVienAdd },
      { path: "nhanvien/edit/:id", name: "admin.nhanvien.edit", component: NhanVienEdit },

      { path: "docgia", name: "admin.docgia", component: DocGiaManagement },
      { path: "docgia/edit/:id", name: "admin.docgia.edit", component: DocGiaEdit },

      { path: "sach", name: "admin.sach", component: SachManagement },
      { path: "sach/add", name: "admin.sach.add", component: SachAdd },
      { path: "sach/edit/:id", name: "admin.sach.edit", component: SachEdit },

      { path: "muonsach", name: "admin.muonsach", component: MuonSachManagement },
      
      { path: "nhaxuatban", name: "admin.nhaxuatban", component: NhaXuatBanManagement },
      { path: "nhaxuatban/add", name: "admin.nhaxuatban.add", component: NhaXuatBanAdd },
      { path: "nhaxuatban/edit/:id", name: "admin.nhaxuatban.edit", component: NhaXuatBanEdit },
    ],
  },

  // --- Luồng Staff (Nhân Viên) ---
  {
    path: "/staff",
    component: StaffLayout,
    beforeEnter: (to, from, next) => {
      const user = AuthService.getCurrentUser();
      if (user && user.ChucVu && user.ChucVu === "Staff") {
        next();
      } else if (user && user.ChucVu === "Admin") {
        next("/admin");
      } else if (user) {
        next("/");
      } else {
        next("/login");
      }
    },
    children: [
      // THAY ĐỔI 2: Đổi component của trang Tổng quan
      { path: "", name: "staff.dashboard", component: StaffOverview },
      { path: "sach", name: "staff.sach", component: StaffSachManagement },
      { path: "muonsach", name: "staff.muonsach", component: StaffMuonSachManagement },
      // Bạn có link "Quản lý Người dùng" trong layout,
      // nhưng chưa có route cho nó. Bạn cần thêm 1 route
      // { path: "nguoidung", name: "staff.nguoidung", component: StaffNguoiDungManagement }
      // khi bạn tạo file component đó.
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;