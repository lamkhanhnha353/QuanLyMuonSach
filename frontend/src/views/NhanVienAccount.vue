<template>
  <div class="account-page-wrapper">
    <!-- Loading State -->
    <div v-if="loading && !nhanvien" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="nhanvien" class="container py-4">
      <!-- Page Header -->
      <div class="mb-3 text-center">
        <h3 class="fw-bold text-dark mb-1">Cài đặt tài khoản</h3>
        <p class="text-muted small">Cập nhật thông tin cá nhân và mật khẩu của bạn</p>
      </div>

      <div class="row justify-content-center">
        <!-- CENTER COLUMN: ACTIONS (TABS) -->
        <!-- Thu hẹp chiều ngang: col-md-8 col-lg-6 -->
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <!-- Navigation Tabs -->
            <div class="card-header bg-white border-bottom-0 p-3 pb-0">
               <ul class="nav nav-pills nav-fill bg-light p-1 rounded-3">
                  <li class="nav-item">
                    <a 
                      class="nav-link rounded-3 fw-bold py-2 small" 
                      :class="{ active: activeTab === 'info' }" 
                      href="#" 
                      @click.prevent="activeTab = 'info'"
                    >
                      <i class="fas fa-user-edit me-2"></i>Thông tin
                    </a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link rounded-3 fw-bold py-2 small" 
                      :class="{ active: activeTab === 'password' }" 
                      href="#" 
                      @click.prevent="activeTab = 'password'"
                    >
                      <i class="fas fa-lock me-2"></i>Mật khẩu
                    </a>
                  </li>
               </ul>
            </div>

            <div class="card-body p-4">
              <!-- TAB 1: UPDATE INFO -->
              <transition name="fade" mode="out-in">
                <div v-if="activeTab === 'info'" key="info">
                   
                   <!-- Mini Header trong Form -->
                   <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                      <div class="me-3">
                          <img :src="nhanvien.AVATAR || defaultAvatar" class="rounded-circle shadow-sm" width="50" height="50" style="object-fit: cover;" @error="$event.target.src = defaultAvatar">
                      </div>
                      <div>
                          <h6 class="fw-bold text-dark mb-0">{{ nhanvien.HoTenNV }}</h6>
                          <div class="d-flex align-items-center gap-2">
                             <span class="badge bg-primary-subtle text-primary rounded-pill px-2" style="font-size: 0.7rem;">{{ nhanvien.ChucVu }}</span>
                             <small class="text-muted" style="font-size: 0.75rem;">MSNV: {{ nhanvien.MSNV }}</small>
                          </div>
                      </div>
                   </div>

                   <Form @submit="handleUpdateInfo" :validation-schema="infoSchema" :initial-values="nhanvien" v-slot="{ errors }">
                      <div class="row g-3">
                          <div class="col-md-6">
                             <label class="form-label fw-semibold text-secondary small">Họ và tên</label>
                             <Field name="HoTenNV" type="text" class="form-control form-control-sm bg-light border-0" :class="{ 'is-invalid': errors.HoTenNV }" />
                             <ErrorMessage name="HoTenNV" class="invalid-feedback" />
                          </div>
                          <div class="col-md-6">
                             <label class="form-label fw-semibold text-secondary small">Số điện thoại</label>
                             <Field name="SoDienThoai" type="text" class="form-control form-control-sm bg-light border-0" :class="{ 'is-invalid': errors.SoDienThoai }" />
                             <ErrorMessage name="SoDienThoai" class="invalid-feedback" />
                          </div>
                          <div class="col-md-6">
                             <label class="form-label fw-semibold text-secondary small">Email</label>
                             <Field name="EMAIL" type="email" class="form-control form-control-sm bg-light border-0" :class="{ 'is-invalid': errors.EMAIL }" />
                             <ErrorMessage name="EMAIL" class="invalid-feedback" />
                          </div>
                          <div class="col-md-6">
                             <label class="form-label fw-semibold text-secondary small">CCCD</label>
                             <Field name="CCCD" type="text" class="form-control form-control-sm bg-light border-0" :class="{ 'is-invalid': errors.CCCD }" />
                             <ErrorMessage name="CCCD" class="invalid-feedback" />
                          </div>
                          <div class="col-12">
                             <label class="form-label fw-semibold text-secondary small">Địa chỉ</label>
                             <Field name="DiaChi" type="text" class="form-control form-control-sm bg-light border-0" :class="{ 'is-invalid': errors.DiaChi }" />
                             <ErrorMessage name="DiaChi" class="invalid-feedback" />
                          </div>
                          <div class="col-12">
                             <label class="form-label fw-semibold text-secondary small">Avatar URL</label>
                             <Field name="AVATAR" type="text" class="form-control form-control-sm bg-light border-0" placeholder="https://..." :class="{ 'is-invalid': errors.AVATAR }" />
                             <ErrorMessage name="AVATAR" class="invalid-feedback" />
                          </div>
                      </div>

                      <div class="d-flex justify-content-end mt-4 pt-3 border-top">
                          <button type="submit" class="btn btn-primary btn-sm px-4 rounded-3 fw-bold shadow-sm button-save" :disabled="loading">
                             <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                             <i class="fas fa-save me-2"></i>Lưu thay đổi
                          </button>
                      </div>
                   </Form>
                </div>

                <!-- TAB 2: CHANGE PASSWORD -->
                <div v-else key="password">
                   <div class="text-center mb-4">
                      <div class="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style="width: 50px; height: 50px;">
                        <i class="fas fa-shield-alt text-primary fa-lg"></i>
                      </div>
                      <h6 class="fw-bold">Bảo mật & Mật khẩu</h6>
                      <p class="text-muted small">Nhập mật khẩu hiện tại để xác thực.</p>
                   </div>
                   
                   <Form @submit="handleChangePassword" :validation-schema="passwordSchema" v-slot="{ errors }">
                      <div class="mb-3">
                         <label class="form-label fw-semibold text-secondary small">Mật khẩu hiện tại</label>
                         <div class="input-group input-group-sm">
                            <Field name="currentPassword" :type="showCurrentPassword ? 'text' : 'password'" class="form-control bg-light border-0" :class="{ 'is-invalid': errors.currentPassword }" placeholder="Nhập mật khẩu cũ" />
                            <button type="button" class="btn btn-light border-0 text-secondary" @click="showCurrentPassword = !showCurrentPassword">
                               <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <ErrorMessage name="currentPassword" class="invalid-feedback d-block m-0 mt-1" />
                         </div>
                      </div>

                      <div class="row g-3">
                         <div class="col-md-6">
                            <label class="form-label fw-semibold text-secondary small">Mật khẩu mới</label>
                            <div class="input-group input-group-sm">
                               <Field name="password" :type="showNewPassword ? 'text' : 'password'" class="form-control bg-light border-0" :class="{ 'is-invalid': errors.password }" placeholder="Min 6 ký tự" />
                               <button type="button" class="btn btn-light border-0 text-secondary" @click="showNewPassword = !showNewPassword">
                                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                               </button>
                               <ErrorMessage name="password" class="invalid-feedback d-block m-0 mt-1" />
                            </div>
                         </div>
                         <div class="col-md-6">
                            <label class="form-label fw-semibold text-secondary small">Xác nhận mật khẩu</label>
                            <div class="input-group input-group-sm">
                               <Field name="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-control bg-light border-0" :class="{ 'is-invalid': errors.confirmPassword }" placeholder="Nhập lại" />
                               <button type="button" class="btn btn-light border-0 text-secondary" @click="showConfirmPassword = !showConfirmPassword">
                                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                               </button>
                               <ErrorMessage name="confirmPassword" class="invalid-feedback d-block m-0 mt-1" />
                            </div>
                         </div>
                      </div>

                      <div class="d-flex justify-content-end mt-4 pt-3 border-top">
                          <button type="submit" class="btn btn-primary btn-sm px-4 rounded-3 fw-bold shadow-sm button-save" :disabled="loading">
                             <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                             <i class="fas fa-key me-2"></i>Đổi mật khẩu
                          </button>
                      </div>
                   </Form>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div v-if="message" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div 
        class="toast show align-items-center text-white border-0 shadow" 
        :class="messageType === 'success' ? 'bg-success' : 'bg-danger'" 
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body fw-medium small">
             <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-2"></i>
             {{ message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="message = ''"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NhanVienService from "@/services/nhanvien.service";
import AuthService from "@/services/auth.service";

export default {
  name: "NhanVienAccount",
  components: { Form, Field, ErrorMessage },
  data() {
    const infoSchema = yup.object().shape({
      HoTenNV: yup.string().required("Họ tên không được để trống"),
      EMAIL: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
      DiaChi: yup.string().required("Địa chỉ là bắt buộc"),
      SoDienThoai: yup.string().required("Số điện thoại là bắt buộc"),
      CCCD: yup.string().required("CCCD là bắt buộc").matches(/^[0-9]+$/, "Chỉ chứa số").min(9, "CCCD không hợp lệ"),
      AVATAR: yup.string().url("URL không hợp lệ").nullable().optional(),
    });

    const passwordSchema = yup.object().shape({
      currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
      password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu mới là bắt buộc"),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required("Vui lòng xác nhận mật khẩu")
    });

    return {
      loading: false,
      message: "",
      messageType: "success",
      nhanvien: null,
      activeTab: "info", // Mặc định vào tab Thông tin
      
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      
      infoSchema,
      passwordSchema,
      defaultAvatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF2YXRhcjwvdGV4dD48L3N2Zz4=",
    };
  },
  methods: {
    async getNhanVien() {
      this.loading = true;
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return;
        const response = await NhanVienService.get(user._id);
        this.nhanvien = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async handleUpdateInfo(data) {
        this.loading = true;
        this.message = "";
        try {
            const updateData = {
                ...this.nhanvien,
                HoTenNV: data.HoTenNV,
                EMAIL: data.EMAIL,
                DiaChi: data.DiaChi,
                SoDienThoai: data.SoDienThoai,
                CCCD: data.CCCD,
                AVATAR: data.AVATAR,
            };
            await NhanVienService.update(this.nhanvien._id, updateData);
            this.message = "Cập nhật hồ sơ thành công!";
            this.messageType = "success";
            this.nhanvien = updateData; 
            
            setTimeout(() => { this.message = ""; }, 3000);
        } catch (error) {
            this.message = "Lỗi khi cập nhật thông tin.";
            this.messageType = "danger";
        } finally {
            this.loading = false;
        }
    },

    async handleChangePassword(data, { resetForm }) {
        this.loading = true;
        this.message = "";
        try {
            const loginData = { MSNV: this.nhanvien.MSNV, password: data.currentPassword };
            await AuthService.loginNhanVien(loginData);

            const updateData = { password: data.password };
            await NhanVienService.update(this.nhanvien._id, updateData);

            this.message = "Đổi mật khẩu thành công!";
            this.messageType = "success";

            resetForm();
            this.showCurrentPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;

            setTimeout(() => { this.message = ""; }, 3000);
        } catch (error) {
            this.message = "Mật khẩu hiện tại không chính xác.";
            this.messageType = "danger";
        } finally {
            this.loading = false;
        }
    },
  },
  mounted() {
    this.getNhanVien();
  }
};
</script>

<style scoped>
.account-page-wrapper {
  background-color: #f8f9fc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* TABS STYLING */
.nav-pills .nav-link {
    color: #6c757d;
    transition: all 0.2s;
}
.nav-pills .nav-link.active {
    background-color: #fff;
    color: #4f46e5;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* FORM STYLES */
.form-control:focus {
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    color: #1f2937;
}

.btn-primary {
    background-color: #4f46e5;
    border-color: #4f46e5;
    transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) {
    background-color: #4338ca;
    border-color: #4338ca;
    transform: translateY(-1px);
}
.button-save:hover {
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
}

/* TRANSITION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}
</style>