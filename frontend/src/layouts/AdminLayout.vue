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
/* PHẦN STYLE (Đã sửa .nav-link.active)
*/

.admin-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  /* Nền xám tối cho toàn bộ trang Admin */
  background-color: #212529; 
  color: #f8f9fa; /* Chữ trắng */
}

/* --- Sidebar --- */
#sidebar {
  width: 250px; /* Độ rộng khi MỞ */
  min-height: 100vh;
  /* Hiệu ứng trượt "tự nhiên" */
  transition: width 0.3s ease-in-out;
  overflow-x: hidden; /* Ẩn nội dung khi co lại */
}

/* Style cho nút Toggle (thay cho header cũ) */
.sidebar-header {
  padding: 10px; /* Giảm padding */
  border-bottom: 1px solid #495057;
}
.sidebar-header .btn {
  width: 100%; /* Nút chiếm 100% */
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-align: left; /* Căn trái khi MỞ */
}
.sidebar-header .btn .fas {
   width: 30px; /* Căn icon */
   text-align: center;
}

/* Link trong Sidebar */
.nav-link {
  font-weight: 500;
  color: #c9d1d9;
  white-space: nowrap; /* Ngăn chữ xuống hàng */
  overflow: hidden; /* Ẩn chữ (quan trọng) */
}
.nav-link .fas {
  width: 30px; /* Tăng độ rộng icon */
  text-align: center;
  margin-right: 10px;
}
.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

/* FIX 2: SỬA LỖI ACTIVE LINK
  Đổi từ ".nav-link.active" thành ".nav-link.router-link-exact-active"
*/
.nav-link.router-link-exact-active {
  color: #58a6ff;
  font-weight: bold;
}


/* --- Nội dung chính (Main Content) --- */
#main-content {
  /* Dùng flex-grow: 1 để nó tự lấp đầy phần còn lại */
  flex-grow: 1;
  min-height: 100vh;
  /* Hiệu ứng trượt "tự nhiên" (dùng chung transition) */
  transition: width 0.3s ease-in-out; 
  /* (Không cần margin-left nữa) */
}

.content-area {
  /* Đây là nền của nội dung (nơi đặt card, table...) */
  min-height: calc(100vh - 56px); /* 100% trừ đi header admin */
}

/* (Navbar style giữ nguyên) */
#main-content .navbar {
    height: 56px;
    border-bottom: 1px solid #495057;
}

/*
  TRẠNG THÁI KHI SIDEBAR ĐÓNG (collapsed)
*/
.admin-wrapper.sidebar-collapsed #sidebar {
  width: 80px; /* Độ rộng khi ĐÓNG (chỉ icon) */
}

.admin-wrapper.sidebar-collapsed .sidebar-text {
  display: none; /* Ẩn chữ */
}

/* Căn giữa icon của nút toggle khi ĐÓNG */
.admin-wrapper.sidebar-collapsed .sidebar-header .btn {
   text-align: center;
}
.admin-wrapper.sidebar-collapsed .sidebar-header .btn .fas {
   margin-right: 0;
}

/* Căn giữa icon của link menu khi ĐÓNG */
.admin-wrapper.sidebar-collapsed .nav-link {
  text-align: center;
}
.admin-wrapper.sidebar-collapsed .nav-link .fas {
  margin-right: 0;
}
</style>