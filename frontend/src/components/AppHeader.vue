<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-book-open text-info me-2"></i>
        <strong>Ứng dụng Mượn Sách</strong>
      </router-link>

      <div class="navbar-nav me-auto">
        <li v-if="currentUser && !currentUser.ChucVu" class="nav-item">
          <router-link to="/sach" class="nav-link">
            <i class="fas fa-book"></i> Sách
          </router-link>
        </li>
        
        <li v-if="currentUser && currentUser.ChucVu" class="nav-item">
          <router-link to="/admin" class="nav-link text-warning">
            <i class="fas fa-tachometer-alt me-1"></i> Trang Quản Trị
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link to="/docgia/register" class="nav-link">
            Đăng ký (Độc Giả)
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link btn btn-outline-info btn-sm">
            Đăng nhập
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link">
            Xin chào, {{ currentUser.HoTenNV || (currentUser.HOLOT + " " + currentUser.TEN) }}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link btn btn-outline-warning btn-sm" @click="logOut">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </a>
        </li>
      </div>

    </div>
  </nav>
</template>

<script>
// --- PHẦN SCRIPT (Giữ nguyên Event Bus) ---
// (Event Bus vẫn CẦN THIẾT để Login.vue báo cho AppHeader.vue)
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

export default {
  name: "AppHeader",
  data() {
    return {
      currentUser: null,
    };
  },
  methods: {
    logOut() {
      AuthService.logout();
      eventBus.emit("auth-change"); // Gửi tín hiệu
      this.$router.push('/login'); // Đẩy về trang login
    },
    
    updateLoginStatus() {
        this.currentUser = AuthService.getCurrentUser();
    }
  },
  
  // (Phần created và beforeUnmount giữ nguyên)
  created() {
      this.updateLoginStatus(); 
      eventBus.on("auth-change", this.updateLoginStatus);
  },
  beforeUnmount() {
      eventBus.off("auth-change", this.updateLoginStatus);
  }
};
</script>