<template>
  <div v-if="successMessage" class="toast-animated">
    {{ successMessage }}
  </div>

  <div class="login-container d-flex align-items-center">
    <div class="row justify-content-center w-100">
      
      <div class="col-10 col-sm-8 col-md-6 col-lg-4">
        
        <div class="form-container">
          <h4 class="text-center text-white mb-4">Đăng Nhập</h4>
          
          <ul class="nav nav-pills nav-fill mb-3">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ 'active': activeTab === 'docgia' }" 
                @click="activeTab = 'docgia'"
              >
                Độc Giả
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ 'active': activeTab === 'nhanvien' }" 
                @click="activeTab = 'nhanvien'"
              >
                Nhân Viên
              </a>
            </li>
          </ul>

          <Form 
            v-if="activeTab === 'docgia'"
            @submit="handleDocGiaLogin" 
            :validation-schema="docGiaLoginSchema" 
            :validate-on-input="true"
          >
            <div class="form-group mb-3">
              <Field 
                name="username" 
                type="text" 
                class="form-control" 
                placeholder="Username" 
              />
              <ErrorMessage name="username" class="error-feedback" />
            </div>
            <div class="form-group mb-3"> 
              <Field 
                name="password" 
                type="password" 
                class="form-control" 
                placeholder="Password"
              />
              <ErrorMessage name="password" class="error-feedback" />
            </div>
            <div class="form-group mt-4">
              <button class="btn btn-primary w-100" :disabled="loading">
                <span>Đăng nhập (Độc Giả)</span>
              </button>
            </div>
          </Form>

          <Form 
            v-if="activeTab === 'nhanvien'"
            @submit="handleNhanVienLogin" 
            :validation-schema="nhanVienLoginSchema" 
            :validate-on-input="true"
          >
            <div class="form-group mb-3">
              <Field 
                name="MSNV" 
                type="text" 
                class="form-control" 
                placeholder="Mã Số Nhân Viên (MSNV)"
              />
              <ErrorMessage name="MSNV" class="error-feedback" />
            </div>
            <div class="form-group mb-3"> 
              <Field 
                name="password" 
                type="password" 
                class="form-control" 
                placeholder="Password"
              />
              <ErrorMessage name="password" class="error-feedback" />
            </div>
            <div class="form-group mt-4">
              <button class="btn btn-primary w-100" :disabled="loading">
                <span>Đăng nhập (Nhân Viên)</span>
              </button>
            </div>
          </Form>

          <div class="form-group mt-3" v-if="errorMessage">
            <div class="alert alert-danger">
              {{ errorMessage }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// --- PHẦN SCRIPT GIỮ NGUYÊN ---
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Schema cho Độc Giả
    const docGiaLoginSchema = yup.object().shape({
      username: yup.string().required("Username là bắt buộc!"),
      password: yup.string().required("Password là bắt buộc!"),
    });

    // Schema cho Nhân Viên
    const nhanVienLoginSchema = yup.object().shape({
      MSNV: yup.string().required("MSNV là bắt buộc!"),
      password: yup.string().required("Password là bắt buộc!"),
    });

    return {
      activeTab: 'docgia', // Tab mặc định
      loading: false,
      successMessage: "", // Cho toast
      errorMessage: "",   // Cho alert
      docGiaLoginSchema,
      nhanVienLoginSchema,
    };
  },
  methods: {
    // Logic Đăng nhập ĐỘC GIẢ
    async handleDocGiaLogin(user) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        const loggedInUser = await AuthService.login(user); 
        eventBus.emit("auth-change"); 
        this.loading = false;
        this.successMessage = "Đăng nhập thành công! Xin chào " + loggedInUser.HOLOT + " " + loggedInUser.TEN;
        
        setTimeout(() => {
          this.$router.push("/");
        }, 3500);

      } catch (error) {
        this.loading = false;
        this.errorMessage = "Username hoặc mật khẩu không đúng.";
      }
    },

    // Logic Đăng nhập NHÂN VIÊN
    async handleNhanVienLogin(staff) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        const loggedInStaff = await AuthService.loginNhanVien(staff); 
        eventBus.emit("auth-change");
        this.loading = false;
        this.successMessage = "Đăng nhập thành công! Xin chào " + loggedInStaff.HoTenNV;
        
        // Đẩy Admin về trang Quản Trị
        setTimeout(() => {
          this.$router.push("/admin"); 
        }, 3500);

      } catch (error) {
        this.loading = false;
        this.errorMessage = "MSNV hoặc mật khẩu không đúng.";
      }
    },
  },
};
</script>

<style scoped>
/*
  PHẦN STYLE (Đã sửa .error-feedback)
*/
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  font-weight: bold;
  animation: slideInFromRight 0.5s ease-out, fadeOut 0.5s ease-in 3s forwards;
}
.login-container {
  min-height: 85vh; 
}
.form-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px); 
  padding: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

/* FIX: SỬA LỖI KHOẢNG CÁCH */
.error-feedback {
  color: #dc3545;
  font-weight: bold;
  margin-top: 4px;
  margin-bottom: 0;
  min-height: 0;
}

/* CSS CHO TAB (Giữ nguyên) */
.nav-pills .nav-link {
  color: #f8f9fa;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
}
.nav-pills .nav-link.active {
  color: #fff;
  background-color: rgba(0, 123, 255, 0.5);
  border-color: #007bff;
}
.nav-pills .nav-link:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* CSS CHO INPUT (STYLE VIỀN DƯỚI) - Giữ nguyên */
.form-control {
  background: transparent !important; 
  border: none !important; 
  border-bottom: 2px solid rgba(255, 255, 255, 0.3) !important; 
  border-radius: 0 !important; 
  color: white !important;
  padding-left: 0;
}
.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
  opacity: 1;
}
.form-control:focus {
  background: transparent !important; 
  border-color: #58a6ff !important; 
  box-shadow: none !important; 
  color: white !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-text-fill-color: white !important; 
    -webkit-box-shadow: none !important; 
    transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
    background-color: transparent !important; 
}
</style>