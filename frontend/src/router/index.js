import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import DocGiaRegister from "@/views/DocGiaRegister.vue";
import DocGiaLogin from "@/views/DocGiaLogin.vue"; // <-- 1. IMPORT

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
  // <-- 2. THÊM ROUTE NÀY
  {
    path: "/docgia/login",
    name: "docgia.login",
    component: DocGiaLogin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;