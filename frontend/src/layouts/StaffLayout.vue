<template>
  <div class="staff-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    
    <nav id="sidebar" class="bg-dark">
      <div class="sidebar-header">
        <button class="btn btn-dark btn-block text-start" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
          <span class="sidebar-text ms-2">Menu</span> 
        </button>
      </div>

      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/staff" class="nav-link">
            <i class="fas fa-home"></i>
            <span class="sidebar-text">Tổng quan</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/staff/sach" class="nav-link">
            <i class="fas fa-book"></i>
            <span class="sidebar-text">Quản lý Sách</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/staff/muonsach" class="nav-link">
            <i class="fas fa-receipt"></i>
            <span class="sidebar-text">Quản lý Phiếu Mượn</span>
          </router-link>
        </li>
      </ul>
       <ul class="nav flex-column mt-auto"></ul>
    </nav>

    <div id="main-content" class="bg-secondary-dark text-white">
      
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container-fluid">
           <ul class="navbar-nav ms-auto me-3" v-if="currentUser">
              <li class="nav-item dropdown">
                
                <a 
                  class="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Chào, 
                  <strong class="ms-1 me-2">{{ currentUser.HoTenNV }}</strong> 
                  <img 
                    :src="currentUser.AVATAR || defaultAvatar" 
                    alt="Avatar" 
                    class="avatar-nav"
                  >
                </a>
                
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" @click="openProfileModal" style="cursor: pointer;">
                      <i class="fas fa-user-cog me-2" style="width: 16px;"></i> Thông tin cá nhân
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" @click="logOut" style="cursor: pointer;">
                      <i class="fas fa-sign-out-alt me-2" style="width: 16px;"></i> Đăng xuất
                    </a>
                  </li>
                </ul>

              </li>
            </ul>
        </div>
      </nav>
      
      <main class="p-4">
        <router-view />
      </main>
    </div>

    <!-- Modal Xem/Sửa Thông Tin Cá Nhân (Chỉ xem thông tin, không sửa) -->
    <div class="modal fade" id="profileModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thông Tin Cá Nhân</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Mã Số Nhân Viên (MSNV)</label>
                <p>{{ currentUser?.MSNV }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Họ Tên</label>
                <p>{{ currentUser?.HoTenNV }}</p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Email</label>
                <p>{{ currentUser?.EMAIL }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Điện Thoại</label>
                <p>{{ currentUser?.DIENTHOAI }}</p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Chức Vụ</label>
                <p>{{ currentUser?.ChucVu }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Địa Chỉ</label>
                <p>{{ currentUser?.DIACHI }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "StaffLayout",
  data() {
    return {
      currentUser: null,
      isSidebarCollapsed: false,
      defaultAvatar: "https://via.placeholder.com/40?text=Avatar",
    };
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    openProfileModal() {
      const modal = new bootstrap.Modal(document.getElementById("profileModal"));
      modal.show();
    },
    logOut() {
      AuthService.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.staff-wrapper {
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
}

#sidebar {
  width: 250px;
  transition: width 0.3s ease;
  overflow-y: auto;
}

.staff-wrapper.sidebar-collapsed #sidebar {
  width: 80px;
}

.sidebar-header {
  padding: 20px 0;
  border-bottom: 1px solid #444;
}

.sidebar-header .btn {
  border-radius: 0;
}

.sidebar-text {
  display: inline;
}

.staff-wrapper.sidebar-collapsed .sidebar-text {
  display: none;
}

#main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  flex-shrink: 0;
}

main {
  flex: 1;
  overflow-y: auto;
}

.avatar-nav {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.nav-link {
  color: #aaa;
  transition: all 0.3s ease;
  padding: 12px 15px;
}

.nav-link:hover {
  color: #fff;
  background-color: #2d3748;
}

.nav-link.router-link-active {
  color: #fff;
  background-color: #4299e1;
}

.dropdown-menu-dark .dropdown-item:hover {
  background-color: #2d3748;
}

.bg-secondary-dark {
  background-color: #2a2a2a;
}
</style>
