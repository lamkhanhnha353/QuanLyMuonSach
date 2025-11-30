<template>
  <div class="account-page">
    <div v-if="loading && !docgia" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="docgia" class="container py-4">
      
      <div class="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h2 class="page-title m-0">Tài Khoản Của Tôi</h2>
          <p class="text-muted small m-0 mt-1">Quản lý hồ sơ cá nhân và hoạt động mượn sách</p>
        </div>
        
        <div class="d-none d-md-block">
           <div class="d-flex align-items-center px-3 py-2 bg-white rounded-pill shadow-sm border">
              <i class="fas fa-check-circle text-success me-2"></i>
              <span class="text-muted small me-1">Trạng thái:</span>
              <span class="fw-bold text-dark">Đang hoạt động</span>
           </div>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card profile-card border-0 shadow-sm mb-4">
            <div class="card-body pt-4 pb-4">
              <div class="d-flex align-items-center mb-4">
                <div class="position-relative me-3">
                  <div class="avatar-circle">
                    <span v-if="!docgia.AVATAR" class="initials">{{ getInitials(docgia.HOLOT, docgia.TEN) }}</span>
                    <img v-else :src="docgia.AVATAR" alt="Avatar" class="avatar-img" />
                  </div>
                  <button class="btn-edit-icon" @click="activeTab = 'edit_info'" title="Sửa ảnh đại diện">
                    <i class="fas fa-pen"></i>
                  </button>
                </div>
                <div>
                  <h5 class="user-name mb-1">{{ docgia.HOLOT }} {{ docgia.TEN }}</h5>
                  <p class="text-muted small mb-0">Thành viên từ 12/2023</p>
                </div>
              </div>

              <div class="user-info-list mb-4">
                <div class="info-row">
                  <i class="fas fa-id-card me-3"></i>
                  <span>ID: {{ docgia._id }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-user-circle me-3"></i>
                  <span>User: {{ docgia.username }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-phone-alt me-3"></i>
                  <span>{{ docgia.DIENTHOAI }}</span>
                </div>
              </div>

              <button class="btn btn-soft-purple w-100 fw-bold" @click="activeTab = 'edit_info'">
                <i class="fas fa-pen me-2"></i>Chỉnh sửa thông tin
              </button>
            </div>
          </div>

          <div class="settings-section">
            <h5 class="fw-bold mb-3 px-1">Cài đặt</h5>
            <div class="card border-0 shadow-sm">
              <div class="list-group list-group-flush rounded-3 py-2">
                <button class="list-group-item list-group-item-action d-flex align-items-center px-4 py-3 border-0" 
                        :class="{ 'bg-light-active': activeTab === 'change_password' }"
                        @click="activeTab = 'change_password'">
                  <i class="fas fa-lock me-3 text-purple"></i>
                  <span class="fw-500">Đổi mật khẩu</span>
                </button>
                <button class="list-group-item list-group-item-action d-flex align-items-center px-4 py-3 border-0">
                  <i class="fas fa-bell me-3 text-purple"></i>
                  <span class="fw-500">Cài đặt thông báo</span>
                </button>
                <button class="list-group-item list-group-item-action d-flex align-items-center px-4 py-3 border-0">
                  <i class="fas fa-globe me-3 text-purple"></i>
                  <span class="fw-500">Ngôn ngữ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          
          <div v-if="activeTab === 'dashboard'">
            
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold m-0">Sách đang mượn ({{ borrowedBooks.length }})</h5>
              
              <a v-if="borrowedBooks.length > 2" 
                 href="#" 
                 class="text-decoration-none small text-primary fw-bold"
                 @click.prevent="showAllBorrowed = !showAllBorrowed">
                 {{ showAllBorrowed ? 'Thu gọn' : 'Xem tất cả' }}
              </a>
            </div>

            <div class="d-flex flex-column gap-3 mb-5">
              <div v-if="borrowedBooks.length > 0">
                <transition-group name="fade">
                  <div v-for="book in visibleBorrowedBooks" :key="book._id" class="card book-card border-0 shadow-sm mb-3">
                    <div class="card-body p-3">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <div class="book-cover-placeholder">
                            <img v-if="book.HinhAnh" :src="book.HinhAnh" alt="Book Cover" class="book-cover-img">
                            <img v-else src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" alt="Book Cover" class="book-cover-img">
                          </div>
                        </div>
                        <div class="col">
                          <h6 class="book-title mb-1">{{ book.TENSACH }}</h6>
                          <p class="text-muted small mb-2">{{ book.TACGIA }}</p>
                          <div class="d-flex align-items-center text-danger small fw-bold">
                            <i class="fas fa-clock me-2"></i>
                            <span>Hạn trả: {{ formatDate(book.NGAYTRADK) }} ({{ getDaysLeftText(book.NGAYTRADK) }})</span>
                          </div>
                        </div>
                        <div class="col-auto">
                           <button class="btn btn-purple px-4 py-2">Gia hạn</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-else class="card border-0 shadow-sm p-4 text-center">
                 <p class="text-muted mb-0">Bạn không có sách nào đang mượn.</p>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold m-0">Lịch sử mượn sách</h5>
              
              <a v-if="borrowHistory.length > 3" 
                 href="#" 
                 class="text-decoration-none small text-primary fw-bold"
                 @click.prevent="showAllHistory = !showAllHistory">
                 {{ showAllHistory ? 'Thu gọn' : 'Xem tất cả' }}
              </a>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th class="ps-4 py-3 text-secondary small text-uppercase fw-bold border-0" style="width: 40%">Tên sách</th>
                      <th class="py-3 text-secondary small text-uppercase fw-bold border-0">Ngày mượn</th>
                      <th class="py-3 text-secondary small text-uppercase fw-bold border-0">Ngày trả</th>
                      <th class="pe-4 py-3 text-secondary small text-uppercase fw-bold border-0 text-end">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in visibleBorrowHistory" :key="record._id">
                      <td class="ps-4 py-3 fw-500">{{ record.TENSACH }}</td>
                      <td class="py-3 text-muted small">{{ formatDate(record.NGAYMUON) }}</td>
                      <td class="py-3 text-muted small">{{ formatDate(record.NGAYTRA) }}</td>
                      <td class="pe-4 py-3 text-end">
                        <span class="badge" :class="getStatusBadgeClass(record.trangThai)">{{ record.TRANGTHAI }}</span>
                      </td>
                    </tr>
                     <tr v-if="borrowHistory.length === 0">
                       <td colspan="4" class="text-center py-4 text-muted">Chưa có lịch sử mượn sách</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'edit_info'">
             <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-3 rounded-circle" @click="activeTab = 'dashboard'"><i class="fas fa-arrow-left"></i></button>
                <h5 class="fw-bold m-0">Cập nhật thông tin cá nhân</h5>
             </div>
             <div class="card border-0 shadow-sm">
               <div class="card-body p-4">
                  <Form @submit="handleUpdateInfo" :validation-schema="infoSchema" :initial-values="docgia">
                    <h6 class="text-purple mb-3">Thông tin cơ bản</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                           <label class="form-label small fw-bold text-muted">Họ đệm</label>
                           <Field name="HOLOT" type="text" class="form-control" />
                           <ErrorMessage name="HOLOT" class="text-danger small" />
                        </div>
                        <div class="col-md-6 mb-3">
                           <label class="form-label small fw-bold text-muted">Tên</label>
                           <Field name="TEN" type="text" class="form-control" />
                           <ErrorMessage name="TEN" class="text-danger small" />
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6 mb-3">
                           <label class="form-label small fw-bold text-muted">Ngày sinh</label>
                           <Field name="NGAYSINH" type="date" class="form-control" />
                           <ErrorMessage name="NGAYSINH" class="text-danger small" />
                        </div>
                        <div class="col-md-6 mb-3">
                           <label class="form-label small fw-bold text-muted">Giới tính</label>
                           <Field name="GIOITINH" as="select" class="form-control">
                              <option value="">Chọn giới tính</option>
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                              <option value="Khác">Khác</option>
                           </Field>
                           <ErrorMessage name="GIOITINH" class="text-danger small" />
                        </div>
                     </div>
                     <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">Số điện thoại</label>
                        <Field name="DIENTHOAI" type="text" class="form-control" />
                        <ErrorMessage name="DIENTHOAI" class="text-danger small" />
                     </div>
                     <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">Địa chỉ</label>
                        <Field name="DIACHI" type="text" class="form-control" />
                        <ErrorMessage name="DIACHI" class="text-danger small" />
                     </div>

                     <div class="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" class="btn btn-light" @click="activeTab = 'dashboard'">Hủy</button>
                        <button type="submit" class="btn btn-purple px-4" :disabled="loading">
                           <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                           Lưu thông tin
                        </button>
                     </div>
                     <div v-if="message" class="alert mt-3" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                     </div>
                  </Form>
               </div>
             </div>
          </div>

          <div v-if="activeTab === 'change_password'">
             <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-3 rounded-circle" @click="activeTab = 'dashboard'"><i class="fas fa-arrow-left"></i></button>
                <h5 class="fw-bold m-0">Đổi mật khẩu & Bảo mật</h5>
             </div>
             
             <div class="card border-0 shadow-sm">
               <div class="card-body p-4">
                  <Form @submit="handleChangePassword" :validation-schema="passwordSchema">
                    <h6 class="text-purple mb-3">Bảo mật</h6>

                    <div class="mb-3">
                      <label class="form-label small fw-bold text-muted">Mật khẩu hiện tại</label>
                      <div class="input-group">
                        <Field 
                          name="currentPassword" 
                          :type="showCurrentPassword ? 'text' : 'password'" 
                          class="form-control border-end-0" 
                          placeholder="Nhập mật khẩu hiện tại" 
                        />
                        <span class="input-group-text bg-white border-start-0 cursor-pointer" @click="showCurrentPassword = !showCurrentPassword">
                          <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-muted"></i>
                        </span>
                      </div>
                      <ErrorMessage name="currentPassword" class="text-danger small" />
                    </div>

                    <hr class="my-3 border-light">
                    
                     <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label small fw-bold text-muted">Mật khẩu mới</label>
                          <div class="input-group">
                            <Field 
                              name="password" 
                              :type="showNewPassword ? 'text' : 'password'" 
                              class="form-control border-end-0" 
                              placeholder="Nhập mật khẩu mới" 
                            />
                            <span class="input-group-text bg-white border-start-0 cursor-pointer" @click="showNewPassword = !showNewPassword">
                              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-muted"></i>
                            </span>
                          </div>
                          <ErrorMessage name="password" class="text-danger small" />
                        </div>

                         <div class="col-md-6 mb-3">
                          <label class="form-label small fw-bold text-muted">Xác nhận mật khẩu</label>
                          <div class="input-group">
                            <Field 
                              name="confirmPassword" 
                              :type="showConfirmPassword ? 'text' : 'password'" 
                              class="form-control border-end-0" 
                              placeholder="Nhập lại mật khẩu mới" 
                            />
                            <span class="input-group-text bg-white border-start-0 cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-muted"></i>
                            </span>
                          </div>
                          <ErrorMessage name="confirmPassword" class="text-danger small" />
                        </div>
                     </div>

                     <div class="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" class="btn btn-light" @click="activeTab = 'dashboard'">Hủy</button>
                        <button type="submit" class="btn btn-purple px-4" :disabled="loading">
                           <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                           Lưu mật khẩu
                        </button>
                     </div>
                     <div v-if="message" class="alert mt-3" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                     </div>
                  </Form>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DocGiaService from "@/services/docgia.service";
import AuthService from "@/services/auth.service";
import MuonSachService from "@/services/muonsach.service";
import SachService from "@/services/sach.service";

export default {
  name: "DocGiaAccount",
  components: { Form, Field, ErrorMessage },
  data() {
    // Schema cho form thông tin
    const infoSchema = yup.object().shape({
      HOLOT: yup.string().required("Bắt buộc"),
      TEN: yup.string().required("Bắt buộc"),
      NGAYSINH: yup.date().required("Bắt buộc").typeError("Ngày không hợp lệ"),
      GIOITINH: yup.string().required("Bắt buộc"),
      DIACHI: yup.string().required("Bắt buộc"),
      DIENTHOAI: yup.string().required("Bắt buộc"),
    });

    // Schema cho form mật khẩu
    const passwordSchema = yup.object().shape({
      currentPassword: yup.string().required("Nhập mật khẩu hiện tại để xác nhận"),
      password: yup.string().min(6, "Tối thiểu 6 ký tự").required("Mật khẩu mới là bắt buộc"),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required("Xác nhận mật khẩu là bắt buộc")
    });

    return {
      loading: false,
      message: "",
      messageType: "success",
      docgia: null,
      activeTab: "dashboard",
      borrowedBooks: [],
      borrowHistory: [],
      // Biến trạng thái xem tất cả/thu gọn
      showAllBorrowed: false, 
      showAllHistory: false, 
      
      // Biến hiển thị mật khẩu
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      infoSchema,
      passwordSchema,
    };
  },
  computed: {
    // Computed cho sách đang mượn (Hiện 2)
    visibleBorrowedBooks() {
      if (this.showAllBorrowed) {
        return this.borrowedBooks;
      }
      return this.borrowedBooks.slice(0, 2);
    },
    // Computed cho lịch sử mượn (Hiện 3)
    visibleBorrowHistory() {
      if (this.showAllHistory) {
        return this.borrowHistory;
      }
      return this.borrowHistory.slice(0, 3);
    }
  },
  methods: {
    getInitials(holot, ten) {
      const h = holot ? holot.charAt(0) : "";
      const t = ten ? ten.charAt(0) : "";
      return (h + t).toUpperCase();
    },
    getDaysLeftText(dueDate) {
        if (!dueDate) return "";
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return `Quá hạn ${Math.abs(daysLeft)} ngày`;
        if (daysLeft === 0) return "Hôm nay";
        return `còn ${daysLeft} ngày`;
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric"});
    },
    getStatusText(status) {
      const statusMap = {
        "chờ duyệt": "Chờ duyệt",
        "đã duyệt": "Đã duyệt",
        "đang mượn": "Đang mượn",
        "đã trả": "Đã trả",
        "từ chối": "Từ chối",
        "đang chờ trả": "Đang chờ trả"
      };
      return statusMap[status] || status;
    },
    getStatusBadgeClass(status) {
      const classMap = {
        "chờ duyệt": "bg-warning-soft text-warning",
        "đã duyệt": "bg-info-soft text-info",
        "đang mượn": "bg-primary-soft text-primary",
        "đã trả": "bg-green-soft text-green",
        "từ chối": "bg-danger-soft text-danger",
        "đang chờ trả": "bg-orange-soft text-orange"
      };
      return classMap[status] || "bg-secondary-soft text-secondary";
    },
    async getDocGia() {
      this.loading = true;
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return;
        const response = await DocGiaService.get(user._id);
        this.docgia = response.data;
        if (this.docgia.NGAYSINH) this.docgia.NGAYSINH = this.docgia.NGAYSINH.split('T')[0];
        
        await this.getBorrowedBooks(user._id);
        await this.getBorrowHistory(user._id);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async getBorrowedBooks(docgiaId) {
       try {
        const response = await MuonSachService.getForDocGia(docgiaId);
        const records = response.data;
        const borrowed = records.filter(record => !record.ngayTraThucTe);
        for (let record of borrowed) {
          try {
            const sachResponse = await SachService.get(record.sachId);
            record.TENSACH = sachResponse.data.TENSACH;
            record.TACGIA = sachResponse.data.TACGIA;
            record.HinhAnh = sachResponse.data.HinhAnh;
            record.NGAYTRADK = record.ngayTra;
          } catch (error) {
            record.TENSACH = "Không xác định";
            record.TACGIA = "N/A";
            record.HinhAnh = null;
            record.NGAYTRADK = record.ngayTra;
          }
        }
        this.borrowedBooks = borrowed;
      } catch (error) { this.borrowedBooks = []; }
    },
    async getBorrowHistory(docgiaId) {
        try {
            const response = await MuonSachService.getForDocGia(docgiaId);
            const records = response.data;
            const history = records; 
            for (let record of history) {
                 try {
                    const sachResponse = await SachService.get(record.sachId);
                    record.TENSACH = sachResponse.data.TENSACH;
                    record.NGAYMUON = record.ngayMuon;
                    record.NGAYTRA = record.ngayTraThucTe || record.ngayTra;
                    record.TRANGTHAI = this.getStatusText(record.trangThai);
                } catch (error) {
                    record.TENSACH = "Không xác định";
                    record.TRANGTHAI = "N/A";
                }
            }
            this.borrowHistory = history;
        } catch(e) { this.borrowHistory = []; }
    },

    async handleUpdateInfo(data) {
        this.loading = true;
        this.message = "";
        try {
            const updateData = {
                HOLOT: data.HOLOT,
                TEN: data.TEN,
                NGAYSINH: data.NGAYSINH,
                GIOITINH: data.GIOITINH,
                DIACHI: data.DIACHI,
                DIENTHOAI: data.DIENTHOAI
            };
            await DocGiaService.update(this.docgia._id, updateData);
            this.message = "Cập nhật thông tin thành công!";
            this.messageType = "success";
            this.docgia = { ...this.docgia, ...updateData };
            setTimeout(() => { this.activeTab = 'dashboard'; this.message = ""; }, 1500);
        } catch (error) {
            this.message = "Lỗi khi cập nhật thông tin.";
            this.messageType = "danger";
        } finally {
            this.loading = false;
        }
    },

    async handleChangePassword(data) {
        this.loading = true;
        this.message = "";
        try {
            const loginData = { username: this.docgia.username, password: data.currentPassword };
            await AuthService.login(loginData);

            const updateData = { password: data.password };
            await DocGiaService.update(this.docgia._id, updateData);

            this.message = "Đổi mật khẩu thành công!";
            this.messageType = "success";

            this.showCurrentPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;

            setTimeout(() => { this.activeTab = 'dashboard'; this.message = ""; }, 1500);
        } catch (error) {
            this.message = "Mật khẩu hiện tại không đúng.";
            this.messageType = "danger";
        } finally {
            this.loading = false;
        }
    }
  },
  mounted() {
    this.getDocGia();
  }
};
</script>

<style scoped>
/* GENERAL */
:root { --primary-purple: #5654d4; --soft-purple-bg: #eef2ff; --soft-purple-text: #4f46e5; }
.account-page { background-color: #f8f9fc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.page-title { font-weight: 800; color: #1a1a1a; }
.card { border-radius: 16px; background: #ffffff; }
.shadow-sm { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important; }

/* SIDEBAR */
.avatar-circle { width: 80px; height: 80px; background-color: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.initials { font-size: 1.8rem; font-weight: 600; color: #5654d4; }
.btn-edit-icon { position: absolute; bottom: 0; right: -5px; background: #5654d4; border: 2px solid #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; cursor: pointer; }
.user-name { font-weight: 700; color: #1a1a1a; }
.info-row { display: flex; align-items: center; margin-bottom: 15px; font-size: 0.9rem; color: #666; }
.info-row i { color: #9ca3af; width: 20px; }
.btn-soft-purple { background-color: #eef2ff; color: #5654d4; border: none; border-radius: 8px; padding: 10px; transition: all 0.2s; }
.btn-soft-purple:hover { background-color: #e0e7ff; color: #4338ca; }
.text-purple { color: #5654d4; }
.fw-500 { font-weight: 500; color: #374151; }
.list-group-item-action:hover { background-color: #f9fafb; }
.bg-light-active { background-color: #f3f4f6; color: #5654d4; font-weight: 700; }

/* BOOKS & TABLE */
.book-cover-placeholder { width: 50px; height: 75px; background-color: #ddd; border-radius: 4px; overflow: hidden; }
.book-cover-img { width: 100%; height: 100%; object-fit: cover; }
.book-title { font-weight: 700; color: #1a1a1a; }
.btn-purple { background-color: #5654d4; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; transition: background 0.2s; }
.btn-purple:hover { background-color: #4338ca; }
.table th { font-size: 0.75rem; letter-spacing: 0.05em; color: #6b7280; padding-left: 1.5rem; }
.table td { padding-left: 1.5rem; }
.bg-green-soft { background-color: #d1fae5; color: #047857; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-warning-soft { background-color: #fef3c7; color: #d97706; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-info-soft { background-color: #dbeafe; color: #2563eb; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-primary-soft { background-color: #e0e7ff; color: #3730a3; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-danger-soft { background-color: #fee2e2; color: #dc2626; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-orange-soft { background-color: #fed7aa; color: #ea580c; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }
.bg-secondary-soft { background-color: #f3f4f6; color: #6b7280; font-weight: 600; font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; }

/* INPUT GROUP & PASSWORD EYE */
.form-control { border-color: #e5e7eb; padding: 0.6rem 0.75rem; background-color: #fff; }
.input-group-text { border-color: #e5e7eb; }
.form-control:focus { border-color: #5654d4; box-shadow: none; z-index: 1; }
.form-control:focus + .input-group-text { border-color: #5654d4; border-left: none; }
.cursor-pointer { cursor: pointer; }

/* OVERLAY & ANIMATION */
.loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>