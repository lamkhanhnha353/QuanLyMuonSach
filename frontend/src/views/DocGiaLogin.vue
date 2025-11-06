<template>
  <div v-if="successMessage" class="toast-animated">
    {{ successMessage }}
  </div>

  <div class="login-container d-flex align-items-center">
    <div class="row justify-content-center w-100">
      <div class="col-lg-4 col-md-6">
        
        <div class="form-container">
          <h4 class="text-center text-white mb-4">Đăng Nhập Độc Giả</h4>
          
          <Form 
            @submit="handleLogin" 
            :validation-schema="loginSchema" 
            :validate-on-input="true"
          >
            <div class="form-group mb-2">
              <label for="username" class="form-label">Username</label>
              <Field name="username" type="text" class="form-control" />
              <ErrorMessage name="username" class="error-feedback" />
            </div>

            <div class="form-group mb-3"> 
              <label for="password" class="form-label">Password</label>
              <Field name="password" type="password" class="form-control" />
              <ErrorMessage name="password" class="error-feedback" />
            </div>

            <div class="form-group">
              <button class="btn btn-primary w-100" :disabled="loading">
                <span>Đăng nhập</span>
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
    </div>
  </div>
</template>

<script>
// --- PHẦN SCRIPT (Đã cập nhật 1 DÒNG) ---
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

export default {
  name: "DocGiaLogin",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const loginSchema = yup.object().shape({
      username: yup.string().required("Username là bắt buộc!"),
      password: yup.string().required("Password là bắt buộc!"),
    });

    return {
      loading: false,
      successMessage: "", // Cho toast
      errorMessage: "",   // Cho alert
      loginSchema,
    };
  },
  methods: {
    async handleLogin(user) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        const loggedInUser = await AuthService.login(user); 
        
        eventBus.emit("auth-change"); 
        
        this.loading = false;
        
        // 
        // ------------------ SỬA DÒNG NÀY ------------------
        //
        this.successMessage = "Đăng nhập thành công! Xin chào " + loggedInUser.HOLOT + " " + loggedInUser.TEN;
        //
        // --------------------------------------------------
        //
        
        // (Lưu user vào localStorage - đã làm)
        
        // Chuyển về trang chủ sau 3.5 giây
        setTimeout(() => {
          this.$router.push("/");
        }, 3500);

      } catch (error) {
        this.loading = false;
        this.errorMessage = "Username hoặc mật khẩu không đúng.";
      }
    },
  },
};
</script>

<style scoped>
/* PHẦN STYLE GIỮ NGUYÊN
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
.form-label {
  color: #f8f9fa;
  font-weight: 500;
}
.error-feedback {
  color: #dc3545;
  font-weight: bold;
  min-height: 1.5em;
}
.form-control {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}
.form-control:focus {
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
</style>