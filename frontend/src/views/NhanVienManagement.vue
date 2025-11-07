<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">Quản lý Nhân Viên</h3>

    <div class="card bg-dark text-white mb-4">
      <div class="card-header">
        <i class="fas fa-users-cog me-2"></i> Danh sách Nhân Viên
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-hover">
            <thead>
              <tr>
                <th>MSNV</th>
                <th>Họ Tên</th>
                <th>Chức Vụ</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in nhanviens" :key="nv._id">
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.HoTenNV }}</td>
                <td>
                  <span :class="nv.ChucVu === 'Admin' ? 'badge bg-success' : 'badge bg-info'">
                    {{ nv.ChucVu }}
                  </span>
                </td>
                <td>{{ nv.DiaChi }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="handleDelete(nv._id)">
                    <i class="fas fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-user-plus me-2"></i> Thêm Nhân Viên Mới (Đăng ký nội bộ)
      </div>
      <div class="card-body">
        <Form 
          @submit="handleRegister" 
          :validation-schema="registerSchema" 
          v-slot="{ resetForm }"
          :validate-on-input="true"
        >
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
// --- PHẦN SCRIPT GIỮ NGUYÊN ---
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import NhanVienService from "@/services/nhanvien.service";

export default {
  name: "NhanVienManagement",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object().shape({
      MSNV: yup.string().required("MSNV là bắt buộc!"),
      HoTenNV: yup.string().required("Họ tên là bắt buộc!"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6), // Gửi "password" (thường)
      ChucVu: yup.string().required("Chức vụ là bắt buộc!"),
      DiaChi: yup.string().optional(),
      SoDienThoai: yup.string().optional(),
    });

    return {
      nhanviens: [],
      loading: false,
      message: "",
      registerSchema,
    };
  },
  methods: {
    // Lấy danh sách nhân viên
    async retrieveNhanViens() {
      try {
        const response = await NhanVienService.getAll();
        this.nhanviens = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    
    // Xử lý "Đăng ký nội bộ"
    async handleRegister(user, { resetForm }) {
      this.loading = true;
      this.message = "";
      try {
        await NhanVienService.create(user); // user chứa "password" (thường)
        this.message = "Tạo nhân viên mới thành công!";
        resetForm(); // Xóa form
        this.retrieveNhanViens(); // Tải lại bảng
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi tạo nhân viên.";
      } finally {
        this.loading = false;
      }
    },
    
    // Xử lý Xóa
    async handleDelete(id) {
        if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
            try {
                await NhanVienService.delete(id);
                this.retrieveNhanViens(); // Tải lại bảng
            } catch (error) {
                alert("Không thể xóa nhân viên.");
            }
        }
    }
  },
  // Chạy khi trang được tải
  mounted() {
    this.retrieveNhanViens();
  },
};
</script>

<style scoped>
/* PHẦN STYLE GIỮ NGUYÊN
*/
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