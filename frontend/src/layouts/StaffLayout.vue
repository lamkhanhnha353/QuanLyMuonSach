<template>
  <div class="staff-wrapper d-flex vh-100">
    <div id="sidebar" class="d-flex flex-column flex-shrink-0 p-3" style="width: 260px; background-color: #303f9f;">
      
      <a href="/staff" class="d-flex align-items-center mb-4 text-decoration-none">
        <i class="fas fa-book-reader fa-2x me-2 text-white"></i> 
        <span class="fs-4 fw-bold text-white">Thư Viện</span>
      </a>
      
      <div class="user-profile-sidebar d-flex align-items-center p-2 mb-4" @click="openProfileModal" style="cursor: pointer;">
        <img :src="currentUser?.AVATAR || defaultAvatar" class="rounded-circle me-3" style="width: 44px; height: 44px; object-fit: cover;" />
        <div>
          <h6 class="fw-bold mb-0 text-white">{{ currentUser?.HoTenNV || 'Minh Anh' }}</h6>
          <small class="text-white-50">{{ currentUser?.ChucVu || 'Thủ thư' }}</small>
        </div>
      </div>

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/staff" exact class="nav-link d-flex align-items-center">
            <i class="fas fa-chart-pie"></i> Tổng quan
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/staff/muonsach" class="nav-link d-flex align-items-center">
            <i class="fas fa-retweet"></i> Quản lý Mượn/Trả
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/staff/sach" class="nav-link d-flex align-items-center">
            <i class="fas fa-book"></i> Quản lý Sách
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/staff/nguoidung" class="nav-link d-flex align-items-center">
            <i class="fas fa-users"></i> Quản lý Người dùng
          </router-link>
        </li>
      </ul>

      <div class="nav-bottom">
        <ul class="nav nav-pills flex-column">
           <li class="nav-item">
             <a @click="openProfileModal" class="nav-link d-flex align-items-center" style="cursor: pointer;">
                <i class="fas fa-cog"></i>
                Cài đặt
             </a>
           </li>
           <li class="nav-item">
             <a @click="logOut" class="nav-link d-flex align-items-center text-danger" style="cursor: pointer;">
                <i class="fas fa-sign-out-alt"></i>
                Đăng xuất
             </a>
           </li>
        </ul>
      </div>
    </div>

    <div id="main-content" class="flex-grow-1 overflow-auto" style="background-color: #F4F7FC;">
      <main class="p-4">
        <router-view />
      </main>
    </div>

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
import { Modal } from 'bootstrap'; 

export default {
  name: "StaffLayout",
  data() {
    return {
      currentUser: null,
      defaultAvatar: "https://via.placeholder.com/44?text=Avatar", 
      profileModalInstance: null,
    };
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
    const modalElement = document.getElementById("profileModal");
    if (modalElement) {
        this.profileModalInstance = new Modal(modalElement);
    } else {
        console.error("Không tìm thấy phần tử Modal với id 'profileModal'");
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    openProfileModal() {
      if (this.profileModalInstance) {
         this.profileModalInstance.show();
      } else {
        console.error("Modal instance chưa được khởi tạo.");
      }
    },
    logOut() {
      if (this.profileModalInstance) {
        this.profileModalInstance.hide();
      }
      AuthService.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
#sidebar {
  border-right: none !important;
}

#sidebar .nav-link {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s, color 0.2s;
  padding: 10px 15px;
}

#sidebar .nav-link i {
  width: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 12px;
  font-size: 1.1rem;
}

#sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Style cho link active (trang hiện tại) */
#sidebar .nav-link.router-link-active,
#sidebar .nav-link.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

#sidebar .nav-link.router-link-active i,
#sidebar .nav-link.router-link-exact-active i {
  color: #fff;
}

/* User Profile */
.user-profile-sidebar {
  background-color: transparent;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-profile-sidebar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* CSS cho link Đăng xuất và Cài đặt */
.nav-bottom .nav-link {
    padding: 10px 15px;
}
.nav-bottom .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-bottom .nav-link.text-danger {
  color: #f16f6f !important;
}

.nav-bottom .nav-link.text-danger i {
  color: #f16f6f !important;
}

/* CSS cho phần Main Content (Phải) */
#main-content {
  background-color: #F4F7FC; /* Giữ nguyên màu xám-xanh nhạt */
}
</style>