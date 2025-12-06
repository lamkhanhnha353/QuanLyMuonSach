<template>
  <div class="container-fluid pt-2 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-auto">
        <router-link to="/admin/docgia" class="btn btn-light shadow-sm rounded-pill px-3 fw-bold text-primary">
          <i class="fas fa-arrow-left me-2"></i> Quay lại
        </router-link>
      </div>
      <div class="col">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Cập Nhật</span> Độc Giả
        </h3>
        <small class="text-muted">Chỉnh sửa thông tin tài khoản độc giả</small>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-10">
        <!-- Main Card -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          
          <!-- Loading State inside Card -->
          <div v-if="loading && !docgia" class="text-center py-5">
             <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
             </div>
             <p class="text-muted mt-2">Đang tải dữ liệu...</p>
          </div>

          <!-- Content when loaded -->
          <div v-if="docgia">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <div class="d-flex align-items-center">
                <div class="icon-shape bg-warning text-white rounded-3 me-3 p-2">
                    <i class="fas fa-user-edit fa-lg"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold text-secondary">Thông tin độc giả</h5>
                    <small class="text-muted">ID: {{ docgia._id }}</small>
                </div>
                </div>
            </div>

            <div class="card-body p-4">
                <Form 
                @submit="handleUpdate" 
                :validation-schema="editSchema"
                :initial-values="docgia"
                v-slot="{ errors }"
                :validate-on-input="true"
                >
                
                <!-- Hàng 1: Họ tên -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold text-muted small">Họ lót <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.HOLOT }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-user"></i></span>
                            <Field name="HOLOT" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Ví dụ: Nguyễn Văn" />
                        </div>
                        <ErrorMessage name="HOLOT" class="text-danger small mt-1" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold text-muted small">Tên <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.TEN }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-signature"></i></span>
                            <Field name="TEN" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Ví dụ: A" />
                        </div>
                        <ErrorMessage name="TEN" class="text-danger small mt-1" />
                    </div>
                </div>

                <!-- Hàng 2: Tài khoản -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold text-muted small">Tên đăng nhập <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.username }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-at"></i></span>
                            <Field name="username" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Nhập tên đăng nhập..." />
                        </div>
                        <ErrorMessage name="username" class="text-danger small mt-1" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold text-muted small">Mật khẩu mới (Để trống nếu không đổi)</label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.password }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-lock"></i></span>
                            <Field 
                                name="password" 
                                :type="showPassword ? 'text' : 'password'" 
                                class="form-control bg-light border-start-0 border-end-0 ps-0" 
                                placeholder="Nhập mật khẩu mới..." 
                                autocomplete="new-password"
                            />
                            <button type="button" class="btn btn-light border border-start-0 text-secondary" @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                        <ErrorMessage name="password" class="text-danger small mt-1" />
                    </div>
                </div>

                <!-- Hàng 3: Thông tin cá nhân -->
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold text-muted small">Ngày sinh <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.NGAYSINH }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-calendar-alt"></i></span>
                            <Field name="NGAYSINH" type="date" class="form-control bg-light border-start-0 ps-0" />
                        </div>
                        <ErrorMessage name="NGAYSINH" class="text-danger small mt-1" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold text-muted small">Giới tính <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.GIOITINH }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-venus-mars"></i></span>
                            <Field name="GIOITINH" as="select" class="form-select bg-light border-start-0 ps-0">
                                <option value="" disabled>Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <!-- <option value="Khác">Khác</option> -->
                            </Field>
                        </div>
                        <ErrorMessage name="GIOITINH" class="text-danger small mt-1" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold text-muted small">Điện thoại <span class="text-danger">*</span></label>
                        <div class="input-group" :class="{ 'is-invalid-group': errors.DIENTHOAI }">
                            <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-phone"></i></span>
                            <Field name="DIENTHOAI" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="09xxxxxxxx" />
                        </div>
                        <ErrorMessage name="DIENTHOAI" class="text-danger small mt-1" />
                    </div>
                </div>

                <!-- Hàng 4: Địa chỉ -->
                <div class="mb-4">
                    <label class="form-label fw-semibold text-muted small">Địa chỉ <span class="text-danger">*</span></label>
                    <div class="input-group" :class="{ 'is-invalid-group': errors.DIACHI }">
                        <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-map-marker-alt"></i></span>
                        <Field name="DIACHI" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Nhập địa chỉ đầy đủ..." />
                    </div>
                    <ErrorMessage name="DIACHI" class="text-danger small mt-1" />
                </div>

                <!-- Submit Button -->
                <div class="d-flex justify-content-end pt-2">
                    <button type="submit" class="btn btn-warning px-5 py-2 rounded-3 fw-bold shadow-sm button-submit text-white" :disabled="isSubmitting">
                        <span v-if="isSubmitting">
                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                        </span>
                        <span v-else>
                            <i class="fas fa-save me-2"></i> Lưu Cập Nhật
                        </span>
                    </button>
                </div>
                </Form>
            </div>
          </div>
          
          <!-- Not Found State -->
          <div v-else-if="!loading && !docgia" class="text-center py-5">
             <i class="fas fa-user-slash fa-3x text-secondary mb-3 opacity-25"></i>
             <p class="text-muted">Không tìm thấy dữ liệu độc giả.</p>
          </div>

        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div v-if="message" class="toast-overlay">
      <div 
        class="toast show align-items-center text-white border-0 shadow-lg" 
        :class="isError ? 'bg-danger' : 'bg-success'"
        role="alert" 
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i :class="isError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'" class="me-2"></i>
            {{ message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="message = ''"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DocGiaService from "@/services/docgia.service";

export default {
  name: "AdminDocGiaEdit",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const editSchema = yup.object().shape({
      HOLOT: yup.string().required("Vui lòng nhập họ lót!"),
      TEN: yup.string().required("Vui lòng nhập tên!"),
      username: yup.string().required("Tên đăng nhập là bắt buộc!").min(3, "Tối thiểu 3 ký tự"),
      NGAYSINH: yup.date().required("Vui lòng chọn ngày sinh!").nullable(),
      GIOITINH: yup.string().required("Vui lòng chọn giới tính!"),
      DIENTHOAI: yup.string().required("Số điện thoại là bắt buộc!").matches(/^[0-9]{10}$/, "SĐT phải có 10 số"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
      password: yup.string().min(6, "Mật khẩu mới phải ít nhất 6 ký tự").nullable().optional(),
    });

    return {
      loading: false,
      isSubmitting: false,
      message: "",
      isError: false,
      docgia: null,
      editSchema,
      showPassword: false,
      pageFromQuery: this.$route.query.page || 1,
    };
  },
  methods: {
    async getDocGia(id) {
      this.loading = true;
      try {
        const response = await DocGiaService.get(id);
        this.docgia = response.data;
        // Định dạng lại ngày sinh cho input[type=date] (YYYY-MM-DD)
        if (this.docgia.NGAYSINH) {
          const dateObj = new Date(this.docgia.NGAYSINH);
          // Format an toàn để tránh lỗi timezone
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          this.docgia.NGAYSINH = `${year}-${month}-${day}`;
        }
      } catch (error) {
        this.isError = true;
        this.message = "Không tìm thấy thông tin độc giả.";
      } finally {
        this.loading = false;
      }
    },

    async handleUpdate(data, { setErrors }) {
        this.isSubmitting = true;
        this.message = "";
        this.isError = false;

        // Tạo bản sao data để xử lý
        const updateData = { ...data };

        // Nếu password bỏ trống hoặc null, xóa khỏi object gửi đi
        if (!updateData.password) {
          delete updateData.password;
        }

        // Kiểm tra username trùng (chỉ khi username thay đổi)
        if (updateData.username && updateData.username !== this.docgia.username) {
          try {
            const res = await DocGiaService.checkUsernameExists(updateData.username);
            // Nếu username đã tồn tại và không phải của chính độc giả này
            if (res.data.exists) {
              this.isError = true;
              this.message = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
              setErrors({ username: 'Tên đăng nhập đã được sử dụng' });
              this.isSubmitting = false;
              // Tắt thông báo sau 4s
              setTimeout(() => { this.message = "" }, 4000);
              return;
            }
          } catch (err) {
            // Nếu API check lỗi, vẫn cho phép cập nhật (hoặc có thể báo lỗi tuỳ ý)
          }
        }

        try {
          await DocGiaService.update(this.docgia._id, updateData);

          this.message = "Cập nhật thông tin thành công!";
          this.isError = false;

          // Không resetForm() để giữ dữ liệu mới trên màn hình

          // Chuyển trang sau 1.5s
          setTimeout(() => {
            this.$router.push({ name: 'admin.docgia', query: { page: this.pageFromQuery } });
          }, 1500);

        } catch (error) {
          this.isError = true;

          // Xử lý lỗi trùng username (Backend thường trả về 409 hoặc 400 kèm message)
          if (error.response && error.response.status === 409) {
               this.message = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
               setErrors({ username: 'Tên đăng nhập đã được sử dụng' });
          } else {
               this.message = error.response?.data?.message || "Lỗi khi cập nhật độc giả.";
          }

          // Tắt thông báo sau 4s
          setTimeout(() => { this.message = "" }, 4000);
        } finally {
          this.isSubmitting = false;
        }
      }
  },
  mounted() {
    const id = this.$route.params.id;
    if (id) {
        this.getDocGia(id);
    }
  }
};
</script>

<style scoped>
/* CSS đồng bộ với giao diện Add */
.card {
  transition: all 0.3s ease;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
  transition: border-color 0.2s, color 0.2s;
}

.form-control, .form-select {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  transition: all 0.2s;
}

/* Fix Autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
    -webkit-text-fill-color: #495057 !important;
}

.input-group:focus-within .input-group-text {
  background-color: #fff;
  border-color: #ffc107; /* Màu vàng cam cho nút Edit */
  color: #fd7e14;
}
.input-group:focus-within .form-control, 
.input-group:focus-within .form-select {
  background-color: #fff;
  border-color: #ffc107;
  box-shadow: none;
}
.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  border-radius: 0.375rem;
}
.input-group:focus-within input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
}

/* Error State */
.input-group.is-invalid-group .input-group-text {
  border-color: #dc3545;
  color: #dc3545;
  background-color: #fff;
}
.input-group.is-invalid-group .form-control,
.input-group.is-invalid-group .form-select,
.input-group.is-invalid-group .btn {
  border-color: #dc3545;
}
.input-group.is-invalid-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* Toast Overlay */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.button-submit {
  transition: transform 0.2s;
}
.button-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.icon-shape {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>