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
                  <!-- Thêm mục Trang chủ vào đây -->
                  <li>
                    <router-link to="/" class="dropdown-item py-2">
                      <i class="fas fa-home me-2 text-primary"></i> Trang chủ
                    </router-link>
                  </li>
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

    <!-- MODAL PROFILE (COMPACT & BEAUTIFUL) -->
    <div 
      class="modal fade" 
      id="profileModal" 
      tabindex="-1" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered"> <!-- Bỏ modal-lg để gọn hơn -->
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          <!-- 1. Header Ảnh bìa -->
          <div class="profile-header-bg">
            <button type="button" class="btn-close-white-custom" data-bs-dismiss="modal">
               <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body px-4 pb-4 pt-0">
            <!-- 2. Avatar Nổi -->
            <div class="text-center" style="margin-top: -50px;">
               <div class="position-relative d-inline-block">
                  <img :src="profileData?.AVATAR || defaultAvatar" class="profile-avatar-lg shadow-sm bg-white" />
                  <span class="badge rounded-pill bg-primary position-absolute bottom-0 end-0 border border-2 border-white">
                    {{ profileData?.ChucVu || 'Admin' }}
                  </span>
               </div>
               <h5 class="fw-bold mt-2 mb-0 text-dark">{{ profileData?.HoTenNV }}</h5>
               <p class="text-muted small mb-3">{{ profileData?.EMAIL }}</p>
            </div>

            <!-- 3. Form Nhập Liệu Gọn Gàng -->
            <div v-if="profileData">
              <Form 
                @submit="handleProfileUpdate" 
                :validation-schema="editSchema" 
                :initial-values="profileData"
                :validate-on-input="true"
              >
                <div class="row g-3">
                    <!-- Hàng 1 -->
                    <div class="col-md-6">
                        <label class="form-label small text-muted fw-bold mb-1">Họ Tên</label>
                        <Field name="HoTenNV" type="text" class="form-control form-control-sm" />
                        <ErrorMessage name="HoTenNV" class="error-feedback" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted fw-bold mb-1">Mã Nhân Viên</label>
                        <Field name="MSNV" type="text" class="form-control form-control-sm bg-light" disabled />
                    </div>

                    <!-- Hàng 2 -->
                    <div class="col-md-6">
                        <label class="form-label small text-muted fw-bold mb-1">Số Điện Thoại</label>
                        <Field name="SoDienThoai" type="text" class="form-control form-control-sm" />
                        <ErrorMessage name="SoDienThoai" class="error-feedback" />
                    </div>
                     <div class="col-md-6">
                        <label class="form-label small text-muted fw-bold mb-1">CCCD</label>
                        <Field name="CCCD" type="text" class="form-control form-control-sm" />
                        <ErrorMessage name="CCCD" class="error-feedback" />
                    </div>

                    <!-- Hàng 3 -->
                    <div class="col-12">
                        <label class="form-label small text-muted fw-bold mb-1">Địa Chỉ</label>
                        <Field name="DiaChi" type="text" class="form-control form-control-sm" />
                        <ErrorMessage name="DiaChi" class="error-feedback" />
                    </div>

                    <!-- Hàng 4 -->
                    <div class="col-12">
                        <label class="form-label small text-muted fw-bold mb-1">Avatar URL</label>
                        <Field name="AVATAR" type="text" class="form-control form-control-sm" placeholder="https://..." />
                    </div>

                    <!-- Hàng 5: Mật khẩu -->
                    <div class="col-12">
                        <label class="form-label small text-warning fw-bold mb-1">Đổi mật khẩu (Tùy chọn)</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0 text-secondary"><i class="fas fa-lock"></i></span>
                            <Field 
                              name="password" 
                              :type="showPassword ? 'text' : 'password'" 
                              class="form-control border-start-0 border-end-0" 
                              placeholder="Nhập mật khẩu mới..." 
                              autocomplete="new-password"
                            />
                            <span 
                              class="input-group-text bg-white border-start-0 text-secondary" 
                              style="cursor: pointer;" 
                              @click="showPassword = !showPassword"
                            >
                                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </span>
                        </div>
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                </div>

                <div class="d-flex justify-content-center mt-4 pt-2">
                   <button type="button" class="btn btn-light rounded-pill px-4 me-2 fw-bold text-secondary" data-bs-dismiss="modal">Hủy</button>
                   <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold" :disabled="profileLoading">
                     <span v-if="profileLoading" class="spinner-border spinner-border-sm me-2"></span>
                     Lưu Thay Đổi
                   </button>
                </div>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION (Góc Phải) -->
    <div v-if="profileMessage" class="toast-overlay">
      <div 
        class="toast show align-items-center text-white bg-success border-0 shadow-lg" 
        role="alert" 
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i class="fas fa-check-circle me-2"></i>
            {{ profileMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="profileMessage = ''"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
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
      showPassword: false, // Trạng thái hiển thị mật khẩu
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
      this.showPassword = false; // Reset trạng thái mật khẩu khi mở modal
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
        
        // Hiển thị thông báo và đóng modal
        this.profileMessage = "Cập nhật hồ sơ thành công!";
        this.profileModalInstance.hide();
        
        // Tự động tắt thông báo sau 3s
        setTimeout(() => {
          this.profileMessage = "";
        }, 3000);

      } catch (error) {
        // Nếu lỗi thì giữ modal để sửa, có thể hiện lỗi ở toast hoặc trong modal tùy ý
        // Ở đây tôi hiển thị Toast lỗi (nếu muốn) hoặc alert đơn giản
        alert(error.response?.data?.message || "Lỗi cập nhật hồ sơ.");
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
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: #f3f6f9;
}

/* --- 2. SIDEBAR --- */
#sidebar {
  width: 260px;
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-right: 1px solid rgba(0,0,0,0.05);
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
  color: #5e6278;
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
  color: #0d6efd;
}

.nav-link.router-link-active {
  background-color: #eff2f5;
  color: #0d6efd;
}

.icon-box {
  width: 24px;
  text-align: center;
  margin-right: 10px;
  font-size: 1.1rem;
}

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
  background-color: #f3f6f9;
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

/* --- 4. FORM & MODAL STYLING (COMPACT) --- */
.profile-header-bg {
    height: 90px;
    background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 12px;
}

.btn-close-white-custom {
    background: rgba(0,0,0,0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
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

.profile-avatar-lg {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
}

.form-control-sm {
    font-size: 0.9rem;
    padding: 0.4rem 0.7rem;
}

.form-control:focus {
    border-color: #b5b5c3;
    box-shadow: none;
    background-color: #fcfcfc;
}

.error-feedback {
    color: #f1416c;
    font-size: 0.75rem;
    margin-top: 2px;
}

/* --- 5. DROPDOWN STYLING (HOVER EFFECT) --- */
.dropdown-menu {
  border-radius: 12px;
  padding: 0.5rem;
  animation: dropdownFadeIn 0.2s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
  border: 1px solid rgba(0,0,0,0.05);
  margin-top: 10px !important;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #5e6278;
  padding: 0.6rem 1rem;
  cursor: pointer; /* Thêm cursor pointer */
}

.dropdown-item:hover {
  background-color: #eff2f5;
  color: #0d6efd;
  transform: translateX(4px);
}

.dropdown-item:hover i {
  color: #0d6efd !important;
  transform: scale(1.1);
}

/* Riêng nút đăng xuất */
.dropdown-item.text-danger:hover {
  background-color: #fff5f8;
  color: #d9214e !important;
}

/* --- 6. TOAST OVERLAY --- */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100; /* Cao hơn modal */
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  #sidebar { left: -260px; }
  .admin-wrapper.sidebar-collapsed #sidebar { left: 0; width: 260px; }
  #main-content { margin-left: 0 !important; }
}
</style>