<template>
  <div class="container-fluid pt-2 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-auto">
        <router-link :to="{ name: 'admin.docgia', query: { page: pageFromQuery, itemsPerPage: itemsPerPageFromQuery, searchText: searchTextFromQuery } }" class="btn btn-light shadow-sm rounded-pill px-3 fw-bold text-primary">
          <i class="fas fa-arrow-left me-2"></i> Quay lại
        </router-link>
      </div>
      <div class="col">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Độc Giả
        </h3>
        <small class="text-muted">Tạo tài khoản mới cho độc giả</small>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row justify-content-center">
      <!-- Layout đã mở rộng: col-lg-10 col-xl-10 -->
      <div class="col-12 col-lg-10 col-xl-10">
        <!-- Main Card -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <div class="d-flex align-items-center">
              <div class="icon-shape bg-primary text-white rounded-3 me-3 p-2">
                <i class="fas fa-user-plus fa-lg"></i>
              </div>
              <h5 class="mb-0 fw-bold text-secondary">Thông tin đăng ký</h5>
            </div>
          </div>

          <div class="card-body p-4">
            <Form
              @submit="handleRegister"
              :validation-schema="registerSchema"
              v-slot="{ errors }" 
              :validate-on-input="true"
            >
              <!-- Hàng 1: Họ tên -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Họ & Tên lót <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.HOLOT }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-user"></i></span>
                    <Field 
                      name="HOLOT" 
                      type="text" 
                      class="form-control bg-light border-start-0 ps-0" 
                      placeholder="Ví dụ: Nguyễn" 
                    />
                  </div>
                  <ErrorMessage name="HOLOT" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Tên <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.TEN }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-signature"></i></span>
                    <Field 
                      name="TEN" 
                      type="text" 
                      class="form-control bg-light border-start-0 ps-0" 
                      placeholder="Ví dụ: Văn A" 
                    />
                  </div>
                  <ErrorMessage name="TEN" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Hàng 2: Tài khoản (Username & Password) -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Tên đăng nhập <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.username }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-at"></i></span>
                    <Field 
                      name="username" 
                      type="text" 
                      class="form-control bg-light border-start-0 ps-0" 
                      placeholder="Nhập tên đăng nhập..." 
                    />
                  </div>
                  <ErrorMessage name="username" class="text-danger small mt-1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small">Mật khẩu <span class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid-group': errors.password }">
                    <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-lock"></i></span>
                    <Field 
                      name="password" 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control bg-light border-start-0 border-end-0 ps-0" 
                      placeholder="Mật khẩu ít nhất 6 ký tự" 
                    />
                    <button type="button" class="btn btn-light border border-start-0 text-secondary" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="text-danger small mt-1" />
                </div>
              </div>

              <!-- Hàng 3: Thông tin cá nhân (Ngày sinh, Giới tính, SĐT) -->
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
                      <option value="" disabled selected>Chọn giới tính</option>
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
                    <Field name="DIENTHOAI" type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Nhập số điện thoại" />
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
                <button type="submit" class="btn btn-primary px-5 py-2 rounded-3 fw-bold shadow-sm button-submit" :disabled="loading">
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </span>
                  <span v-else>
                    <i class="fas fa-save me-2"></i> Lưu Độc Giả
                  </span>
                </button>
              </div>
            </Form>
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
  name: "AdminDocGiaAdd",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object().shape({
      HOLOT: yup.string().required("Vui lòng nhập họ lót!"),
      TEN: yup.string().required("Vui lòng nhập tên!"),
      username: yup.string().required("Tên đăng nhập là bắt buộc!").min(3, "Tối thiểu 3 ký tự"),
      password: yup.string().required("Mật khẩu là bắt buộc!").min(6, "Tối thiểu 6 ký tự"),
      NGAYSINH: yup.date().required("Vui lòng chọn ngày sinh!").nullable(),
      GIOITINH: yup.string().required("Vui lòng chọn giới tính!"),
      DIENTHOAI: yup.string().required("Số điện thoại là bắt buộc!").matches(/^[0-9]{10}$/, "SĐT phải có 10 số"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
    });

    return {
      loading: false,
      message: "",
      isError: false,
      registerSchema,
      showPassword: false,
      pageFromQuery: this.$route.query.page,
      itemsPerPageFromQuery: this.$route.query.itemsPerPage || 5,
      searchTextFromQuery: this.$route.query.searchText || '',
    };
  },
  methods: {
    async calculateReaderPage(newReader) {
      try {
        // Fetch all readers to find the position of the new reader
        const response = await DocGiaService.getAll();
        const readers = response.data;

        // Add the new reader to the list (since it might not be in the fetched list yet)
        readers.push(newReader);

        // Sort readers by HOLOT then TEN (assuming this is the default sort order)
        readers.sort((a, b) => {
          const aName = (a.HOLOT + ' ' + a.TEN).toLowerCase();
          const bName = (b.HOLOT + ' ' + b.TEN).toLowerCase();
          return aName.localeCompare(bName);
        });

        // Apply search filter if there's search text
        let filteredReaders = readers;
        if (this.searchTextFromQuery) {
          const lowerSearch = this.searchTextFromQuery.toLowerCase();
          filteredReaders = readers.filter(
            (dg) =>
              dg.HOLOT.toLowerCase().includes(lowerSearch) ||
              dg.TEN.toLowerCase().includes(lowerSearch) ||
              (dg.DIENTHOAI && dg.DIENTHOAI.includes(lowerSearch))
          );
        }

        // Find the index of the new reader in the filtered list
        const readerIndex = filteredReaders.findIndex(reader => reader._id === newReader._id);
        if (readerIndex !== -1) {
          const itemsPerPage = parseInt(this.itemsPerPageFromQuery) || 5;
          const calculatedPage = Math.ceil((readerIndex + 1) / itemsPerPage);
          return calculatedPage;
        } else {
          return 1; // Fallback to page 1 if not found
        }
      } catch (error) {
        console.error("Error calculating reader page:", error);
        return 1; // Fallback
      }
    },

    async handleRegister(user, { resetForm, setErrors }) {
      this.loading = true;
      this.message = "";
      this.isError = false;

      try {
        const response = await DocGiaService.create({
          username: user.username,
          password: user.password,
          HOLOT: user.HOLOT,
          TEN: user.TEN,
          NGAYSINH: user.NGAYSINH,
          GIOITINH: user.GIOITINH,
          DIACHI: user.DIACHI,
          DIENTHOAI: user.DIENTHOAI,
        });

        this.message = "Thêm độc giả thành công!";
        this.isError = false;

        resetForm();

        // Calculate the page where the new reader will be located
        const calculatedPage = await this.calculateReaderPage(response.data);

        setTimeout(() => {
          const query = {};
          if (calculatedPage > 1) query.page = calculatedPage;
          if (this.itemsPerPageFromQuery) query.itemsPerPage = this.itemsPerPageFromQuery;
          if (this.searchTextFromQuery) query.searchText = this.searchTextFromQuery;
          this.$router.push({ name: 'admin.docgia', query });
        }, 1500);

      } catch (error) {
        this.isError = true;

        if (error.response && error.response.status === 409) {
             this.message = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
             setErrors({ username: 'Tên đăng nhập đã được sử dụng' });
        } else {
             this.message = error.response?.data?.message || "Lỗi khi thêm độc giả. Vui lòng thử lại.";
        }

        setTimeout(() => { this.message = "" }, 4000);
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

/* Input Group Styling */
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

/* Fix Autofill background color */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
    -webkit-text-fill-color: #495057 !important;
}

/* Focus State */
.input-group:focus-within .input-group-text {
  background-color: #fff;
  border-color: #86b7fe;
  color: #0d6efd;
}
.input-group:focus-within .form-control, 
.input-group:focus-within .form-select {
  background-color: #fff;
  border-color: #86b7fe;
  box-shadow: none;
}
.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
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
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
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