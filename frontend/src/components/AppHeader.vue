<template>
  <header class="app-header">
    <div class="container-fluid px-4 d-flex align-items-center py-2">
      <router-link to="/" class="d-flex align-items-center text-decoration-none me-auto logo">
        <i class="fas fa-book-reader text-primary fs-5 me-2"></i>
        <div>
          <div class="fw-bold text-dark" style="font-size: 0.95rem;">Thư viện<span class="text-primary"> SốTrang</span></div>
          <small class="text-muted" style="font-size: 0.75rem;">Khám phá & mượn sách trực tuyến</small>
        </div>
      </router-link>

      <nav class="d-none d-md-flex align-items-center gap-4 ms-5">
        <router-link to="/" class="text-dark text-decoration-none nav-link-item">Trang chủ</router-link>
        <router-link to="/books" class="text-dark text-decoration-none nav-link-item">Khám phá</router-link>
      </nav>

      <div class="ms-auto d-flex align-items-center gap-2">
        <div v-if="!currentUser" class="d-flex gap-2">
          <router-link to="/docgia/register" class="btn btn-link text-decoration-none" style="font-size: 0.9rem;">Đăng ký</router-link>
          <router-link to="/login" class="btn btn-primary btn-sm">Đăng nhập</router-link>
        </div>

        <div v-else class="d-flex align-items-center gap-2">
          <span class="text-muted d-none d-md-block" style="font-size: 0.9rem;">Xin chào, <strong class="text-dark">{{ displayName }}</strong></span>
          <button class="btn btn-outline-danger btn-sm" @click="logOut"><i class="fas fa-sign-out-alt"></i></button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

export default {
  name: "AppHeader",
  data() {
    return {
      currentUser: null,
    };
  },
  computed: {
    displayName() {
      if (!this.currentUser) return '';
      return this.currentUser.HoTenNV || (this.currentUser.HOLOT + ' ' + this.currentUser.TEN);
    }
  },
  methods: {
    logOut() {
      AuthService.logout();
      eventBus.emit("auth-change");
      this.$router.push('/login');
    },
    updateLoginStatus() {
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

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo {
  color: inherit;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.nav-link-item {
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #0d6efd;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link-item:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-link-item.router-link-active {
  color: #0d6efd !important;
}

.nav-link-item.router-link-active::after {
  transform: scaleX(1);
}

.btn-link {
  color: #0d6efd;
  padding: 0;
  text-decoration: none;
}

.btn-link:hover {
  color: #0b5ed7;
}

@media (max-width: 767px) {
  .app-header {
    padding: 0.5rem 0;
  }

  .logo div:nth-child(2) {
    display: none;
  }
}
</style>
