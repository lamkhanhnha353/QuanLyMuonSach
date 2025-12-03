<template>
  <div class="container-fluid pt-2 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-auto">
        <router-link to="/admin/nhanvien" class="btn btn-light shadow-sm rounded-pill px-3 fw-bold text-primary">
          <i class="fas fa-arrow-left me-2"></i> Quay lại
        </router-link>
      </div>
      <div class="col">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Nhân Viên
        </h3>
        <small class="text-muted">Tạo tài khoản mới cho nhân viên</small>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row">
      <!-- Thay đổi từ col-lg-10 thành col-12 để full width -->
      <div class="col-12">
        <!-- Main Card -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <div class="d-flex align-items-center">
              <div class="icon-shape bg-primary text-white rounded-3 me-3 p-2">
                <i class="fas fa-user-plus fa-lg"></i>
              </div>
              <h5 class="mb-0 fw-bold text-secondary">Thông tin đăng ký</h5>
            </div>
          </div>

          <div class="card-body p-4">
            <Form
              @submit="handleRegister"
              :validation-schema="registerSchema"
              v-slot="{ errors }"
              :validate-on-input="true"
            >
              <!-- Hàng 1: Họ tên -->
              <!-- Let's split HoTen and MSNV to save vertical space if it's wide -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Họ & Tên <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.HoTenNV }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-user"></i></span>
                    <Field
                      name="HoTenNV"
                      type="text"
                      class="form-control bg-light border-start-0 ps-0"
                      placeholder="Ví dụ: Nguyễn Văn A"
                    />
                  </div>
                  <ErrorMessage name="HoTenNV" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">MSNV (Tên đăng nhập) <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.MSNV }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-at"></i></span>
                    <Field
                      name="MSNV"
                      type="text"
                      class="form-control bg-light border-start-0 ps-0"
                      placeholder="Nhập mã số nhân viên..."
                    />
                  </div>
                  <ErrorMessage name="MSNV" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Hàng 2: Mật khẩu & Email -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Mật khẩu <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.password }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-lock"></i></span>
                    <Field
                      name="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control bg-light border-start-0 border-end-0 ps-0"
                      placeholder="Mật khẩu ít nhất 6 ký tự"
                    />
                    <button type="button" class="btn btn-light border border-start-0 text-secondary" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Email <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.EMAIL }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-envelope"></i></span>
                    <Field name="EMAIL" type="email" class="form-control bg-light border-start-0 ps-0" placeholder="example@email.com" />
                  </div>
                  <ErrorMessage name="EMAIL" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Hàng 3: CCCD & SĐT -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">CCCD (12 số) <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.CCCD }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-id-card"></i></span>
                    <Field name="CCCD" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="123456789012" />
                  </div>
                  <ErrorMessage name="CCCD" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Số điện thoại <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.SoDienThoai }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-phone"></i></span>
                    <Field name="SoDienThoai" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="09xxxxxxxx" />
                  </div>
                  <ErrorMessage name="SoDienThoai" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Hàng 4: Địa chỉ & Avatar -->
              <div class="row g-3 mb-4">
                 <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Địa chỉ <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.DiaChi }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-map-marker-alt"></i></span>
                    <Field name="DiaChi" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Nhập địa chỉ đầy đủ..." />
                  </div>
                  <ErrorMessage name="DiaChi" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">URL Hình Ảnh (Avatar)</label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.AVATAR }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-image"></i></span>
                    <Field name="AVATAR" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="https://..." />
                  </div>
                  <ErrorMessage name="AVATAR" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-flex justify-content-end pt-2">
                <button type="submit" class="btn btn-primary px-5 py-2 rounded-3 fw-bold shadow-sm button-submit" :disabled="loading">
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </span>
                  <span v-else>
                    <i class="fas fa-save me-2"></i> Lưu Nhân Viên
                  </span>
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div v-if="message" class="toast-overlay">
      <div
        class="toast show align-items-center text-white border-0 shadow-lg"
        :class="isError ? 'bg-danger' : 'bg-success'"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i :class="isError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'" class="me-2"></i>
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

export default {
  name: "NhanVienAdd",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object().shape({
      HoTenNV: yup.string().required("Vui lòng nhập họ tên!"),
      MSNV: yup.string().required("MSNV là bắt buộc!").min(3, "Tối thiểu 3 ký tự"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6, "Tối thiểu 6 ký tự"),
      EMAIL: yup.string().email("Email không hợp lệ").required("Email là bắt buộc!"),
      CCCD: yup.string()
        .required("CCCD là bắt buộc!")
        .length(12, "CCCD phải có đúng 12 số")
        .matches(/^[0-9]+$/, "CCCD chỉ được chứa số"),
      AVATAR: yup.string().url("Phải là một URL hình ảnh hợp lệ").nullable().optional(),
      DiaChi: yup.string().required("Địa chỉ là bắt buộc!"),
      SoDienThoai: yup.string().required("Số điện thoại là bắt buộc!").matches(/^[0-9]{10}$/, "SĐT phải có 10 số"),
    });

    return {
      loading: false,
      message: "",
      isError: false,
      registerSchema,
      showPassword: false,
    };
  },
  methods: {
    async handleRegister(user, { resetForm, setErrors }) {
      this.loading = true;
      this.message = "";
      this.isError = false;

      try {
        // Set default role to "Staff"
        const userData = {
          ...user,
          ChucVu: "Staff"
        };

        await NhanVienService.create(userData);

        this.message = "Thêm nhân viên thành công!";
        this.isError = false;

        resetForm();

        setTimeout(() => {
          this.$router.push('/admin/nhanvien');
        }, 1500);

      } catch (error) {
        this.isError = true;

        if (error.response && error.response.status === 409) {
             this.message = "MSNV đã tồn tại. Vui lòng chọn mã khác.";
             setErrors({ MSNV: 'MSNV đã được sử dụng' });
        } else {
             this.message = error.response?.data?.message || "Lỗi khi thêm nhân viên. Vui lòng thử lại.";
        }

        setTimeout(() => { this.message = "" }, 4000);
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
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

/* Fix Autofill background color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
    -webkit-text-fill-color: #495057 !important;
}

/* Focus State */
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
.input-group:focus-within input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
}

/* Error State */
.input-group.is-invalid-group .input-group-text {
  border-color: #dc3545;
  color: #dc3545;
  background-color: #fff;
}
.input-group.is-invalid-group .form-control,
.input-group.is-invalid-group .form-select,
.input-group.is-invalid-group .btn {
  border-color: #dc3545;
}
.input-group.is-invalid-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* Toast Overlay */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

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