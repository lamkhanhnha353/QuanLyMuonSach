import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue"; // Import trang Home mới

const routes = [
  {
    path: "/",
    name: "home",
    component: Home, // Trang chủ
  },
  // Chúng ta sẽ thêm các trang khác (Login, Register...) vào đây
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;