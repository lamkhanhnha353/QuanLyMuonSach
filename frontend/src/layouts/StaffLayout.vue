<template>
  <div class="staff-wrapper d-flex vh-100">
    <!-- SIDEBAR CŨ (GIỮ NGUYÊN) -->
    <div id="sidebar" class="d-flex flex-column flex-shrink-0 p-3" style="width: 263px; background-color: #303f9f;">
      
      <a href="/staff" class="d-flex align-items-center mb-4 text-decoration-none">
        <i class="fas fa-book-reader fa-2x me-2 text-white"></i> 
        <span class="fs-4 fw-bold text-white">Thư Viện</span>
      </a>
      
      <div class="user-profile-sidebar d-flex align-items-center p-2 mb-4" style="cursor: pointer;">
        <img :src="currentUser?.AVATAR || defaultAvatar" class="rounded-circle me-3" style="width: 44px; height: 44px; object-fit: cover;" @click="openProfileModal" />
        <div>
          <h6 class="fw-bold mb-0 text-white">{{ currentUser?.HoTenNV || 'Minh Anh' }}</h6>
          <small class="text-white-50">{{ displayRole }}</small>
        </div>
      </div>

      <ul class="nav nav-pills flex-column mb-auto">
        
        <li class="nav-item">
          <router-link to="/" exact class="nav-link d-flex align-items-center">
            <i class="fas fa-home"></i> Về Trang chủ
          </router-link>
        </li>

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
        <li class="nav-item">
          <router-link to="/staff/nhaxuatban" class="nav-link d-flex align-items-center">
            <i class="fas fa-building"></i> Quản lý Nhà Xuất Bản
          </router-link>
        </li>
      </ul>

      <div class="nav-bottom">
        <ul class="nav nav-pills flex-column">
           <li class="nav-item">
             <router-link to="/staff/account" class="nav-link d-flex align-items-center">
                <i class="fas fa-user-cog"></i>
                Cài đặt tài khoản
             </router-link>
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

    <!-- MAIN CONTENT CŨ (GIỮ NGUYÊN) -->
    <div id="main-content" class="flex-grow-1 overflow-auto" style="background-color: #F4F7FC;">
      <main class="p-4">
        <router-view />
      </main>
    </div>

    <!-- PROFILE MODAL MỚI (ĐÃ THAY ĐỔI) -->
    <div class="modal fade" id="profileModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 overflow-hidden shadow-lg rounded-4">
          
          <!-- Decorative Header -->
          <div class="profile-header-bg">
            <button type="button" class="btn-close-white-custom" data-bs-dismiss="modal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body pt-0 px-4 pb-4">
            <!-- Avatar Section -->
            <div class="d-flex justify-content-center position-relative" style="margin-top: -60px;">
              <div class="profile-avatar-wrapper">
                <img :src="currentUser?.AVATAR || defaultAvatar" class="profile-avatar-lg" />
                <button class="btn-edit-avatar shadow-sm"><i class="fas fa-camera"></i></button>
              </div>
            </div>

            <!-- Name & Role -->
            <div class="text-center mt-3 mb-4">
              <h4 class="fw-bold text-dark mb-1">{{ currentUser?.HoTenNV || 'Nhân viên' }}</h4>
              <span class="badge bg-primary-subtle text-primary rounded-pill px-3">{{ currentUser?.ChucVu || 'Chức vụ' }}</span>
              <p class="text-muted small mt-2 mb-0"><i class="far fa-id-card me-1"></i> MSNV: <strong>{{ currentUser?.MSNV }}</strong></p>
            </div>

            <!-- Info Grid -->
            <div class="row g-3">
              <div class="col-6">
                <div class="info-item p-3 rounded-3 bg-light h-100">
                  <div class="text-secondary small mb-1"><i class="fas fa-envelope me-2 text-primary"></i>Email</div>
                  <div class="fw-semibold text-break">{{ currentUser?.EMAIL || 'Chưa cập nhật' }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-item p-3 rounded-3 bg-light h-100">
                  <div class="text-secondary small mb-1"><i class="fas fa-phone me-2 text-success"></i>Điện thoại</div>
                  <div class="fw-semibold">{{ currentUser?.SoDienThoai || 'Chưa cập nhật' }}</div>
                </div>
              </div>
              <div class="col-12">
                <div class="info-item p-3 rounded-3 bg-light">
                  <div class="text-secondary small mb-1"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Địa chỉ</div>
                  <div class="fw-semibold">{{ currentUser?.DiaChi || 'Chưa cập nhật' }}</div>
                </div>
              </div>
              <div class="col-12">
                <div class="info-item p-3 rounded-3 bg-light">
                  <div class="text-secondary small mb-1"><i class="fas fa-address-card me-2 text-warning"></i>CCCD/CMND</div>
                  <div class="fw-semibold">{{ currentUser?.CCCD || 'Chưa cập nhật' }}</div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer bg-light border-0 justify-content-center py-3">
             <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary rounded-pill px-4" @click="goToAccountSettings">Chỉnh sửa thông tin</button>
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
  computed: {
    displayRole() {
      if (!this.currentUser?.ChucVu) return 'Thủ thư';
      return this.currentUser.ChucVu === 'Staff' ? 'Nhân viên' : this.currentUser.ChucVu;
    }
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
    goToAccountSettings() {
      if (this.profileModalInstance) {
        this.profileModalInstance.hide();
      }
      this.$router.push("/staff/account");
    }
  },
};
</script>

<style scoped>
/* CSS CHO SIDEBAR CŨ (GIỮ NGUYÊN) */
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

/* --- CSS MỚI CHO PROFILE MODAL (THÊM VÀO ĐÂY) --- */
.profile-header-bg {
    height: 110px;
    background: linear-gradient(135deg, #303f9f 0%, #7986cb 100%);
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 15px;
}

.btn-close-white-custom {
    background: rgba(0,0,0,0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}
.btn-close-white-custom:hover {
    background: rgba(0,0,0,0.4);
}

.profile-avatar-wrapper {
    position: relative;
    padding: 4px;
    background: #fff;
    border-radius: 50%;
}
.profile-avatar-lg {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff; /* Viền trắng tách biệt nền */
}
.btn-edit-avatar {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e9ecef;
    border: 2px solid #fff;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}
.btn-edit-avatar:hover {
    background: #303f9f;
    color: #fff;
}

.info-item {
    transition: transform 0.2s;
    border: 1px solid transparent;
}
.info-item:hover {
    transform: translateY(-2px);
    border-color: #dee2e6;
    background-color: #fff !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
</style>