<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">
      <router-link to="/admin/docgia" class="btn btn-outline-info me-3">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      Cập nhật thông tin Độc Giả
    </h3>

    <div class="card bg-dark text-white" v-if="docgia">
      <div class="card-header">
        <i class="fas fa-edit me-2"></i> Chỉnh sửa: {{ docgia.HOLOT }} {{ docgia.TEN }}
      </div>
      <div class="card-body">
        
        <Form 
          @submit="handleUpdate" 
          :validation-schema="editSchema"
          :initial-values="docgia"
          :validate-on-input="true"
        >
          
          <div class="row">
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="HOLOT" class="form-label">Họ Lót</label>
                <Field name="HOLOT" type="text" class="form-control" />
                <ErrorMessage name="HOLOT" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="TEN" class="form-label">Tên</label>
                <Field name="TEN" type="text" class="form-control" />
                <ErrorMessage name="TEN" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
               <div class="form-group mb-3">
                <label for="username" class="form-label">Username (Không thể đổi)</label>
                <Field name="username" type="text" class="form-control" disabled />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="NGAYSINH" class="form-label">Ngày Sinh</label>
                <Field name="NGAYSINH" type="date" class="form-control" />
                <ErrorMessage name="NGAYSINH" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="GIOITINH" class="form-label">Giới Tính</label>
                <Field name="GIOITINH" as="select" class="form-select">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Field>
                <ErrorMessage name="GIOITINH" class="error-feedback" />
              </div>
            </div>
             <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="DIENTHOAI" class="form-label">Điện Thoại</label>
                <Field name="DIENTHOAI" type="text" class="form-control" />
                <ErrorMessage name="DIENTHOAI" class="error-feedback" />
              </div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="DIACHI" class="form-label">Địa Chỉ</label>
            <Field name="DIACHI" type="text" class="form-control" />
            <ErrorMessage name="DIACHI" class="error-feedback" />
          </div>

          <hr class="border-secondary">
          <h5 class="text-warning">Reset Mật khẩu</h5>

           <div class="form-group mb-3">
            <label for="password" class="form-label">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
            <Field name="password" type="password" class="form-control" autocomplete="new-password" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <hr class="border-secondary">

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <i v-if="!loading" class="fas fa-save me-2"></i>
              Lưu Cập Nhật
            </button>
          </div>

          <div v-if="message" class="alert alert-info mt-3">
            {{ message }}
          </div>
        </Form>
      </div>
    </div>
    <div v-if="!docgia && !loading" class="alert alert-danger">
      Không tìm thấy dữ liệu Độc Giả.
    </div>
    <div v-if="loading && !docgia" class="text-center">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DocGiaService from "@/services/docgia.service";

export default {
  name: "DocGiaEdit",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Validation Schema
    const editSchema = yup.object().shape({
      HOLOT: yup.string().required("Họ lót là bắt buộc!"),
      TEN: yup.string().required("Tên là bắt buộc!"),
      NGAYSINH: yup.date().required("Ngày sinh là bắt buộc!").typeError("Ngày không hợp lệ"),
      GIOITINH: yup.string().required("Giới tính là bắt buộc!"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
      DIENTHOAI: yup.string().required("Điện thoại là bắt buộc!"),
      password: yup.string()
        .min(6, "Mật khẩu mới phải ít nhất 6 ký tự")
        .optional()
        .nullable(),
    });

    return {
      loading: false,
      message: "",
      docgia: null,
      editSchema,
    };
  },
  methods: {
    async getDocGia(id) {
      this.loading = true;
      try {
        const response = await DocGiaService.get(id);
        this.docgia = response.data;
        // Định dạng lại ngày sinh cho input[type=date]
        if (this.docgia.NGAYSINH) {
          this.docgia.NGAYSINH = this.docgia.NGAYSINH.split('T')[0];
        }
      } catch (error) {
        this.message = "Không tìm thấy độc giả này.";
      } finally {
        this.loading = false;
      }
    },

    async handleUpdate(data) {
      this.loading = true;
      this.message = "";
      
      // Nếu password bỏ trống, xóa nó khỏi 'data' để backend không cập nhật
      if (!data.password) {
        delete data.password;
      }
      
      try {
        await DocGiaService.update(this.docgia._id, data);
        this.message = "Cập nhật thông tin độc giả thành công!";
        
        setTimeout(() => {
          this.$router.push('/admin/docgia');
        }, 1500);

      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi cập nhật độc giả.";
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    const id = this.$route.params.id;
    this.getDocGia(id);
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
.form-control[disabled] {
    background-color: #343a40;
}
</style>