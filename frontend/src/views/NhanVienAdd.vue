<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">
      <router-link to="/admin/nhanvien" class="btn btn-outline-info me-3">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      Thêm Nhân Viên Mới
    </h3>

    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-user-plus me-2"></i> Thông tin Nhân Viên
      </div>
      <div class="card-body">
        
        <Form @submit="handleRegister" :validation-schema="registerSchema" :validate-on-input="true">
          
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
                <label for="ChucVu" class="form-label">Chức Vụ</label>
                <Field name="ChucVu" as="select" class="form-select">
                  <option value="" disabled>-- Chọn chức vụ --</option>
                  <option value="Staff">Nhân viên (Staff)</option>
                  <option value="Admin">Quản trị (Admin)</option>
                </Field>
                <ErrorMessage name="ChucVu" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="MSNV" class="form-label">MSNV (Tên đăng nhập)</label>
                <Field name="MSNV" type="text" class="form-control" autocomplete="username" />
                <ErrorMessage name="MSNV" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <Field name="password" type="password" class="form-control" autocomplete="new-password" />
                <ErrorMessage name="password" class="error-feedback" />
              </div>
            </div>
          </div>
          
          <hr class="border-secondary">
          <h5 class="text-info">Thông tin cá nhân (Mới)</h5>

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
          <h5 class="text-info">Thông tin liên hệ (Cũ)</h5>
          
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

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <i v-if="!loading" class="fas fa-user-plus me-2"></i>
              Tạo Nhân Viên
            </button>
          </div>

          <div v-if="message" class="alert alert-info mt-3">
            {{ message }}
          </div>
        </Form>
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
    // Validation Schema (ĐÃ CẬP NHẬT)
    const registerSchema = yup.object().shape({
      MSNV: yup.string().required("MSNV là bắt buộc!"),
      HoTenNV: yup.string().required("Họ tên là bắt buộc!"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6, "Mật khẩu phải ít nhất 6 ký tự"),
      ChucVu: yup.string().required("Chức vụ là bắt buộc!"),
      DiaChi: yup.string().required("Địa chỉ là bắt buộc!"),
      SoDienThoai: yup.string().required("Số điện thoại là bắt buộc!"),
      
      // 3 TRƯỜNG MỚI
      EMAIL: yup.string().email("Email không hợp lệ").required("Email là bắt buộc!"),
      CCCD: yup.string()
        .required("CCCD là bắt buộc!")
        .length(12, "CCCD phải có đúng 12 số")
        .matches(/^[0-9]+$/, "CCCD chỉ được chứa số"),
      AVATAR: yup.string().url("Phải là một URL hình ảnh hợp lệ").nullable().optional(),
    });

    return {
      loading: false,
      message: "",
      registerSchema,
    };
  },
  methods: {
    async handleRegister(user) {
      this.loading = true;
      this.message = "";

      try {
        await NhanVienService.create(user);
        this.message = "Tạo nhân viên mới thành công!";
        setTimeout(() => {
            this.$router.push('/admin/nhanvien'); 
        }, 1500);
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi tạo nhân viên.";
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
/* (Style y hệt các trang Add/Edit khác) */
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
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
</style>