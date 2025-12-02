<template>
  <div class="page-container">
    <div class="d-flex justify-content-between align-items-center mb-4 page-header">
      <div class="d-flex align-items-center">
        <router-link to="/admin/sach" class="btn-back me-3">
          <i class="fas fa-arrow-left"></i>
        </router-link>
        <h3 class="page-title mb-0">Thêm Sách Mới</h3>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="showSuccessNotification" class="success-toast">
        <div class="toast-content">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">Thêm sách thành công!</span>
        </div>
      </div>
    </transition>

    <Form @submit="handleCreate" :validation-schema="bookSchema" :validate-on-input="true" class="form-layout">
      <div class="row g-4">
        
        <div class="col-lg-4">
          <div class="card-box image-section sticky-top-custom">
            <h5 class="section-title"><i class="fas fa-image me-2"></i>Ảnh Bìa</h5>
            
            <div class="image-upload-wrapper" @click="openImageUploader">
              <div v-if="uploadingImage" class="upload-state">
                <div class="spinner-border text-primary mb-2" role="status"></div>
                <small>Đang tải ảnh lên...</small>
              </div>
              
              <div v-else-if="imageUrl" class="image-preview">
                <img :src="imageUrl" alt="Book Cover" />
                <div class="overlay-hover">
                  <i class="fas fa-camera"></i> 
                  <span>Đổi ảnh</span>
                </div>
              </div>
              
              <div v-else class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt icon-upload"></i>
                <p>Nhấn để tải ảnh bìa</p>
                <small class="text-muted">(JPG, PNG, max 5MB)</small>
              </div>
            </div>

            <div class="mt-3">
                <label class="form-label-sm text-muted">Hoặc dán link ảnh:</label>
                <input type="text" class="form-control form-control-sm custom-input" v-model="imageUrl" placeholder="https://..." />
             </div>
             <ErrorMessage name="HinhAnh" class="error-feedback mt-2 d-block text-center" />

             <div class="mt-4 d-grid">
                <button class="btn btn-action-primary" :disabled="loading">
                  <span v-if="!loading"><i class="fas fa-save me-2"></i>Lưu Sách</span>
                  <span v-else><i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...</span>
                </button>
             </div>

             <div v-if="message && !showSuccessNotification" class="alert alert-danger mt-3 custom-alert">
                <i class="fas fa-exclamation-triangle me-2"></i> {{ message }}
             </div>
          </div>
        </div>

        <div class="col-lg-8">
          
          <div class="card-box mb-4">
            <h5 class="section-title text-primary"><i class="fas fa-info-circle me-2"></i>Thông Tin Cơ Bản</h5>
            <div class="row g-3">
              <div class="col-12">
                <div class="form-group">
                  <label class="form-label">Tên Sách</label>
                  <Field name="TENSACH" type="text" class="form-control custom-input" placeholder="Nhập tên sách..." />
                  <ErrorMessage name="TENSACH" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Tác Giả</label>
                  <Field name="TACGIA" type="text" class="form-control custom-input" placeholder="Tên tác giả" />
                  <ErrorMessage name="TACGIA" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Mã NXB</label>
                  <Field name="MANXB" type="text" class="form-control custom-input" placeholder="Mã nhà xuất bản" />
                  <ErrorMessage name="MANXB" class="error-feedback" />
                </div>
              </div>
               <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Thể Loại</label>
                  <Field name="THELOAI" type="text" class="form-control custom-input" placeholder="Ví dụ: Khoa học, Văn học..." />
                  <ErrorMessage name="THELOAI" class="error-feedback" />
                </div>
              </div>
               <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Đơn Giá (VNĐ)</label>
                  <div class="input-group">
                     <Field name="DONGIA" type="number" class="form-control custom-input" placeholder="0" />
                     <span class="input-group-text custom-addon">đ</span>
                  </div>
                  <ErrorMessage name="DONGIA" class="error-feedback" />
                </div>
              </div>
            </div>
          </div>

          <div class="card-box mb-4">
            <h5 class="section-title text-success"><i class="fas fa-book-open me-2"></i>Chi Tiết Xuất Bản</h5>
            <div class="row g-3">
              <div class="col-md-3 col-6">
                <div class="form-group">
                  <label class="form-label">Năm XB</label>
                  <Field name="NAMXUATBAN" type="number" class="form-control custom-input" />
                  <ErrorMessage name="NAMXUATBAN" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="form-group">
                  <label class="form-label">Số Quyển</label>
                  <Field name="SOQUYEN" type="number" class="form-control custom-input" />
                  <ErrorMessage name="SOQUYEN" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="form-group">
                  <label class="form-label">Số Trang</label>
                  <Field name="SOTRANG" type="number" class="form-control custom-input" />
                  <ErrorMessage name="SOTRANG" class="error-feedback" />
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="form-group">
                  <label class="form-label">Ngôn Ngữ</label>
                  <Field name="NGONNGU" type="text" class="form-control custom-input" placeholder="Tiếng Việt" />
                  <ErrorMessage name="NGONNGU" class="error-feedback" />
                </div>
              </div>
            </div>
          </div>

          <div class="card-box">
            <h5 class="section-title text-warning"><i class="fas fa-align-left me-2"></i>Giới Thiệu Nội Dung</h5>
            <div class="form-group">
              <Field name="MOTA" as="textarea" class="form-control custom-input" rows="6" placeholder="Viết mô tả ngắn về nội dung sách..." />
              <ErrorMessage name="MOTA" class="error-feedback" />
            </div>
          </div>

        </div>
      </div>

      <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileSelect" />
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import SachService from "@/services/sach.service";

export default {
  name: "SachAdd",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const bookSchema = yup.object().shape({
      TENSACH: yup.string().required("Tên sách là bắt buộc!").min(2, "Quá ngắn").max(200, "Quá dài"),
      MANXB: yup.string().required("Bắt buộc").max(50, "Quá dài"),
      TACGIA: yup.string().required("Bắt buộc").max(100, "Quá dài"),
      NAMXUATBAN: yup.number().required("Bắt buộc").typeError("Phải là số").min(1900, "Từ 1900+").max(new Date().getFullYear() + 1, "Không hợp lệ"),
      SOQUYEN: yup.number().required("Bắt buộc").typeError("Phải là số").min(1, "Ít nhất 1").max(10000, "Quá nhiều"),
      DONGIA: yup.number().required("Bắt buộc").typeError("Phải là số").min(1000, "Min 1k").max(10000000, "Max 10tr"),
      SOTRANG: yup.number().required("Bắt buộc").typeError("Phải là số").min(1, "Min 1"),
      NGONNGU: yup.string().required("Bắt buộc"),
      THELOAI: yup.string().required("Bắt buộc"),
      MOTA: yup.string().required("Bắt buộc").min(10, "Mô tả quá ngắn"),
    });

    return {
      loading: false,
      message: "",
      bookSchema,
      imageUrl: "",
      uploadingImage: false,
      uploadAbortController: null,
      showSuccessNotification: false, // State để điều khiển notification đẹp
    };
  },
  methods: {
    openImageUploader() {
      this.$refs.fileInput.click();
    },

    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        this.message = "Vui lòng chọn file ảnh!";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.message = "Ảnh không được vượt quá 5MB!";
        return;
      }

      try {
        const compressedFile = await this.compressImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
          this.uploadImageToCloudinary(e.target.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error(error);
      }
    },

    async compressImage(file) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1200;
          let { width, height } = img;
          if (width > height) {
            if (width > maxDimension) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(resolve, 'image/jpeg', 0.9);
        };
        img.src = URL.createObjectURL(file);
      });
    },

    async uploadImageToCloudinary(base64Data) {
      try {
        if (this.uploadAbortController) this.uploadAbortController.abort();
        this.uploadAbortController = new AbortController();
        this.uploadingImage = true;
        this.message = "";

        const response = await SachService.uploadImage(base64Data, this.uploadAbortController.signal);
        const returnedUrl = response?.data?.data?.url;
        
        if (returnedUrl) {
          this.imageUrl = returnedUrl;
        } else {
          this.message = "Lỗi khi upload ảnh";
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
           this.message = "Lỗi upload ảnh";
        }
      } finally {
        this.uploadingImage = false;
      }
    },

    async handleCreate(book) {
      if (!this.imageUrl && !book.HinhAnh) {
        this.message = "Hình ảnh là bắt buộc!";
        return;
      }

      this.loading = true;
      this.message = "";
      
      try {
        book.HinhAnh = this.imageUrl || book.HinhAnh;
        await SachService.create(book);

        // --- XỬ LÝ HIỆN THÔNG BÁO ĐẸP ---
        this.showSuccessNotification = true;

        // Đợi 700ms (0.7s) rồi chuyển trang
        setTimeout(() => {
          this.$router.push('/admin/sach');
        }, 700);

      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi thêm sách.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* --- VARIABLE & GLOBAL --- */
.page-container {
  background-color: #151521; /* Nền tối đậm */
  min-height: 100vh;
  padding: 20px;
  color: #e0e0e0;
  font-family: 'Segoe UI', sans-serif;
}

/* --- HEADER --- */
.page-title {
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.btn-back {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #2a2a3c;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s;
}
.btn-back:hover {
  background: #007bff;
  transform: translateX(-3px);
}

/* --- CARDS & LAYOUT --- */
.card-box {
  background: #1e1e2d; /* Card màu tối sáng hơn nền */
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sticky-top-custom {
  position: sticky;
  top: 20px;
  z-index: 10;
}

/* --- FORM INPUTS --- */
.form-label {
  font-size: 0.9rem;
  color: #a6a6b7;
  margin-bottom: 6px;
  font-weight: 500;
}

.custom-input {
  background-color: #151521;
  border: 1px solid #333344;
  color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.2s;
}

.custom-input:focus {
  background-color: #1a1a27;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.15);
  color: #fff;
}

.input-group-text.custom-addon {
  background-color: #2a2a3c;
  border-color: #333344;
  color: #a6a6b7;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.error-feedback {
  color: #ff5b5b;
  font-size: 0.8rem;
  margin-top: 4px;
}

/* --- IMAGE UPLOADER --- */
.image-upload-wrapper {
  width: 100%;
  aspect-ratio: 2/3; /* Tỉ lệ sách chuẩn */
  background: #151521;
  border: 2px dashed #333344;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.image-upload-wrapper:hover {
  border-color: #007bff;
  background: #1a1a29;
}

.upload-placeholder {
  text-align: center;
  color: #6c757d;
}

.icon-upload {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #444;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-hover {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-weight: 600;
}

.image-upload-wrapper:hover .overlay-hover {
  opacity: 1;
}

/* --- BUTTONS --- */
.btn-action-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-action-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
  color: white;
}

.btn-action-primary:disabled {
  background: #444;
  transform: none;
}

/* --- SUCCESS TOAST NOTIFICATION (Điểm nhấn) --- */
.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: #28a745; /* Màu xanh thành công */
  color: white;
  padding: 12px 24px;
  border-radius: 50px; /* Bo tròn như hình yêu cầu */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.toast-content {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
}

.toast-content .icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* Animation cho Toast */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sticky-top-custom {
    position: static;
  }
}
</style>