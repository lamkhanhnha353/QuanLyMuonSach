<template>
  <div class="container-fluid py-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-4">
      <div class="col-auto">
        <router-link to="/staff/nguoidung" class="btn btn-light shadow-sm rounded-pill px-3 fw-bold text-primary">
          <i class="fas fa-arrow-left me-2"></i> Quay lại
        </router-link>
      </div>
      <div class="col">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Thêm</span> Độc Giả Mới
        </h3>
        <small class="text-muted">Nhập thông tin chi tiết để tạo tài khoản độc giả</small>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div class="d-flex align-items-center">
          <div class="icon-shape bg-primary text-white rounded-3 me-3 p-2">
            <i class="fas fa-user-plus fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Thông tin cá nhân</h5>
        </div>
      </div>

      <div class="card-body p-4">
        <Form
          @submit="handleRegister"
          :validation-schema="registerSchema"
          v-slot="{ errors, resetForm }" 
          :validate-on-input="true"
        >
          <!-- Row 1: Họ và Tên -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Họ & Tên lót <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.HOLOT }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-user"></i></span>
                <Field 
                  name="HOLOT" 
                  type="text" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.HOLOT }"
                  placeholder="Ví dụ: Nguyễn Văn" 
                />
              </div>
              <ErrorMessage name="HOLOT" class="text-danger small mt-1" />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Tên <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.TEN }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-signature"></i></span>
                <Field 
                  name="TEN" 
                  type="text" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.TEN }"
                  placeholder="Ví dụ: A" 
                />
              </div>
              <ErrorMessage name="TEN" class="text-danger small mt-1" />
            </div>
          </div>

          <!-- Row 2: Tài khoản -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Tên đăng nhập <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.username }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-at"></i></span>
                <Field 
                  name="username" 
                  type="text" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.username }"
                  placeholder="username123" 
                />
              </div>
              <ErrorMessage name="username" class="text-danger small mt-1" />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Mật khẩu <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.password }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-lock"></i></span>
                <Field
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control bg-light border-start-0 border-end-0 ps-0"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Nhập mật khẩu..."
                  v-model="passwordValue"
                />
                <button 
                  type="button" 
                  class="btn btn-light border border-start-0 text-secondary" 
                  @click="togglePasswordVisibility"
                  tabindex="-1"
                >
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
              <ErrorMessage name="password" class="text-danger small mt-1" />
            </div>
          </div>

          <!-- Row 3: Liên hệ -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Số điện thoại <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.DIENTHOAI }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-phone-alt"></i></span>
                <Field 
                  name="DIENTHOAI" 
                  type="tel" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.DIENTHOAI }"
                  placeholder="0912..." 
                />
              </div>
              <ErrorMessage name="DIENTHOAI" class="text-danger small mt-1" />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted">Ngày sinh <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.NGAYSINH }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-calendar-alt"></i></span>
                <Field 
                  name="NGAYSINH" 
                  type="date" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.NGAYSINH }"
                />
              </div>
              <ErrorMessage name="NGAYSINH" class="text-danger small mt-1" />
            </div>
          </div>

          <!-- Row 4: Giới tính & Địa chỉ -->
          <div class="row g-4 mb-4">
            <div class="col-md-4">
              <label class="form-label fw-semibold text-muted">Giới tính <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.GIOITINH }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-venus-mars"></i></span>
                <Field 
                  name="GIOITINH" 
                  as="select" 
                  class="form-select bg-light border-start-0 ps-0"
                  :class="{ 'is-invalid': errors.GIOITINH }"
                >
                  <option value="" disabled selected>Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Field>
              </div>
              <ErrorMessage name="GIOITINH" class="text-danger small mt-1" />
            </div>
            <div class="col-md-8">
              <label class="form-label fw-semibold text-muted">Địa chỉ <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid-group': errors.DIACHI }">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-map-marker-alt"></i></span>
                <Field 
                  name="DIACHI" 
                  type="text" 
                  class="form-control bg-light border-start-0 ps-0" 
                  :class="{ 'is-invalid': errors.DIACHI }"
                  placeholder="Số nhà, đường, phường/xã..." 
                />
              </div>
              <ErrorMessage name="DIACHI" class="text-danger small mt-1" />
            </div>
          </div>

          <hr class="my-4 text-muted opacity-25">

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-3">
            <button type="button" @click="resetForm" class="btn btn-light px-4 rounded-3 fw-bold text-secondary">
              <i class="fas fa-sync-alt me-2"></i> Làm mới
            </button>
            <button type="submit" class="btn btn-primary px-5 rounded-3 fw-bold shadow-sm button-submit" :disabled="loading">
              <span v-if="!loading">
                <i class="fas fa-save me-2"></i> Lưu Độc Giả
              </span>
              <span v-else>
                <i class="fas fa-spinner fa-spin me-2"></i> Đang xử lý...
              </span>
            </button>
          </div>

        </Form>
      </div>
    </div>

    <!-- TOAST OVERLAY NOTIFICATION -->
    <div v-if="message" class="toast-overlay">
      <div 
        class="toast show align-items-center text-white border-0 shadow-lg" 
        :class="isError ? 'bg-danger' : 'bg-success'"
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i :class="isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'" class="me-2"></i> {{ message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="message = ''" aria-label="Close"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DocGiaService from "@/services/docgia.service";

export default {
  name: "StaffDocGiaAdd",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object().shape({
      username: yup.string().required("Vui lòng nhập tên đăng nhập!"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6, "Mật khẩu ít nhất 6 ký tự"),
      HOLOT: yup.string().required("Họ lót không được để trống!"),
      TEN: yup.string().required("Tên không được để trống!"),
      NGAYSINH: yup.date().required("Vui lòng chọn ngày sinh!").nullable(),
      GIOITINH: yup.string().required("Vui lòng chọn giới tính!"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
      DIENTHOAI: yup
        .string()
        .required("Số điện thoại là bắt buộc!")
        .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ (10 số)"),
    });

    return {
      loading: false,
      message: "",
      isError: false,
      registerSchema,
      showPassword: false,
      passwordValue: '',
    };
  },
  methods: {
    async handleRegister(user, { resetForm }) {
      this.loading = true;
      this.message = "";
      this.isError = false;

      try {
        await DocGiaService.create({
          username: user.username,
          password: user.password,
          HOLOT: user.HOLOT,
          TEN: user.TEN,
          NGAYSINH: user.NGAYSINH,
          GIOITINH: user.GIOITINH,
          DIACHI: user.DIACHI,
          DIENTHOAI: user.DIENTHOAI,
        });
        
        this.message = "Thêm độc giả mới thành công!";
        resetForm();
        
        // Hiện overlay trong 0.7 giây rồi chuyển trang
        setTimeout(() => {
          this.$router.push("/staff/nguoidung");
        }, 900);
        
      } catch (error) {
        this.isError = true;
        this.message = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
        // Ẩn thông báo lỗi sau 3 giây
        setTimeout(() => { this.message = "" }, 3000);
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
/* Custom Style */

.card {
  transition: all 0.3s ease;
}

/* Toast Overlay Styles */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Input Group Styling */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
  transition: border-color 0.2s, color 0.2s;
}

.form-control, .form-select {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  transition: all 0.2s;
}

/* --- FIX AUTOFILL BACKGROUND COLOR (QUAN TRỌNG) --- */
/* Ép màu nền của autofill thành màu xám nhạt #f8f9fa để đồng nhất với icon */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
    -webkit-text-fill-color: #495057 !important;
    transition: background-color 5000s ease-in-out 0s;
}

/* Khi đang focus vào ô input thì đổi autofill sang màu trắng để đồng nhất với trạng thái focus */
.input-group:focus-within input:-webkit-autofill,
.input-group:focus-within select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
}
/* -------------------------------------------------- */

.input-group:focus-within .input-group-text {
  background-color: #fff;
  border-color: #86b7fe;
  color: #0d6efd;
}

.input-group:focus-within .form-control, 
.input-group:focus-within .form-select {
  background-color: #fff;
  border-color: #86b7fe;
  box-shadow: none;
}

.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-radius: 0.375rem;
}

/* Error Handling */
.input-group.is-invalid-group .input-group-text {
  border-color: #dc3545;
  color: #dc3545;
  background-color: #fff;
}

.input-group.is-invalid-group .form-control,
.input-group.is-invalid-group .form-select {
  border-color: #dc3545;
}

.input-group.is-invalid-group .btn {
  border-color: #dc3545;
  color: #dc3545;
}

.input-group.is-invalid-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); 
}
.input-group.is-invalid-group:focus-within .input-group-text,
.input-group.is-invalid-group:focus-within .form-control,
.input-group.is-invalid-group:focus-within .btn {
  border-color: #dc3545; 
}

/* Button animation */
.button-submit {
  transition: transform 0.2s;
}
.button-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
}

.icon-shape {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>