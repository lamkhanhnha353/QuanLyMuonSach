<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-book-open text-info me-2"></i>
        <strong>Ứng dụng Mượn Sách</strong>
      </router-link>

      <div class="navbar-nav me-auto">
        <li v-if="currentUser" class="nav-item">
          <router-link to="/sach" class="nav-link">
            <i class="fas fa-book"></i> Sách
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link to="/docgia/register" class="nav-link">
            Đăng ký
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/docgia/login" class="nav-link btn btn-outline-info btn-sm">
            Đăng nhập
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link">
            Xin chào, {{ currentUser.HOLOT }} {{ currentUser.TEN }}
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
// --- PHẦN SCRIPT GIỮ NGUYÊN (Vẫn dùng Event Bus) ---
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
      eventBus.emit("auth-change"); 
      this.$router.push('/docgia/login');
    },
    
    updateLoginStatus() {
        // Hàm này bây giờ sẽ lấy đúng user object
        this.currentUser = AuthService.getCurrentUser();
    }
  },
  
  created() {
      this.updateLoginStatus(); 
      eventBus.on("auth-change", this.updateLoginStatus);
  },

  beforeUnmount() {
      eventBus.off("auth-change", this.updateLoginStatus);
  }
};
</script>