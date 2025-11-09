<template>
  <div class="admin-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    
    <nav id="sidebar" class="bg-dark">
      <div class="sidebar-header">
        <button class="btn btn-dark btn-block text-start" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
          <span class="sidebar-text ms-2">Menu</span> 
        </button>
      </div>

      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/admin" class="nav-link">
            <i class="fas fa-home"></i>
            <span class="sidebar-text">Tổng quan</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/nhanvien" class="nav-link">
            <i class="fas fa-users-cog"></i>
            <span class="sidebar-text">Quản lý Nhân Viên</span>
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" style="color: #6c757d; cursor: not-allowed;">
            <i class="fas fa-users"></i>
            <span class="sidebar-text">Quản lý Độc Giả</span>
          </a>
          </li>
         <li class="nav-item">
          <router-link to="/admin/sach" class="nav-link">
            <i class="fas fa-book"></i>
            <span class="sidebar-text">Quản lý Sách</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/admin/muonsach" class="nav-link">
            <i class="fas fa-receipt"></i> <span class="sidebar-text">Quản lý Phiếu Mượn</span>
          </router-link>
        </li>

        <li class="nav-item">
          <a class="nav-link" style="color: #6c757d; cursor: not-allowed;">
            <i class="fas fa-building"></i>
            <span class="sidebar-text">Quản lý NXB</span>
          </a>
          </li>
      </ul>
      
      <ul class="nav flex-column mt-auto">
        <li class="nav-item">
          <a class="nav-link logout-link" @click="logOut">
            <i class="fas fa-sign-out-alt"></i>
            <span class="sidebar-text">Đăng xuất</span>
          </a>
        </li>
      </ul>
    </nav>

    <div id="main-content" class="bg-secondary-dark text-white">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container-fluid">
          <span class="navbar-text ms-auto" v-if="currentUser">
             Chào, <strong>{{ currentUser.HoTenNV }}</strong> ({{ currentUser.ChucVu }})
           </span>
        </div>
      </nav>
      
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

export default {
  name: "AdminLayout",
  data() {
    return {
      isSidebarCollapsed: false,
      currentUser: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    logOut() {
      AuthService.logout();
      eventBus.emit("auth-change");
      this.$router.push('/login');
    },
  },
  mounted() {
    // Lấy thông tin user khi layout được tải
    this.currentUser = AuthService.getCurrentUser();
    
    // (Lắng nghe nếu có lỗi 401 - Tùy chọn)
    eventBus.on("unauthorized", () => {
        this.logOut();
    });
  },
  beforeUnmount() {
     eventBus.off("unauthorized");
  }
};
</script>

<style scoped>
/* (Style cho layout Admin, giữ nguyên như bạn đã cung cấp) */
.admin-wrapper {
  display: flex;
}

#sidebar {
  width: 250px;
  min-height: 100vh;
  transition: width 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

/* Sidebar khi thu gọn */
.admin-wrapper.sidebar-collapsed #sidebar {
  width: 70px;
}
.admin-wrapper.sidebar-collapsed .sidebar-text,
.admin-wrapper.sidebar-collapsed .sidebar-header .ms-2 {
  display: none;
}
.admin-wrapper.sidebar-collapsed .sidebar-header button {
  justify-content: center;
}
.admin-wrapper.sidebar-collapsed .nav-link {
  justify-content: center;
}

/* --- Header của Sidebar (nút toggle) --- */
.sidebar-header {
  height: 56px; 
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar-header button {
  width: 100%;
  display: flex;
  align-items: center;
}
.sidebar-header button .fas {
   width: 30px; 
   text-align: center;
}

/* Link trong Sidebar */
.nav-link {
  font-weight: 500;
  color: #c9d1d9;
  white-space: nowrap; 
  overflow: hidden; 
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
}
.nav-link .fas {
  width: 30px; 
  text-align: center;
  margin-right: 10px;
  font-size: 1.1rem;
}
.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-exact-active {
  color: #58a6ff;
  font-weight: bold;
  background-color: rgba(88, 166, 255, 0.1);
  border-left: 3px solid #58a6ff;
}

/* Nút đăng xuất */
.logout-link {
  cursor: pointer;
}
.logout-link:hover {
  color: #ff7b72; /* Màu đỏ nhạt khi hover */
  background-color: rgba(255, 123, 114, 0.1);
}


/* --- Nội dung chính (Main Content) --- */
#main-content {
  flex-grow: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out; 
  margin-left: 250px; 
}

.admin-wrapper.sidebar-collapsed #main-content {
  margin-left: 70px;
}

#main-content .navbar {
    height: 56px; 
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bg-secondary-dark {
  background-color: #212529; /* Màu nền tối cho nội dung */
}

main {
  padding: 20px;
}
</style>