<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">
      <router-link to="/admin/sach" class="btn btn-outline-info me-3">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      Cập nhật thông tin Sách
    </h3>

    <div class="card bg-dark text-white" v-if="book">
      <div class="card-header">
        <i class="fas fa-edit me-2"></i> Chỉnh sửa: {{ book.TENSACH }}
      </div>
      <div class="card-body">
        
        <Form 
          @submit="handleUpdate" 
          :validation-schema="bookSchema" 
          :initial-values="book"
          :validate-on-input="true"
        >
          
          <div class="row">
            <div class="col-md-8">
              <div class="form-group mb-3">
                <label for="TENSACH" class="form-label">Tên Sách</label>
                <Field name="TENSACH" type="text" class="form-control" />
                <ErrorMessage name="TENSACH" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group mb-3">
                <label for="MANXB" class="form-label">Mã Nhà Xuất Bản</label>
                <Field name="MANXB" type="text" class="form-control" />
                <ErrorMessage name="MANXB" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="TACGIA" class="form-label">Tác Giả</label>
                <Field name="TACGIA" type="text" class="form-control" />
                <ErrorMessage name="TACGIA" class="error-feedback" />
              </div>
            </div>
             <div class="col-md-3">
              <div class="form-group mb-3">
                <label for="NAMXUATBAN" class="form-label">Năm XB</label>
                <Field name="NAMXUATBAN" type="number" class="form-control" />
                <ErrorMessage name="NAMXUATBAN" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group mb-3">
                <label for="SOQUYEN" class="form-label">Số Quyển</label>
                <Field name="SOQUYEN" type="number" class="form-control" />
                <ErrorMessage name="SOQUYEN" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
             <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="DONGIA" class="form-label">Đơn Giá (VNĐ)</label>
                <Field name="DONGIA" type="number" class="form-control" />
                <ErrorMessage name="DONGIA" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="HinhAnh" class="form-label">Hình Ảnh (Link URL)</label>
                <Field name="HinhAnh" type="text" class="form-control" placeholder="https://example.com/image.png" />
                <ErrorMessage name="HinhAnh" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            
            <div class="col-md-3">
              <div class="form-group mb-3">
                <label for="SOTRANG" class="form-label">Số Trang</label>
                <Field name="SOTRANG" type="number" class="form-control" />
                <ErrorMessage name="SOTRANG" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group mb-3">
                <label for="NGONNGU" class="form-label">Ngôn Ngữ</label>
                <Field name="NGONNGU" type="text" class="form-control" placeholder="Tiếng Việt" />
                <ErrorMessage name="NGONNGU" class="error-feedback" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="THELOAI" class="form-label">Thể Loại</label>
                <Field name="THELOAI" type="text" class="form-control" />
                <ErrorMessage name="THELOAI" class="error-feedback" />
              </div>
            </div>
            
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="form-group mb-3">
                <label for="MOTA" class="form-label">Mô Tả</label>
                <Field name="MOTA" as="textarea" class="form-control" rows="4" />
                <ErrorMessage name="MOTA" class="error-feedback" />
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
      <p>Đang tải dữ liệu sách...</p>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import SachService from "@/services/sach.service";

export default {
  name: "SachEdit",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Validation Schema (giống hệt trang Add)
    const bookSchema = yup.object().shape({
      TENSACH: yup.string().required("Tên sách là bắt buộc!"),
      MANXB: yup.string().required("Mã NXB là bắt buộc!"),
      TACGIA: yup.string().required("Tên tác giả là bắt buộc!"),
      NAMXUATBAN: yup.number().required("Năm XB là bắt buộc!").typeError("Năm XB phải là số").min(1900),
      SOQUYEN: yup.number().required("Số quyển là bắt buộc!").typeError("Số quyển phải là số").min(1),
      DONGIA: yup.number().required("Đơn giá là bắt buộc!").typeError("Đơn giá phải là số").min(0),
      HinhAnh: yup.string().url("Phải là URL hợp lệ").optional().nullable(),
      ISBN: yup.string().optional().nullable(),
      SOTRANG: yup.number().optional().nullable().typeError("Số trang phải là số"),
      NGONNGU: yup.string().optional().nullable(),
      THELOAI: yup.string().optional().nullable(),
      NHAXUATBAN: yup.string().optional().nullable(),
      MOTA: yup.string().optional().nullable(),
    });

    return {
      book: null, // Dữ liệu sách sẽ được fetch
      loading: false,
      message: "",
      bookSchema,
    };
  },
  methods: {
    // 1. Hàm tải dữ liệu sách
    async getBook(id) {
        try {
            const response = await SachService.get(id);
            this.book = response.data;
        } catch (error) {
            console.error(error);
            this.message = "Không tìm thấy sách.";
        }
    },

    // 2. Hàm xử lý Cập nhật
    async handleUpdate(data) {
      this.loading = true;
      this.message = "";

      try {
        await SachService.update(this.book._id, data);
        this.message = "Cập nhật thông tin sách thành công!";
        
        // Chuyển về trang danh sách sau 2 giây
        setTimeout(() => {
             this.$router.push('/admin/sach'); 
        }, 2000);

      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi cập nhật sách.";
      } finally {
        this.loading = false;
      }
    },
  },
  // 3. Tải dữ liệu khi trang được mở
  mounted() {
      // Lấy 'id' từ URL (vd: /admin/sach/edit/ABC)
      const id = this.$route.params.id;
      this.getBook(id);
  }
};
</script>

<style scoped>
/* (Style y hệt trang SachAdd) */
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
</style>