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
        
        <Form @submit="handleRegister" :validation-schema="registerSchema" v-slot="{ resetForm }" :validate-on-input="true">
          
          <div class="row">
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="MSNV" class="form-label">MSNV (Tên đăng nhập)</label>
                <Field name="MSNV" type="text" class="form-control" />
                <ErrorMessage name="MSNV" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="HoTenNV" class="form-label">Họ Tên</label>
                <Field name="HoTenNV" type="text" class="form-control" />
                <ErrorMessage name="HoTenNV" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <Field name="password" type="password" class="form-control" />
                <ErrorMessage name="password" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="DiaChi" class="form-label">Địa chỉ</label>
                <Field name="DiaChi" type="text" class="form-control" />
                <ErrorMessage name="DiaChi" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="SoDienThoai" class="form-label">Điện thoại</label>
                <Field name="SoDienThoai" type="tel" class="form-control" />
                <ErrorMessage name="SoDienThoai" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="ChucVu" class="form-label">Chức Vụ</label>
                <Field name="ChucVu" as="select" class="form-select">
                  <option value="Staff">Nhân viên (Staff)</option>
                  <option value="Admin">Quản trị (Admin)</option>
                </Field>
                <ErrorMessage name="ChucVu" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="form-group text-end">
            <button class="btn btn-primary" :disabled="loading">
              <i class="fas fa-plus-circle me-1"></i> Tạo Mới
            </button>
          </div>
          
          <div class="form-group mt-3" v-if="message">
            <div :class="message.includes('thành công') ? 'alert-success' : 'alert-danger'" class="alert">
              {{ message }}
            </div>
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
    const registerSchema = yup.object().shape({
      MSNV: yup.string().required("MSNV là bắt buộc!"),
      HoTenNV: yup.string().required("Họ tên là bắt buộc!"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6),
      ChucVu: yup.string().required("Chức vụ là bắt buộc!"),
      DiaChi: yup.string().optional(),
      SoDienThoai: yup.string().optional(),
      // Avatar: yup.string().url... // <-- ĐÃ XÓA
    });

    return {
      loading: false,
      message: "",
      registerSchema,
    };
  },
  methods: {
    async handleRegister(user, { resetForm }) {
      this.loading = true;
      this.message = "";

      try {
        // Gửi JSON (đã bỏ FormData)
        await NhanVienService.create(user);
        this.message = "Tạo nhân viên mới thành công!";
        // Chuyển hướng về trang danh sách
        this.$router.push('/admin/nhanvien'); 
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
/* Style cho Card, Form, Table... */
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
.form-label {
  color: #f8f9fa;
}
.error-feedback {
  color: #dc3545;
  font-weight: bold;
}
.form-select option {
  background-color: #212529;
  color: white;
}
</style>