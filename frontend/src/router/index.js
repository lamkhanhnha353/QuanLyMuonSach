import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";

// 1. Import 2 Layout MỚI
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// 2. Import các trang Public
import Home from "@/views/Home.vue";
import DocGiaRegister from "@/views/DocGiaRegister.vue";
import Login from "@/views/Login.vue"; 

// 3. Import các trang Admin
import Dashboard from "@/views/Dashboard.vue";
import NhanVienManagement from "@/views/NhanVienManagement.vue";
// (Chúng ta sẽ tạo các trang này sau)
// import DocGiaManagement from "@/views/DocGiaManagement.vue";
// import SachManagement from "@/views/SachManagement.vue";
// import MuonSachManagement from "@/views/MuonSachManagement.vue";


const routes = [
  // --- 4. LUỒNG PUBLIC (Dùng PublicLayout) ---
  {
    path: "/",
    component: PublicLayout, // Dùng layout nền ảnh
    children: [
      {
        path: "", // Trang chủ
        name: "home",
        component: Home,
      },
      {
        path: "docgia/register",
        name: "docgia.register",
        component: DocGiaRegister,
      },
      {
        path: "login",
        name: "login",
        component: Login,
      },
      // (Trang chi tiết Sách cho Độc Giả cũng sẽ ở đây sau)
    ]
  },

  // --- 5. LUỒNG ADMIN (Dùng AdminLayout) ---
  {
    path: "/admin",
    component: AdminLayout, // Dùng layout Sidebar (nền xám)
    
    // "LÍNH GÁC" (Giữ nguyên)
    beforeEnter: (to, from, next) => {
      const user = AuthService.getCurrentUser();
      // Cho phép Admin hoặc Staff vào
      if (user && user.ChucVu && (user.ChucVu === "Admin" || user.ChucVu === "Staff")) {
        next(); // OK, cho phép vào
      } else if (user) {
        // Đã đăng nhập nhưng là Độc Giả
        alert("Bạn không có quyền truy cập trang này!");
        next("/"); 
      } else {
        // Chưa đăng nhập
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
        component: NhanVienManagement,
      },
      // (Các trang khác, tạm thời comment)
      // {
      //   path: "docgia", 
      //   name: "admin.docgia",
      //   component: DocGiaManagement,
      // },
      // {
      //   path: "sach", 
      //   name: "admin.sach",
      //   component: SachManagement,
      // },
      // {
      //   path: "muonsach",
      //   name: "admin.muonsach",
      //   component: MuonSachManagement,
      // },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;