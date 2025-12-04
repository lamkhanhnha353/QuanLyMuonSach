<template>
  <div class="book-detail-page">
    <div v-if="showSuccessToast" class="success-toast">
      <div class="toast-content">
        <i class="fas fa-check-circle toast-icon"></i>
        <span>{{ successMessage }}</span>
      </div>
      <div class="toast-progress"></div>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay confirm-overlay">
      <div class="confirm-box">
        <div class="confirm-icon">
          <i class="fas fa-question"></i>
        </div>
        <h4 class="confirm-title">Xác nhận mượn sách</h4>
        <p class="confirm-desc">
          Bạn có chắc chắn muốn mượn <strong>{{ borrowQuantity }}</strong> quyển 
          <br>"<strong>{{ book?.TENSACH }}</strong>" không?
        </p>
        <div class="confirm-actions">
          <button class="btn btn-secondary" @click="cancelConfirm">Xem lại</button>
          <button class="btn btn-primary" @click="executeBorrow">Đồng ý mượn</button>
        </div>
      </div>
    </div>

    <div class="container-fluid px-3">
      <div class="detail-container mt-1 py-3">

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="book" class="row gx-5 gy-4 custom-detail-layout">

          <div class="col-lg-4 col-md-5 book-cover-col">
            <div class="book-cover-section">
              <div class="book-cover-wrapper">
                <img
                  :src="book.HinhAnh || placeholderImage"
                  :alt="book.TENSACH"
                  class="book-cover-img"
                  @error="onImgError"
                >
              </div>
            </div>
          </div>

          <div class="col-lg-8 col-md-7 book-details-col">
            <div class="book-details-section">

              <h1 class="book-title">{{ book.TENSACH }}</h1>

              <div class="d-flex align-items-center mb-3">
                <span class="book-author me-4">
                  bởi <strong>{{ book.TACGIA || 'Không rõ' }}</strong>
                </span>
                <span :class="['badge', book.SOQUYEN > 0 ? 'bg-success' : 'bg-danger']">
                  {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>
              </div>

              <div class="d-flex gap-3 mt-4 mb-4 button-group">
                <button
                  v-if="book.SOQUYEN > 0 && isLoggedIn"
                  class="btn borrow-btn d-flex align-items-center"
                  @click="openBorrowModal"
                >
                  <i class="fas fa-book me-2"></i> Mượn sách
                </button>

                <button
                  v-if="book.SOQUYEN > 0 && !isLoggedIn"
                  class="btn borrow-btn d-flex align-items-center"
                  @click="$router.push('/login')"
                >
                  <i class="fas fa-sign-in-alt me-2"></i> Đăng nhập để mượn
                </button>

                <button
                  v-if="isLoggedIn"
                  :class="['btn favorite-btn d-flex align-items-center', { 'active': isFavorite }]"
                  @click="toggleFavorite"
                  :disabled="favoriteLoading"
                >
                  <i class="fas fa-heart me-2"></i>
                  {{ isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích' }}
                </button>

                <button
                  v-else
                  class="btn favorite-btn d-flex align-items-center"
                  @click="$router.push('/login')"
                >
                  <i class="fas fa-heart me-2"></i> Đăng nhập để yêu thích
                </button>
              </div>

              <hr class="text-muted opacity-25">

              <div class="description-section mt-4" v-if="book.MOTA">
                <h5 class="section-title">Giới thiệu nội dung</h5>
                <p class="description-text">{{ book.MOTA }}</p>
              </div>
              <div class="description-section mt-4" v-else>
                <p class="description-text text-muted">
                  Cuốn sách này chưa có mô tả chi tiết.
                </p>
              </div>

              <div class="info-section mt-4">
                <h5 class="info-title">Thông tin chi tiết</h5>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Thể loại</span>
                    <span class="info-value">{{ book.THELOAI || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nhà xuất bản</span>
                    <span class="info-value">{{ publisherName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Năm xuất bản</span>
                    <span class="info-value">{{ book.NAMXUATBAN || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Số trang</span>
                    <span class="info-value">{{ book.SOTRANG || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Ngôn ngữ</span>
                    <span class="info-value">{{ book.NGONNGU || 'Tiếng Việt' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <p class="text-muted">Không tìm thấy sách</p>
        </div>
      </div>
    </div>

    <div v-if="showBorrowModal" class="modal-overlay" @click.self="showBorrowModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Mượn sách: {{ book?.TENSACH }}</h5>
          <button type="button" class="btn-close" @click="showBorrowModal = false"></button>
        </div>
        
        <div class="modal-body">
          <div class="alert alert-info mb-3">
            <p class="mb-1"><strong>Số quyển còn lại:</strong> {{ book?.SOQUYEN }} quyển</p>
            <p class="mb-1"><strong>Đang mượn (đã duyệt):</strong> {{ userBorrowCount }} quyển</p>
            <p class="mb-1"><strong>Đang yêu cầu (chờ duyệt):</strong> {{ pendingBorrowCount }} quyển</p>
            <p class="mb-1"><strong>Tổng hạn mức:</strong> {{ userBorrowCount + pendingBorrowCount }} / 10 quyển</p>
            <p class="mb-0"><strong>Đã mượn cuốn sách này:</strong> {{ bookBorrowCount }} / 3 quyển</p>
          </div>

          <div class="form-group mb-3">
            <label for="borrowQuantity" class="form-label"><strong>Chọn số lượng mượn:</strong></label>
            <div class="quantity-selector">
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="borrowQuantity = Math.max(1, borrowQuantity - 1)"
              >
                <i class="fas fa-minus"></i>
              </button>
              
              <input 
                id="borrowQuantity"
                v-model.number="borrowQuantity"
                type="number"
                class="form-control quantity-input"
                :min="1"
                :max="maxBorrowQuantity"
                @change="validateQuantity"
              >
              
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="borrowQuantity = Math.min(maxBorrowQuantity, borrowQuantity + 1)"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <small class="text-muted d-block mt-2">
              Tối đa {{ maxBorrowQuantity }} quyển (Max 3/cuốn, còn lại: {{ book?.SOQUYEN }} quyển, hạn mức: {{ 10 - userBorrowCount - pendingBorrowCount }}/10)
            </small>
          </div>

          <div v-if="borrowWarning" class="alert alert-warning">
            {{ borrowWarning }}
          </div>

          <div v-if="borrowError" class="alert alert-danger">
            {{ borrowError }}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showBorrowModal = false">
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="preCheckBorrow"
            :disabled="!borrowQuantity || borrowQuantity < 1"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import AuthService from "@/services/auth.service";
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";

export default {
  name: "BookDetail",
  data() {
    return {
      book: null,
      loading: true,
      placeholderImage: "https://via.placeholder.com/400x600?text=No+Cover",
      isLoggedIn: false,
      publishers: [],
      
      // Modal chọn số lượng
      showBorrowModal: false,
      borrowQuantity: 1,
      
      // Các biến đếm
      userBorrowCount: 0,
      pendingBorrowCount: 0,
      bookBorrowCount: 0,
      
      // Thông báo lỗi/cảnh báo
      borrowError: "",
      borrowWarning: "",
      
      // Yêu thích
      isFavorite: false,
      favoriteLoading: false,
      
      // HIỆU ỨNG MỚI
      showSuccessToast: false, // Toast thông báo
      successMessage: "",
      showConfirmModal: false, // Box xác nhận (thay cho alert)
    };
  },
  computed: {
    bookId() {
      return this.$route.params.id;
    },
    publisherName() {
      if (!this.book || !this.book.MANXB) return "N/A";
      const target = String(this.book.MANXB);
      const publisher = this.publishers.find(p => {
        const pid = p._id && (p._id.$oid || p._id);
        const pidStr = pid !== undefined && pid !== null ? String(pid) : null;
        const pManxb = p.MANXB !== undefined && p.MANXB !== null ? String(p.MANXB) : null;
        return (pidStr && pidStr === target) || (pManxb && pManxb === target);
      });
      return publisher ? (publisher.TENNXB || "N/A") : "N/A";
    },
    maxBorrowQuantity() {
      if (!this.book) return 0;
      const maxPerBook = 3;
      const available = this.book.SOQUYEN || 0;
      const totalBorrowAndPending = this.userBorrowCount + this.pendingBorrowCount;
      const remainingQuota = Math.max(0, 10 - totalBorrowAndPending);
      const remainingPerBook = Math.max(0, 3 - this.bookBorrowCount);
      return Math.min(maxPerBook, available, remainingQuota, remainingPerBook);
    }
  },
  methods: {
    async fetchBook() {
      try {
        this.loading = true;
        const res = await SachService.get(this.bookId);
        this.book = res.data || res;
      } catch (error) {
        console.error("Error fetching book:", error);
        this.$router.push("/books");
      } finally {
        this.loading = false;
      }
    },

    async fetchPublishers() {
      try {
        const res = await NhaXuatBanService.getAll();
        this.publishers = res.data || [];
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    },

    async fetchUserBorrowCount() {
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return;
        const res = await MuonSachService.getForDocGia(user._id);
        const borrowRecords = res.data || [];
        const totalQuantity = borrowRecords
          .filter(record => record.trangThai === "đã duyệt" || record.trangThai === "đang mượn")
          .reduce((sum, record) => sum + (record.soLuong || 1), 0);
        this.userBorrowCount = totalQuantity;
      } catch (error) {
        console.error("Error fetching user borrow count:", error);
      }
    },

    async fetchBookBorrowCount() {
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return 0;
        const res = await MuonSachService.getForDocGia(user._id);
        const borrowRecords = res.data || [];
        const bookBorrowCount = borrowRecords
          .filter(record => 
            String(record.sachId) === String(this.book._id) &&
            (record.trangThai === "đã duyệt" || record.trangThai === "đang mượn")
          )
          .reduce((sum, record) => sum + (record.soLuong || 1), 0);
        return bookBorrowCount;
      } catch (error) {
        console.error("Error fetching book borrow count:", error);
        return 0;
      }
    },

    async fetchPendingBorrowCount() {
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return 0;
        const res = await MuonSachService.getForDocGia(user._id);
        const borrowRecords = res.data || [];
        const pendingQuantity = borrowRecords
          .filter(record => record.trangThai === "chờ duyệt")
          .reduce((sum, record) => sum + (record.soLuong || 1), 0);
        return pendingQuantity;
      } catch (error) {
        console.error("Error fetching pending borrow count:", error);
        return 0;
      }
    },

    async openBorrowModal() {
      this.bookBorrowCount = await this.fetchBookBorrowCount();
      await this.fetchUserBorrowCount();
      this.pendingBorrowCount = await this.fetchPendingBorrowCount();
      this.borrowQuantity = 1;
      this.borrowError = "";
      this.borrowWarning = "";
      this.showBorrowModal = true;
    },

    validateQuantity() {
      if (this.borrowQuantity < 1) {
        this.borrowQuantity = 1;
      } else if (this.borrowQuantity > this.maxBorrowQuantity) {
        this.borrowQuantity = this.maxBorrowQuantity;
      }
      this.borrowError = "";
      this.borrowWarning = "";
    },

    // --- BƯỚC 1: KIỂM TRA SỐ LIỆU VÀ HIỆN CONFIRM BOX ---
    preCheckBorrow() {
      this.borrowError = "";
      this.borrowWarning = "";
      const user = AuthService.getCurrentUser();
      
      if (!user) {
        alert("Vui lòng đăng nhập để mượn sách");
        this.$router.push("/login");
        return;
      }
      if (!this.borrowQuantity || this.borrowQuantity < 1) {
        this.borrowError = "Vui lòng chọn số lượng hợp lệ";
        return;
      }
      if (this.borrowQuantity > this.maxBorrowQuantity) {
        this.borrowError = `Không thể mượn quá ${this.maxBorrowQuantity} quyển`;
        return;
      }

      // Ẩn modal nhập liệu, hiện modal xác nhận
      this.showBorrowModal = false;
      this.showConfirmModal = true; 
    },

    // --- XỬ LÝ KHI BẤM "HỦY" Ở CONFIRM BOX ---
    cancelConfirm() {
      this.showConfirmModal = false;
      this.showBorrowModal = true; // Quay lại modal nhập số lượng
    },

    // --- BƯỚC 2: THỰC HIỆN GỌI API (KHI BẤM "ĐỒNG Ý" Ở CONFIRM BOX) ---
    async executeBorrow() {
      const user = AuthService.getCurrentUser();
      
      try {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 14);
        const ngayTra = returnDate.toISOString().split('T')[0];

        const borrowData = {
          docGiaId: user._id,
          sachId: this.book._id,
          ngayMuon: today.toISOString().split('T')[0],
          ngayTra: ngayTra,
          soLuong: this.borrowQuantity,
        };

        const response = await MuonSachService.create(borrowData);
        if (response.status === 200 || response.status === 201) {
          
          // Tắt Confirm box
          this.showConfirmModal = false;

          // Hiện Toast xanh lá
          this.successMessage = `Thành công! Đã gửi yêu cầu mượn ${this.borrowQuantity} quyển.`;
          this.showSuccessToast = true;
          
          setTimeout(() => {
            this.showSuccessToast = false;
          }, 3000);

          // Reset data
          this.borrowQuantity = 1;
          await this.fetchBook();
          await this.fetchUserBorrowCount();
        } else {
          throw new Error("Không thể gửi yêu cầu mượn sách");
        }
      } catch (error) {
        this.showConfirmModal = false; // Tắt modal nếu lỗi
        this.showBorrowModal = true; // Mở lại modal nhập để báo lỗi
        
        console.error("Error borrowing book:", error);
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi mượn sách";
        this.borrowError = `Lỗi: ${errorMessage}`;
      }
    },
    // -----------------------------------------------------------

    onImgError(e) {
      e.target.src = this.placeholderImage;
    },

    goBack() {
      this.$router.go(-1);
    },

    async checkFavoriteStatus() {
      try {
        const user = AuthService.getCurrentUser();
        if (!user) return;
        const res = await DocGiaService.getFavorites(user._id);
        this.isFavorite = res.data.includes(this.bookId);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    },

    async toggleFavorite() {
      if (this.favoriteLoading) return;
      try {
        this.favoriteLoading = true;
        const user = AuthService.getCurrentUser();
        if (!user) return;

        if (this.isFavorite) {
          await DocGiaService.removeFavorite(user._id, this.bookId);
          this.isFavorite = false;
        } else {
          await DocGiaService.addFavorite(user._id, this.bookId);
          this.isFavorite = true;
        }

        await this.checkFavoriteStatus();
      } catch (error) {
        console.error("Error toggling favorite:", error);
        await this.checkFavoriteStatus();
      } finally {
        this.favoriteLoading = false;
      }
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchBook();
        if (this.isLoggedIn) {
          this.checkFavoriteStatus();
        }
      }
    }
  },

  mounted() {
    this.fetchPublishers();
    const user = AuthService.getCurrentUser();
    this.isLoggedIn = !!user;
    if (this.isLoggedIn) {
      this.fetchUserBorrowCount();
      this.checkFavoriteStatus();
    }
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

/* --- TOAST NOTIFICATION MỚI (NỀN XANH FULL) --- */
.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  /* Chuyển background sang màu xanh lá đậm */
  background-color: #10b981; 
  color: white; /* Chữ trắng */
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  overflow: hidden;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.toast-icon {
  color: white; /* Icon trắng cho nổi trên nền xanh */
  font-size: 1.5rem;
}

.success-toast span {
  font-weight: 600;
  font-size: 1rem;
}

.toast-progress {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.4); /* Thanh progress màu trắng mờ */
  width: 100%;
  border-radius: 2px;
  animation: progressRun 3s linear forwards;
  align-self: flex-start;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: -16px; 
  width: calc(100% + 48px);
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes progressRun {
  from { width: 100%; }
  to { width: 0%; }
}

/* --- CONFIRMATION BOX STYLES (MỚI) --- */
.confirm-overlay {
  z-index: 1100; /* Cao hơn modal thường một chút */
}

.confirm-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.confirm-icon {
  width: 60px;
  height: 60px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 20px;
}

.confirm-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.confirm-desc {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 24px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-actions .btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
}

/* --- CÁC STYLE CŨ --- */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.book-cover-col {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  align-self: flex-start; 
}

.book-cover-wrapper {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  aspect-ratio: 2 / 3;
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details-col {
  padding-left: 2rem;
}

.book-details-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.book-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.book-author {
  font-size: 1.1rem;
  color: #4b5563;
}

.button-group {
  flex-wrap: wrap;
}

.borrow-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 1.05rem;
  box-shadow: 0 4px 10px rgb(37 99 235 / 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

.borrow-btn:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgb(37 99 235 / 0.4);
}

.favorite-btn {
  background-color: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.favorite-btn:hover {
  background-color: #fef2f2;
  transform: translateY(-2px);
}

.favorite-btn.active {
  background-color: #dc2626;
  color: white;
}

.section-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #111827;
  margin-bottom: 10px;
  border-left: 4px solid #2563eb;
  padding-left: 12px;
}

.description-text {
  text-align: justify;
  line-height: 1.7;
  color: #374151;
  font-size: 1rem;
}

.info-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #111827;
  border-left: 4px solid #2563eb;
  padding-left: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  gap: 20px;
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 991px) {
  .book-cover-col {
    position: static;
    margin-bottom: 20px;
    padding-right: 12px;
  }
  
  .book-details-col {
    padding-left: 12px;
  }

  .book-details-section {
    padding: 20px;
  }

  .book-title {
    font-size: 1.8rem;
    text-align: center;
  }
  
  .button-group {
    justify-content: center;
  }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex; justify-content: space-between; align-items: center;
}

.modal-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
.btn-close { border: none; background: transparent; font-size: 1.5rem; cursor: pointer; }
.modal-body { padding: 1.5rem; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem; }
.quantity-selector { display: flex; align-items: center; gap: 0.75rem; }
.quantity-input { width: 80px; text-align: center; font-weight: 600; }
.quantity-selector .btn { width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; }
</style>