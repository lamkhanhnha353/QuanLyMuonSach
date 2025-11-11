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
        <li class="nav-item">
          <router-link to="/admin/nhaxuatban" class="nav-link">
            <i class="fas fa-building"></i>
            <span class="sidebar-text">Quản lý NXB</span>
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

    <div 
      class="modal fade" 
      id="profileModal" 
      tabindex="-1" 
      aria-labelledby="profileModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="profileModalLabel">Thông tin cá nhân</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            <div v-if="profileData">
              <Form 
                @submit="handleProfileUpdate" 
                :validation-schema="editSchema" 
                :initial-values="profileData"
                :validate-on-input="true"
              >
                
                 <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="HoTenNV" class="form-label">Họ Tên</label>
                      <Field name="HoTenNV" type="text" class="form-control" />
                      <ErrorMessage name="HoTenNV" class="error-feedback" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="ChucVu" class="form-label">Chức Vụ (Không thể đổi)</label>
                      <Field name="ChucVu" as="select" class="form-select" disabled>
                        <option value="Staff">Nhân viên (Staff)</option>
                        <option value="Admin">Quản trị (Admin)</option>
                      </Field>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="MSNV" class="form-label">MSNV (Không thể đổi)</label>
                  <Field name="MSNV" type="text" class="form-control" disabled />
                </div>
                <hr class="border-secondary">
                <h5 class="text-info">Thông tin cá nhân</h5>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="EMAIL" class="form-label">Email</label>
                      <Field name="EMAIL" type="email" class="form-control" />
                      <ErrorMessage name="EMAIL" class="error-feedback" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="CCCD" class="form-label">CCCD (12 số)</label>
                      <Field name="CCCD" type="text" class="form-control" />
                      <ErrorMessage name="CCCD" class="error-feedback" />
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="AVATAR" class="form-label">URL Hình Ảnh (Avatar)</label>
                  <Field name="AVATAR" type="text" class="form-control" placeholder="https://..." />
                  <ErrorMessage name="AVATAR" class="error-feedback" />
                </div>
                <hr class="border-secondary">
                <h5 class="text-info">Thông tin liên hệ</h5>
                <div class="row">
                  <div class="col-md-8">
                    <div class="form-group mb-3">
                      <label for="DiaChi" class="form-label">Địa Chỉ</label>
                      <Field name="DiaChi" type="text" class="form-control" />
                      <ErrorMessage name="DiaChi" class="error-feedback" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label for="SoDienThoai" class="form-label">Số Điện Thoại</label>
                      <Field name="SoDienThoai" type="text" class="form-control" />
                      <ErrorMessage name="SoDienThoai" class="error-feedback" />
                    </div>
                  </div>
                </div>
                <hr class="border-secondary">
                <h5 class="text-warning">Reset Mật khẩu</h5>
                <div class="form-group mb-3">
                  <label for="password" class="form-label">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
                  <Field name="password" type="password" class="form-control" autocomplete="new-password" />
                  <ErrorMessage name="password" class="error-feedback" />
                </div>
                <hr class="border-secondary">

                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                  <button type="submit" class="btn btn-primary" :disabled="profileLoading">
                    <span v-if="profileLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-if="!profileLoading" class="fas fa-save me-2"></i>
                    Lưu Cập Nhật
                  </button>
                </div>

                <div v-if="profileMessage" class="alert alert-info mt-3">
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
      CCCD: yup.string()
        .required("CCCD là bắt buộc!")
        .length(12, "CCCD phải có đúng 12 số")
        .matches(/^[0-9]+$/, "CCCD chỉ được chứa số"),
      AVATAR: yup.string().url("Phải là một URL hình ảnh hợp lệ").nullable().optional(),
      password: yup.string()
        .min(6, "Mật khẩu mới phải ít nhất 6 ký tự")
        .optional()
        .nullable(),
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
          if (this.dropdownInstance) {
            this.dropdownInstance.dispose();
          }
          this.dropdownInstance = new Dropdown(dropdownToggleEl);
        }
      });
    },

    openProfileModal() {
      this.profileData = AuthService.getCurrentUser();
      this.profileMessage = ""; 
      if (this.profileModalInstance) {
        this.profileModalInstance.show();
      }
    },

    // *** HÀM ĐÃ SỬA LỖI ***
    async handleProfileUpdate(data) {
      this.profileLoading = true;
      this.profileMessage = "";

      if (!data.password) {
        delete data.password;
      }

      try {
        const response = await NhanVienService.update(this.profileData._id, data);
        
        // <<< FIX LỖI NẰM Ở ĐÂY >>>
        // Dữ liệu trả về nằm trong response.data.data.value
        const updatedUser = response.data.data.value; 

        if (updatedUser) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            eventBus.emit("auth-change"); // Báo cho navbar cập nhật avatar/tên
            this.profileData = updatedUser; // Cập nhật lại data cho form
        }

        this.profileMessage = "Cập nhật thông tin thành công!";
        
        setTimeout(() => {
          this.profileModalInstance.hide();
        }, 1500);

      } catch (error) {
        this.profileMessage = error.response?.data?.message || "Lỗi khi cập nhật.";
      } finally {
        this.profileLoading = false;
      }
    },

    // *** HÀM MỚI ĐỂ SỬA LỖI EVENTBUS ***
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
        if(modalEl) {
            this.profileModalInstance = new Modal(modalEl);
        }
    });

    // SỬA LỖI: Dùng hàm có tên
    eventBus.on("auth-change", this.handleAuthChange); 
    eventBus.on("unauthorized", this.logOut);
  },
  beforeUnmount() {
     if (this.dropdownInstance) {
        this.dropdownInstance.dispose();
     }
     if (this.profileModalInstance) {
        this.profileModalInstance.dispose();
     }
     // SỬA LỖI: Hủy đúng hàm
     eventBus.off("auth-change", this.handleAuthChange);
     eventBus.off("unauthorized", this.logOut);
  }
};
</script>

<style scoped>
/* (Toàn bộ style giữ nguyên) */
.admin-wrapper { display: flex; }
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
.admin-wrapper.sidebar-collapsed #sidebar { width: 70px; }
.admin-wrapper.sidebar-collapsed .sidebar-text,
.admin-wrapper.sidebar-collapsed .sidebar-header .ms-2 { display: none; }
.admin-wrapper.sidebar-collapsed .sidebar-header button { justify-content: center; }
.admin-wrapper.sidebar-collapsed .nav-link { justify-content: center; }
.sidebar-header {
  height: 56px; 
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar-header button { width: 100%; display: flex; align-items: center; }
.sidebar-header button .fas { width: 30px; text-align: center; }
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
#main-content {
  flex-grow: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out; 
  margin-left: 250px; 
}
.admin-wrapper.sidebar-collapsed #main-content { margin-left: 70px; }
#main-content .navbar {
    height: 56px; 
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.bg-secondary-dark { background-color: #212529; }
main { padding: 20px; }
.avatar-nav {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #495057;
  margin-left: 0.5rem; 
}
.dropdown-menu-dark {
  background-color: #343a40;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.dropdown-item {
  color: #f8f9fa;
}
.dropdown-item:hover {
  background-color: #495057;
}
.dropdown-item.text-danger:hover {
  background-color: #dc3545;
  color: #fff;
}
.form-control, .form-select {
  background-color: #212529;
  color: #fff;
  border: 1px solid #495057;
}
.form-control:focus, .form-select:focus {
  background-color: #212529;
  color: #fff;
  border-color: #58a6ff;
  box-shadow: 0 0 0 0.25rem rgba(88, 166, 255, 0.25);
}
.error-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
.form-control[disabled], .form-select[disabled] {
    background-color: #343a40;
}
</style>