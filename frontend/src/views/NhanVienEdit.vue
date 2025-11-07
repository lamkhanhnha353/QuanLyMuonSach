<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">
      <router-link to="/admin/nhanvien" class="btn btn-outline-info me-3">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      Cập nhật thông tin Nhân Viên
    </h3>

    <div class="card bg-dark text-white" v-if="nhanVien">
      <div class="card-header">
        <i class="fas fa-edit me-2"></i> Chỉnh sửa: {{ nhanVien.HoTenNV }}
      </div>
      <div class="card-body">
        
        <Form 
          @submit="handleUpdate" 
          :validation-schema="editSchema" 
          :initial-values="nhanVien"
          :validate-on-input="true"
        >
          
          <div class="row">
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="MSNV" class="form-label">MSNV (Tên đăng nhập)</label>
                <Field 
                  name="MSNV" 
                  type="text" 
                  class="form-control" 
                  disabled 
                />
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
                <label for="ChucVu" class="form-label">Chức Vụ</label>
                <Field name="ChucVu" as="select" class="form-select">
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
                <label for="DiaChi" class="form-label">Địa chỉ</label>
                <Field name="DiaChi" type="text" class="form-control" />
                <ErrorMessage name="DiaChi" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="SoDienThoai" class="form-label">Điện thoại</label>
                <Field name="SoDienThoai" type="tel" class="form-control" />
                <ErrorMessage name="SoDienThoai" class="error-feedback" />
              </div>
            </div>
            
            </div>

          <div class="form-group text-end">
            <button class="btn btn-primary" :disabled="loading">
              <i class="fas fa-save me-1"></i> Cập nhật
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
    
    <div v-else class="text-center text-white">
      <p>Đang tải dữ liệu...</p>
    </div>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NhanVienService from "@/services/nhanvien.service";

export default {
  name: "NhanVienEdit",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Schema (không cần mật khẩu)
    const editSchema = yup.object().shape({
      MSNV: yup.string().required("MSNV là bắt buộc!"),
      HoTenNV: yup.string().required("Họ tên là bắt buộc!"),
      ChucVu: yup.string().required("Chức vụ là bắt buộc!"),
      DiaChi: yup.string().optional(),
      SoDienThoai: yup.string().optional(),
    });

    return {
      nhanVien: null, // Dữ liệu sẽ được fetch
      loading: false,
      message: "",
      editSchema,
    };
  },
  methods: {
    // 1. Hàm tải dữ liệu nhân viên
    async getNhanVien(id) {
        try {
            const response = await NhanVienService.get(id);
            this.nhanVien = response.data;
        } catch (error) {
            console.error(error);
            this.message = "Không tìm thấy nhân viên.";
        }
    },

    // 2. Hàm xử lý Cập nhật
    async handleUpdate(data) {
      this.loading = true;
      this.message = "";

      try {
        // Dùng 'this.nhanVien._id' để biết update ai
        // Dùng 'data' (từ form) để gửi dữ liệu mới
        await NhanVienService.update(this.nhanVien._id, data);
        this.message = "Cập nhật thông tin nhân viên thành công!";
        
        // Chuyển về trang danh sách sau 2 giây
        setTimeout(() => {
             this.$router.push('/admin/nhanvien'); 
        }, 2000);

      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi cập nhật.";
      } finally {
        this.loading = false;
      }
    },
  },
  // 3. Tải dữ liệu khi trang được mở
  mounted() {
      // Lấy 'id' từ URL (vd: /admin/nhanvien/edit/ABC)
      const id = this.$route.params.id;
      this.getNhanVien(id);
  }
};
</script>

<style scoped>
/* Style (giống hệt NhanVienAdd) */
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.form-control, .form-select {
  background-color: #212529;
  color: #fff;
  border: 1px solid #495057;
}
/* Style cho ô 'disabled' (MSNV) */
.form-control:disabled {
    background-color: #495057;
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