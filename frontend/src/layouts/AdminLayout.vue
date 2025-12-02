<template>
  <div class="admin-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    
    <!-- SIDEBAR: Light Modern Style -->
    <nav id="sidebar" class="sidebar-light">
      <div class="sidebar-header">
        <div class="brand-wrapper" v-if="!isSidebarCollapsed">
           <i class="fas fa-book-reader text-primary fa-lg me-2"></i>
           <span class="brand-text">LibManager</span>
        </div>
        <button class="btn btn-toggle-custom" @click="toggleSidebar">
          <i class="fas" :class="isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>

      <div class="sidebar-menu-wrapper">
        <ul class="nav flex-column">
          <li class="nav-label" v-if="!isSidebarCollapsed">DASHBOARD</li>
          <li class="nav-item">
            <router-link to="/admin" class="nav-link">
              <span class="icon-box"><i class="fas fa-home"></i></span>
              <span class="nav-text">Tổng quan</span>
            </router-link>
          </li>
          
          <li class="nav-label mt-3" v-if="!isSidebarCollapsed">QUẢN LÝ</li>
          
          <li class="nav-item">
            <router-link to="/admin/sach" class="nav-link">
              <span class="icon-box"><i class="fas fa-book"></i></span>
              <span class="nav-text">Quản lý Sách</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/muonsach" class="nav-link">
              <span class="icon-box"><i class="fas fa-receipt"></i></span>
              <span class="nav-text">Phiếu Mượn</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/nhaxuatban" class="nav-link">
               <span class="icon-box"><i class="fas fa-building"></i></span>
               <span class="nav-text">Nhà Xuất Bản</span>
            </router-link>
          </li>

          <li class="nav-label mt-3" v-if="!isSidebarCollapsed">NGƯỜI DÙNG</li>

          <li class="nav-item">
            <router-link to="/admin/docgia" class="nav-link">
              <span class="icon-box"><i class="fas fa-users"></i></span>
              <span class="nav-text">Độc Giả</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/nhanvien" class="nav-link">
              <span class="icon-box"><i class="fas fa-user-tie"></i></span>
              <span class="nav-text">Nhân Viên</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <div id="main-content">
      <!-- Top Navbar -->
      <nav class="navbar navbar-expand navbar-light bg-white navbar-custom sticky-top">
        <div class="container-fluid px-4">
            <!-- Breadcrumb / Title -->
            <div class="d-none d-md-block">
               <h5 class="mb-0 text-dark fw-bold">Trang Quản Trị</h5>
               <small class="text-muted">Hệ thống quản lý thư viện</small>
            </div>

            <!-- User Menu -->
            <ul class="navbar-nav ms-auto align-items-center" v-if="currentUser">
              <li class="nav-item dropdown">
                <a 
                  class="nav-link profile-link d-flex align-items-center gap-2" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div class="text-end d-none d-sm-block">
                    <div class="fw-bold text-dark small">{{ currentUser.HoTenNV }}</div>
                    <div class="text-muted" style="font-size: 11px;">{{ currentUser.ChucVu || 'Staff' }}</div>
                  </div>
                  <div class="avatar-wrapper">
                     <img 
                      :src="currentUser.AVATAR || defaultAvatar" 
                      alt="Avatar" 
                      class="avatar-img"
                    >
                  </div>
                </a>
                
                <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item py-2" @click="openProfileModal">
                      <i class="fas fa-user-circle me-2 text-primary"></i> Thông tin cá nhân
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item py-2 text-danger" @click="logOut">
                      <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
        </div>
      </nav>
      
      <!-- Router View Content -->
      <main class="p-4 content-area">
        <router-view />
      </main>
    </div>

    <!-- MODAL PROFILE (LIGHT THEME) -->
    <div 
      class="modal fade" 
      id="profileModal" 
      tabindex="-1" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-white border-bottom">
            <h5 class="modal-title fw-bold text-primary">
               <i class="fas fa-id-card me-2"></i>Hồ Sơ Của Bạn
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-light-gray">
            
            <div v-if="profileData">
              <Form 
                @submit="handleProfileUpdate" 
                :validation-schema="editSchema" 
                :initial-values="profileData"
                :validate-on-input="true"
              >
                <!-- Avatar Section -->
                <div class="text-center mb-4">
                   <div class="position-relative d-inline-block">
                      <img :src="profileData.AVATAR || defaultAvatar" class="profile-avatar-lg shadow-sm" />
                      <span class="badge rounded-pill bg-primary position-absolute bottom-0 end-0 mb-2">{{ profileData.ChucVu }}</span>
                   </div>
                </div>

                <div class="card border-0 shadow-sm mb-3">
                   <div class="card-body">
                      <h6 class="text-uppercase text-muted small fw-bold mb-3">Thông tin chung</h6>
                      <div class="row g-3">
                        <div class="col-md-6">
                           <label class="form-label">Họ Tên</label>
                           <Field name="HoTenNV" type="text" class="form-control" />
                           <ErrorMessage name="HoTenNV" class="error-feedback" />
                        </div>
                        <div class="col-md-6">
                           <label class="form-label">Mã Nhân Viên</label>
                           <Field name="MSNV" type="text" class="form-control bg-light" disabled />
                        </div>
                         <div class="col-md-6">
                           <label class="form-label">Email</label>
                           <Field name="EMAIL" type="email" class="form-control" />
                           <ErrorMessage name="EMAIL" class="error-feedback" />
                        </div>
                        <div class="col-md-6">
                           <label class="form-label">Số Điện Thoại</label>
                           <Field name="SoDienThoai" type="text" class="form-control" />
                           <ErrorMessage name="SoDienThoai" class="error-feedback" />
                        </div>
                      </div>
                   </div>
                </div>

                <div class="card border-0 shadow-sm">
                   <div class="card-body">
                      <h6 class="text-uppercase text-muted small fw-bold mb-3">Chi tiết & Bảo mật</h6>
                      <div class="row g-3">
                         <div class="col-md-6">
                           <label class="form-label">CCCD</label>
                           <Field name="CCCD" type="text" class="form-control" />
                           <ErrorMessage name="CCCD" class="error-feedback" />
                        </div>
                        <div class="col-md-6">
                           <label class="form-label">Địa Chỉ</label>
                           <Field name="DiaChi" type="text" class="form-control" />
                           <ErrorMessage name="DiaChi" class="error-feedback" />
                        </div>
                        <div class="col-12">
                           <label class="form-label">URL Avatar</label>
                           <Field name="AVATAR" type="text" class="form-control" placeholder="https://..." />
                        </div>
                        <div class="col-12">
                           <label class="form-label text-warning">Đổi mật khẩu (Tùy chọn)</label>
                           <Field name="password" type="password" class="form-control" placeholder="Nhập mật khẩu mới..." autocomplete="new-password"/>
                           <ErrorMessage name="password" class="error-feedback" />
                        </div>
                      </div>
                   </div>
                </div>

                <div class="d-flex justify-content-end mt-4">
                  <button type="button" class="btn btn-light me-2 text-muted" data-bs-dismiss="modal">Hủy bỏ</button>
                  <button type="submit" class="btn btn-primary px-4" :disabled="profileLoading">
                    <span v-if="profileLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <span v-else>Lưu Thay Đổi</span>
                  </button>
                </div>

                <div v-if="profileMessage" class="alert alert-success mt-3 shadow-sm border-0 text-center">
                  {{ profileMessage }}
                </div>
              </Form>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// --- GIỮ NGUYÊN PHẦN SCRIPT LOGIC CỦA BẠN (KHÔNG THAY ĐỔI) ---
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";
import { Dropdown, Modal } from "bootstrap"; 
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NhanVienService from "@/services/nhanvien.service";

export default {
  name: "AdminLayout",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const editSchema = yup.object().shape({
      HoTenNV: yup.string().required("Họ tên là bắt buộc!"),
      DiaChi: yup.string().required("Địa chỉ là bắt buộc!"),
      SoDienThoai: yup.string().required("Số điện thoại là bắt buộc!"),
      EMAIL: yup.string().email("Email không hợp lệ").required("Email là bắt buộc!"),
      CCCD: yup.string().required("CCCD là bắt buộc!").length(12, "Đúng 12 số").matches(/^[0-9]+$/, "Chỉ chứa số"),
      AVATAR: yup.string().url("URL không hợp lệ").nullable().optional(),
      password: yup.string().min(6, "Ít nhất 6 ký tự").optional().nullable(),
    });

    return {
      isSidebarCollapsed: false,
      currentUser: null,
      defaultAvatar: "https://i.imgur.com/sC21Kna.png",
      dropdownInstance: null, 
      profileModalInstance: null,
      profileData: null, 
      profileLoading: false,
      profileMessage: "",
      editSchema, 
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
    loadCurrentUser() {
      this.currentUser = AuthService.getCurrentUser();
    },
    initDropdown() {
      this.$nextTick(() => {
        const dropdownToggleEl = this.$el.querySelector('#navbarDropdown');
        if (dropdownToggleEl) {
          if (this.dropdownInstance) this.dropdownInstance.dispose();
          this.dropdownInstance = new Dropdown(dropdownToggleEl);
        }
      });
    },
    openProfileModal() {
      this.profileData = { ...AuthService.getCurrentUser() };
      this.profileMessage = ""; 
      if (this.profileModalInstance) this.profileModalInstance.show();
    },
    async handleProfileUpdate(data) {
      this.profileLoading = true;
      this.profileMessage = "";
      if (!data.password) delete data.password;

      try {
        const response = await NhanVienService.update(this.profileData._id, data);
        const updatedUser = response.data.data.value; 

        if (updatedUser) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            eventBus.emit("auth-change"); 
            this.profileData = updatedUser; 
            this.currentUser = updatedUser;
        }
        this.profileMessage = "Cập nhật thành công!";
        setTimeout(() => {
          this.profileModalInstance.hide();
          this.profileMessage = "";
        }, 1500);
      } catch (error) {
        this.profileMessage = error.response?.data?.message || "Lỗi cập nhật.";
      } finally {
        this.profileLoading = false;
      }
    },
    handleAuthChange() {
        this.loadCurrentUser();
        this.initDropdown(); 
    }
  },
  mounted() {
    this.loadCurrentUser();
    this.initDropdown(); 
    this.$nextTick(() => {
        const modalEl = document.getElementById('profileModal');
        if(modalEl) this.profileModalInstance = new Modal(modalEl);
    });
    eventBus.on("auth-change", this.handleAuthChange); 
    eventBus.on("unauthorized", this.logOut);
  },
  beforeUnmount() {
     if (this.dropdownInstance) this.dropdownInstance.dispose();
     if (this.profileModalInstance) this.profileModalInstance.dispose();
     eventBus.off("auth-change", this.handleAuthChange);
     eventBus.off("unauthorized", this.logOut);
  }
};
</script>

<style scoped>
/* --- 1. CORE LAYOUT --- */
.admin-wrapper {
  display: flex;
  font-family: 'Inter', 'Segoe UI', sans-serif; /* Font hiện đại */
  background-color: #f3f6f9; /* Nền xám xanh rất nhạt - chìa khóa của Light Theme đẹp */
}

/* --- 2. SIDEBAR (TRẮNG SẠCH) --- */
#sidebar {
  width: 260px;
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-right: 1px solid rgba(0,0,0,0.05); /* Viền mờ thay vì shadow đậm */
  box-shadow: 2px 0 10px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid #f3f3f3;
}

.brand-text {
  font-weight: 800;
  font-size: 1.25rem;
  color: #333;
  letter-spacing: -0.5px;
}

.btn-toggle-custom {
  border: none;
  background: #f8f9fa;
  color: #adb5bd;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-toggle-custom:hover {
  color: #0d6efd;
  background: #e7f1ff;
}

.sidebar-menu-wrapper {
  padding: 1rem;
  flex-grow: 1;
  overflow-y: auto;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #a1a5b7;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.nav-link {
  color: #5e6278; /* Màu chữ xám đậm */
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #f5f8fa;
  color: #0d6efd; /* Hover màu xanh */
}

/* Active State - Điểm nhấn của Light Theme */
.nav-link.router-link-active {
  background-color: #eff2f5; /* Nền xám xanh cực nhạt */
  color: #0d6efd; /* Chữ xanh dương */
}

.icon-box {
  width: 24px;
  text-align: center;
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Collapsed State */
.admin-wrapper.sidebar-collapsed #sidebar { width: 80px; }
.admin-wrapper.sidebar-collapsed .nav-text,
.admin-wrapper.sidebar-collapsed .brand-wrapper,
.admin-wrapper.sidebar-collapsed .nav-label { display: none; }
.admin-wrapper.sidebar-collapsed .nav-link { justify-content: center; padding: 1rem 0; }
.admin-wrapper.sidebar-collapsed .icon-box { margin-right: 0; font-size: 1.4rem; }
.admin-wrapper.sidebar-collapsed #main-content { margin-left: 80px; }


/* --- 3. MAIN CONTENT --- */
#main-content {
  flex-grow: 1;
  min-height: 100vh;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  background-color: #f3f6f9; /* Quan trọng: nền xám nhạt để tách biệt card trắng */
}

.navbar-custom {
  height: 70px;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 0 20px rgba(0,0,0,0.02);
}

.avatar-wrapper {
  padding: 2px;
  border: 1px solid #e1e3ea;
  border-radius: 50%;
}

.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-link:hover .avatar-wrapper {
  border-color: #0d6efd;
}

/* --- 4. FORM & MODAL STYLING (LIGHT) --- */
.bg-light-gray {
    background-color: #f9f9f9;
}

.form-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #3f4254;
    margin-bottom: 0.35rem;
}

.form-control {
    background-color: #fff;
    border: 1px solid #e4e6ef;
    color: #181c32;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.form-control:focus {
    border-color: #b5b5c3;
    box-shadow: none; /* Bỏ shadow xanh mặc định bootstrap cho clean */
    background-color: #fcfcfc;
}

.form-control:disabled {
    background-color: #eff2f5;
    border-color: #eff2f5;
    color: #a1a5b7;
}

.profile-avatar-lg {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
}

.error-feedback {
    color: #f1416c;
    font-size: 0.8rem;
    margin-top: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  #sidebar { left: -260px; }
  .admin-wrapper.sidebar-collapsed #sidebar { left: 0; width: 260px; }
  #main-content { margin-left: 0 !important; }
}
</style>