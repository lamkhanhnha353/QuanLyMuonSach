<template>
  <div class="register-wrapper">
    <div class="register-card">
      <div class="form-header">
        <h4 class="text-white mb-0">Đăng Ký Độc Giả</h4>
        <button type="button" class="btn-close btn-close-white" @click="goBackToLogin" title="Đóng"></button>
      </div>
      <div class="form-container">
        
        <Form 
          @submit="handleRegister" 
          :validation-schema="registerSchema"  
          v-slot="{ resetForm }" 
          :validate-on-input="true" 
        >
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-2">
                <label for="HOLOT" class="form-label">Họ</label>
                <Field name="HOLOT" type="text" class="form-control" />
                <ErrorMessage name="HOLOT" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-2">
                <label for="TEN" class="form-label">Tên</label>
                <Field name="TEN" type="text" class="form-control" />
                <ErrorMessage name="TEN" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-2">
                <label for="username" class="form-label">Username</label>
                <Field name="username" type="text" class="form-control" />
                <ErrorMessage name="username" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-2">
                <label for="DIENTHOAI" class="form-label">Điện thoại</label>
                <Field name="DIENTHOAI" type="tel" class="form-control" />
                <ErrorMessage name="DIENTHOAI" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-7">
              <div class="form-group mb-2">
                <label for="NGAYSINH" class="form-label">Ngày sinh</label>
                <Field name="NGAYSINH" type="date" class="form-control date-input" />
                <ErrorMessage name="NGAYSINH" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group mb-2">
                <label for="GIOITINH" class="form-label">Giới tính</label>
                <Field name="GIOITINH" as="select" class="form-select select-input">
                  <option value="" disabled>-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </Field>
                <ErrorMessage name="GIOITINH" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="form-group mb-2"> 
            <label for="password" class="form-label">Password</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div> 

          <div class="form-group mb-3">
            <label for="DIACHI" class="form-label">Địa chỉ</label>
            <Field name="DIACHI" type="text" class="form-control" />
            <ErrorMessage name="DIACHI" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary w-100" :disabled="loading">
              <span>Đăng ký</span>
            </button>
          </div>
          
          <div class="form-group mt-3" v-if="errorMessage">
            <div class="alert alert-danger">
              {{ errorMessage }}
            </div>
          </div>
        </Form>
      </div>
    </div>

    <div v-if="successMessage" class="toast-animated">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
// --- PHẦN SCRIPT ĐÃ THAY ĐỔI ---
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
// 1. ĐỔI IMPORT
import AuthService from "@/services/auth.service";

export default {
  name: "DocGiaRegister",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Cập nhật schema (giữ nguyên)
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
      successMessage: "", // Cho toast
      errorMessage: "",   // Cho alert
      registerSchema,
    };
  },
  methods: {
    goBackToLogin() {
      this.$router.push("/login");
    },
    // 2. CẬP NHẬT HÀM NÀY
    async handleRegister(user, { resetForm }) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = ""; 

      try {
        // 3. DÙNG AUTHSERVICE.REGISTER
        await AuthService.register(user);
        
        this.loading = false;
        this.successMessage = "Đăng ký thành công! Đang chuyển hướng..."; // Hiện toast
        resetForm(); // Xóa form

        // Tự động chuyển trang sau 3.5 giây
        setTimeout(() => {
          this.$router.push("/login");
        }, 700); // 3500ms = 3.5 giây

      } catch (error) {
        this.loading = false;
        this.errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra.";
      }
    },
  },
};
</script>

<style scoped>
/* Layout wrapper & card */
.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 500px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-header h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.btn-close-white {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.btn-close-white:hover {
  opacity: 1;
}

.form-container {
  padding: 30px;
}

/* Toast animation */
@keyframes slideInFromRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  99% { transform: translateX(0); opacity: 1; }
  to { transform: translateX(50px); opacity: 0; }
}

.toast-animated {
  position: fixed;
  top: 80px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: bold;
  animation: slideInFromRight 0.5s ease-out, fadeOut 0.5s ease-in 3s forwards;
}

/* Form styling */
.form-label {
  color: #f8f9fa;
  font-weight: 500;
}

.error-feedback {
  color: #dc3545;
  min-height: 1.5em;
}

.form-control {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.date-input,
.select-input {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.select-input option {
  background-color: #212529;
  color: white;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1); 
}

.form-control:focus,
.date-input:focus,
.select-input:focus {
  background: rgba(0, 0, 0, 0.2) !important;
  border-color: #58a6ff !important;
  box-shadow: 0 0 0 0.25rem rgba(88, 166, 255, 0.25) !important;
  color: white !important;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-text-fill-color: white !important; 
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.05) inset !important;
    background-color: rgba(255, 255, 255, 0.05) !important; 
    transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
}

/* Responsive */
@media (max-width: 576px) {
  .register-card {
    max-width: 100%;
  }

  .form-header {
    padding: 15px 20px;
  }

  .form-container {
    padding: 20px;
  }

  .form-header h4 {
    font-size: 18px;
  }
}
</style>