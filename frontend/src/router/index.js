import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import DocGiaRegister from "@/views/DocGiaRegister.vue";

// 1. IMPORT TRANG LOGIN MỚI
import Login from "@/views/Login.vue"; 
// (Xóa 2 import cũ: DocGiaLogin và NhanVienLogin)

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/docgia/register",
    name: "docgia.register",
    component: DocGiaRegister,
  },
  // 2. THAY 2 ROUTE CŨ BẰNG 1 ROUTE MỚI
  {
    path: "/login", // Đường dẫn gộp mới
    name: "login",
    component: Login,
  },
  // (Chúng ta sẽ thêm trang Sách và Quản lý sau)
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;