<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">
      <router-link to="/admin/nhaxuatban" class="btn btn-outline-info me-3">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      Thêm Nhà Xuất Bản Mới
    </h3>

    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-plus-circle me-2"></i> Thông tin NXB
      </div>
      <div class="card-body">
        
        <Form @submit="handleCreate" :validation-schema="nxbSchema" :validate-on-input="true">
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="MANXB" class="form-label">Mã Nhà Xuất Bản (MANXB)</label>
                <Field name="MANXB" type="text" class="form-control" />
                <ErrorMessage name="MANXB" class="error-feedback" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="TENNXB" class="form-label">Tên Nhà Xuất Bản</label>
                <Field name="TENNXB" type="text" class="form-control" />
                <ErrorMessage name="TENNXB" class="error-feedback" />
              </div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="DIACHI" class="form-label">Địa Chỉ</label>
            <Field name="DIACHI" type="text" class="form-control" />
            <ErrorMessage name="DIACHI" class="error-feedback" />
          </div>

          <hr class="border-secondary">

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <i v-if="!loading" class="fas fa-save me-2"></i>
              Lưu Lại
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
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  name: "NhaXuatBanAdd",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Validation Schema
    const nxbSchema = yup.object().shape({
      MANXB: yup.string().required("Mã NXB là bắt buộc!"),
      TENNXB: yup.string().required("Tên NXB là bắt buộc!"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
    });

    return {
      loading: false,
      message: "",
      nxbSchema,
    };
  },
  methods: {
    async handleCreate(nxb) {
      this.loading = true;
      this.message = "";
      try {
        await NhaXuatBanService.create(nxb);
        this.message = "Thêm Nhà Xuất Bản mới thành công!";
        
        setTimeout(() => {
          this.$router.push('/admin/nhaxuatban');
        }, 1500);

      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi thêm NXB.";
      } finally {
        this.loading = false;
      }
    }
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