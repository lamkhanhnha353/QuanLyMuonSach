<template>
  <div v-if="successMessage" class="toast-animated toast-success">
    <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
  </div>

  <div v-if="errorMessage" class="toast-animated toast-error">
    <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
  </div>

  <div class="register-container d-flex align-items-center justify-content-center">
    <div class="row justify-content-center w-100">
      <div class="col-10 col-sm-10 col-md-8 col-lg-8">

        <div class="form-container">
          <div class="text-center mb-4">
            <h4 class="mb-1 text-dark">Tạo Tài Khoản</h4>
            <p class="text-secondary-light mb-0">
              Đăng ký để bắt đầu khám phá thư viện.
            </p>
          </div>

          <Form
            @submit="handleRegister"
            :validation-schema="registerSchema"
            v-slot="{ resetForm }"
            :validate-on-input="true"
          >
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Họ</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-user"></i>
                    </span>
                    <Field name="HOLOT" type="text" class="form-control" placeholder="Nhập họ của bạn" />
                  </div>
                  <ErrorMessage name="HOLOT" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Tên</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-user"></i>
                    </span>
                    <Field name="TEN" type="text" class="form-control" placeholder="Nhập tên của bạn" />
                  </div>
                  <ErrorMessage name="TEN" class="error-feedback" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-at"></i>
                    </span>
                    <Field name="username" type="text" class="form-control" placeholder="Chọn tên đăng nhập" />
                  </div>
                  <ErrorMessage name="username" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group-custom password-input">
                    <span class="input-icon">
                      <i class="fa-solid fa-lock"></i>
                    </span>
                    
                    <Field 
                      name="password" 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control" 
                      placeholder="Nhập mật khẩu của bạn"
                      v-model="passwordValue" 
                    />
                    
                    <button v-if="passwordValue" type="button" @click="togglePasswordVisibility" class="password-toggle-btn">
                      <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="error-feedback" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Điện thoại</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-phone"></i>
                    </span>
                    <Field name="DIENTHOAI" type="tel" class="form-control" placeholder="Nhập số điện thoại" />
                  </div>
                  <ErrorMessage name="DIENTHOAI" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-calendar"></i>
                    </span>
                    <Field name="NGAYSINH" type="date" class="form-control date-input" />
                  </div>
                  <ErrorMessage name="NGAYSINH" class="error-feedback" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-5">
                <div class="form-group mb-3">
                  <label class="form-label">Giới tính</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-venus-mars"></i>
                    </span>
                    <Field name="GIOITINH" as="select" class="form-control select-input">
                      <option value="" disabled selected>-- Chọn giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </Field>
                  </div>
                  <ErrorMessage name="GIOITINH" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-7">
                <div class="form-group mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <div class="input-group-custom">
                    <span class="input-icon">
                      <i class="fa-solid fa-map-pin"></i>
                    </span>
                    <Field name="DIACHI" type="text" class="form-control" placeholder="Nhập địa chỉ của bạn" />
                  </div>
                  <ErrorMessage name="DIACHI" class="error-feedback" />
                </div>
              </div>
            </div>
            
            <div class="form-group mt-3"> 
              <button class="btn btn-primary w-100" :disabled="loading">
                <span v-if="!loading">Đăng ký</span>
                <span v-else>Đang xử lý...</span>
              </button>
            </div>

          </Form>

          <div class="text-center mt-3">
            <small class="text-secondary-light">
              Đã có tài khoản?
              <router-link to="/login" class="text-link">Đăng nhập ngay</router-link>
            </small>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/auth.service";

export default {
  name: "DocGiaRegister",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object().shape({
      username: yup.string().required("Username là bắt buộc!"),
      password: yup.string().required("Password là bắt buộc!").min(6),
      HOLOT: yup.string().required("Họ là bắt buộc!"),
      TEN: yup.string().required("Tên là bắt buộc!"),
      NGAYSINH: yup.date().required("Ngày sinh là bắt buộc!"),
      GIOITINH: yup.string().required("Giới tính là bắt buộc!"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
      DIENTHOAI: yup
        .string()
        .required("Điện thoại là bắt buộc!")
        .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 số"),
    });

    return {
      loading: false,
      successMessage: "", 
      errorMessage: "",   
      registerSchema,
      showPassword: false,
      passwordValue: '', // THAY ĐỔI 3: Thêm biến v-model
    };
  },
  methods: {
    goBackToLogin() {
      this.$router.push("/login");
    },
    async handleRegister(user, { resetForm }) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = ""; 

      try {
        await AuthService.register(user);
        
        this.loading = false;
        this.successMessage = "Đăng ký thành công! Đang chuyển hướng..."; 
        resetForm();

        setTimeout(() => {
          this.$router.push("/login");
        }, 700);

      } catch (error) {
        this.loading = false;
        this.errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra.";
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
/* ==== Toast (Giữ nguyên) ==== */
@keyframes slideInFromRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { transform: translateX(50px); opacity: 0; }
}
.toast-animated {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 1000;
  font-weight: bold;
  animation: slideInFromRight 0.5s ease-out, fadeOut 0.5s ease-in 3s forwards;
}

.toast-success {
  background-color: #28a745;
  color: white;
}

.toast-error {
  background-color: #dc3545;
  color: white;
}

/* ==== Layout ==== */
.register-container {
  min-height: 90vh; 
  background-color: #f9fafb; 
  padding: 30px 0; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  background: #ffffff;
  padding: 30px; 
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 10px -4px rgb(0 0 0 / 0.05);
  max-width: 650px; 
  width: 100%;
  margin: 0 auto;
}

/* Tiêu đề */
.text-center h4 {
  font-weight: 700;
  font-size: 28px;
  color: #1a202c;
  margin-bottom: 8px;
}
.text-secondary-light {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;
}
.text-dark {
  color: #1a202c;
}

.form-label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  display: block;
}

/* ==== Input + Icon ==== */
.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 14px;
  color: #9ca3af;
  font-size: 19px;
  min-width: 40px;
  transition: color 0.2s ease;
}

.input-group-custom {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.input-group-custom:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  background-color: #ffffff;
}
.input-group-custom:focus-within .input-icon {
  color: #2563eb;
}

.form-control {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  flex-grow: 1;
  padding: 13px 14px 13px 12px;
  height: 48px;
  font-size: 16px;
  background-color: transparent;
  color: #1a202c;
}

.form-control::placeholder {
  color: #9ca3af;
}

.date-input {
  background-color: transparent !important;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  cursor: pointer;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px !important;
}

.select-input option {
  background-color: #ffffff;
  color: #1a202c;
}

/* Style cho nút show/hide password */
.password-input {
  position: relative;
}

/* THAY ĐỔI 4: Thêm rule này để text không bị cách quá xa icon */
.password-input .form-control {
  padding-right: 0;
}

.password-toggle-btn {
  background: none;
  border: none;
  padding: 0 14px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 19px;
  display: flex; 
  align-items: center; 
  height: 100%; 
  outline: none;
}

.input-group-custom:focus-within .password-toggle-btn {
  color: #2563eb; 
}

/* Error */
.error-feedback {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 6px;
  min-height: 1.2em;
}

/* Button */
.btn-primary {
  background-color: #2563eb;
  border: none;
  font-weight: 600;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.25);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  box-shadow: 0 6px 20px 0 rgba(37, 99, 235, 0.35);
}

.btn-primary:disabled {
  background-color: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

/* Alert */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin: 0;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Link */
.text-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.text-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 767.98px) {
  .form-container {
    padding: 30px 20px; 
  }
  
  .row > [class*="col-md-"] {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
  }

  .text-center h4 {
    font-size: 24px;
  }

  .form-control {
    height: 44px;
    font-size: 15px;
    padding: 12px 12px 12px 12px;
  }
  
  /* Cần override lại padding-right cho password trên mobile */
  .password-input .form-control {
    padding-right: 0;
  }

  .btn-primary {
    padding: 12px;
    font-size: 15px;
  }
}

/* ==== KHẮC PHỤC LỖI AUTOFILL (Thêm vào) ==== */
.form-control:-webkit-autofill,
.form-control:-webkit-autofill:hover, 
.form-control:-webkit-autofill:focus, 
.form-control:-webkit-autofill:active {
    -webkit-text-fill-color: #1a202c; 
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: 0 0 0 1000px #f8fafc inset !important;
}

.input-group-custom:focus-within .form-control:-webkit-autofill {
  box-shadow: 0 0 0 1000px #ffffff inset !important; 
}
</style>