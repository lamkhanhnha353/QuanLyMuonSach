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
          <router-link to="/admin/docgia" class="nav-link">
            <i class="fas fa-users"></i>
            <span class="sidebar-text">Quản lý Độc Giả</span>
          </router-link>
        </li>
         <li class="nav-item">
          <router-link to="/admin/sach" class="nav-link">
            <i class="fas fa-book"></i>
            <span class="sidebar-text">Quản lý Sách</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/muonsach" class="nav-link">
            <i class="fas fa-receipt"></i>
            <span class="sidebar-text">Quản lý Phiếu Mượn</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div id="main-content">
      
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">Trang Quản Trị</span>

          <div class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" v-if="currentUser">
                Xin chào, {{ currentUser.HoTenNV }}
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

      <div class="content-area p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// --- PHẦN SCRIPT (Giữ nguyên) ---
import AuthService from "@/services/auth.service";

export default {
  data() {
    return {
      isSidebarCollapsed: false, // Mặc định là MỞ
      currentUser: null,
    };
  },
  methods: {
    toggleSidebar() {
      // Hàm này được gọi bởi nút "fas fa-bars"
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    logOut() {
      AuthService.logout();
      // Đăng xuất là về trang Login
      this.$router.push('/login'); 
    }
  },
  created() {
    // Lấy thông tin Admin khi layout được tạo
    this.currentUser = AuthService.getCurrentUser();
  }
}
</script>

<style scoped>
/* PHẦN STYLE (Đã sửa .sidebar-header và .navbar)
*/

.admin-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #212529; 
  color: #f8f9fa; 
}

/* --- Sidebar --- */
#sidebar {
  width: 250px; 
  min-height: 100vh;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden; 
}

/* FIX 1: SỬA HEADER CỦA SIDEBAR
  Ép chiều cao = 56px và dùng Flexbox căn giữa
*/
.sidebar-header {
  height: 56px; /* Ép chiều cao bằng navbar */
  padding: 0 10px; /* Bỏ padding dọc */
  border-bottom: 1px solid #495057;
  display: flex; /* Dùng Flexbox */
  align-items: center; /* Căn giữa nút Menu theo chiều dọc */
}
.sidebar-header .btn {
  width: 100%; 
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-align: left; 
}
.sidebar-header .btn .fas {
   width: 30px; 
   text-align: center;
}

/* Link trong Sidebar */
.nav-link {
  font-weight: 500;
  color: #c9d1d9;
  white-space: nowrap; 
  overflow: hidden; 
}
.nav-link .fas {
  width: 30px; 
  text-align: center;
  margin-right: 10px;
}
.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Sửa lỗi Active Link (dùng class mặc định của Vue Router 4) */
.nav-link.router-link-exact-active {
  color: #58a6ff;
  font-weight: bold;
}


/* --- Nội dung chính (Main Content) --- */
#main-content {
  flex-grow: 1;
  min-height: 100vh;
  transition: width 0.3s ease-in-out; 
}

/* FIX 2: SỬA HEADER (NAVBAR) CỦA NỘI DUNG
  Đảm bảo nó cũng cao 56px
*/
#main-content .navbar {
    height: 56px; /* Giữ nguyên 56px */
    border-bottom: 1px solid #495057;
    /* Bootstrap .navbar đã là flex và căn giữa, 
      nên không cần thêm CSS
    */
}

.content-area {
  min-height: calc(100vh - 56px); 
}

/*
  TRẠNG THÁI KHI SIDEBAR ĐÓNG (collapsed)
*/
.admin-wrapper.sidebar-collapsed #sidebar {
  width: 80px; 
}
.admin-wrapper.sidebar-collapsed .sidebar-text {
  display: none; 
}
.admin-wrapper.sidebar-collapsed .sidebar-header .btn {
   text-align: center;
}
.admin-wrapper.sidebar-collapsed .sidebar-header .btn .fas {
   margin-right: 0;
}
.admin-wrapper.sidebar-collapsed .nav-link {
  text-align: center;
}
.admin-wrapper.sidebar-collapsed .nav-link .fas {
  margin-right: 0;
}
</style>