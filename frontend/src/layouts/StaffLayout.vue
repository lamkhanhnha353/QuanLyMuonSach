<template>
  <div class="staff-wrapper">
    <div id="main-content">
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div class="container-fluid">
          <div class="d-flex align-items-center">
            <i class="fas fa-book text-primary me-2 fa-lg"></i>
            <span class="fw-bold text-primary">Thư Viện Quản Lý</span>
          </div>



          <div class="d-flex align-items-center ms-auto">
            <div class="dropdown">
              <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="currentUser?.AVATAR || defaultAvatar" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" />
                <span class="d-none d-md-inline">{{ currentUser?.HoTenNV || 'Nhân viên' }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" @click="goHome" style="cursor: pointer;"><i class="fas fa-home me-2"></i>Về trang chủ</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" @click="openProfileModal" style="cursor: pointer;"><i class="fas fa-user me-2"></i>Thông tin cá nhân</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" @click="logOut" style="cursor: pointer;"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <main class="p-4" style="background: #f8f9fa; min-height: calc(100vh - 76px);">
        <div class="container-fluid">
          <div class="row mb-4">
            <div class="col-12">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb bg-white p-3 rounded shadow-sm">
                  <li class="breadcrumb-item">
                    <router-link to="/staff" class="text-decoration-none current-page">
                      <i class="fas fa-home me-1"></i>Tổng quan
                    </router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/staff/sach" class="text-decoration-none current-page">
                      <i class="fas fa-book me-1"></i>Quản lý Sách
                    </router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/staff/muonsach" class="text-decoration-none current-page">
                      <i class="fas fa-receipt me-1"></i>Quản lý Phiếu Mượn
                    </router-link>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    <router-view name="breadcrumb" />
                  </li>
                </ol>
              </nav>


            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <router-view />
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>

    <!-- Modal Thông Tin Cá Nhân -->
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
      defaultAvatar: "https://via.placeholder.com/44?text=Avatar",
    };
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
  },
  methods: {
    goHome() {
      this.$router.push("/");
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
}

#main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  flex-shrink: 0;
}

main {
  flex: 1;
  overflow-y: auto;
}



.breadcrumb a {
  color: black !important;
}

.breadcrumb .breadcrumb-item.active a {
  color: #007bff !important;
}

.current-page {
  color: #007bff !important;
}
</style>
