<template>
  <div class="book-detail-page">
    <div class="container-fluid px-3">
      <div class="detail-container py-4">
        
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="book" class="row g-4 custom-detail-layout">
          
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

              <p class="book-author">
                bởi <strong>{{ book.TACGIA || 'Không rõ' }}</strong>
              </p>

              <p :class="['book-status', book.SOQUYEN > 0 ? 'text-success' : 'text-danger']">
                {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
              </p>

              <div class="d-flex gap-2 mt-3 mb-4 button-group">
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

              <div class="description-section mt-4" v-if="book.MOTA">
                <p class="description-text">{{ book.MOTA }}</p>
              </div>
              <div class="description-section mt-4" v-else>
                <p class="description-text text-muted">
                  Cuốn sách này chưa có mô tả chi tiết.
                </p>
              </div>

              <div class="info-section">
                <h6 class="info-title">Thông tin chi tiết</h6>

                <div class="info-rows">
                  <div class="info-row">
                    <span class="info-label">Thể loại:</span>
                    <span class="info-value">{{ book.THELOAI || 'N/A' }}</span>
                  </div>

                  <div class="info-row">
                    <span class="info-label">Nhà xuất bản:</span>
                    <span class="info-value">{{ publisherName }}</span>
                  </div>

                  <div class="info-row">
                    <span class="info-label">Năm xuất bản:</span>
                    <span class="info-value">{{ book.NAMXUATBAN || 'N/A' }}</span>
                  </div>

                  <div class="info-row">
                    <span class="info-label">Số trang:</span>
                    <span class="info-value">{{ book.SOTRANG || 'N/A' }}</span>
                  </div>

                  <div class="info-row">
                    <span class="info-label">Ngôn ngữ:</span>
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
            @click="confirmBorrow"
            :disabled="!borrowQuantity || borrowQuantity < 1"
          >
            Xác nhận mượn {{ borrowQuantity }} quyển
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
      showBorrowModal: false,
      borrowQuantity: 1,
      userBorrowCount: 0,
      pendingBorrowCount: 0,
      bookBorrowCount: 0,
      borrowError: "",
      borrowWarning: "",
      isFavorite: false,
      favoriteLoading: false,
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

    async confirmBorrow() {
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

      const confirmBorrow = confirm(`Bạn có chắc muốn mượn ${this.borrowQuantity} quyển sách "${this.book.TENSACH}" không?`);
      if (!confirmBorrow) return;

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
          alert(`Yêu cầu mượn ${this.borrowQuantity} quyển sách đã được gửi thành công! Vui lòng chờ nhân viên duyệt.`);
          this.showBorrowModal = false;
          this.borrowQuantity = 1;
          await this.fetchBook();
          await this.fetchUserBorrowCount();
        } else {
          throw new Error("Không thể gửi yêu cầu mượn sách");
        }
      } catch (error) {
        console.error("Error borrowing book:", error);
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi mượn sách";
        this.borrowError = `Lỗi: ${errorMessage}`;
      }
    },

    onImgError(e) {
      e.target.src = this.placeholderImage;
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

        // Đảm bảo trạng thái được đồng bộ với server
        await this.checkFavoriteStatus();
      } catch (error) {
        console.error("Error toggling favorite:", error);
        // Khôi phục trạng thái nếu có lỗi
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

.book-detail-page {
  background-color: #f5f6f7;
}

/* Main container */
.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 30px;
  scroll-padding-top: 80px;
  scroll-padding-bottom: 20px;
}

/* Layout alignment */
.custom-detail-layout {
  align-items: flex-start;
}

/* LEFT COLUMN: COVER */
.book-cover-col {
  padding-right: 2rem;
  position: sticky;
  top: 20px;
}

.book-cover-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3 / 4;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* RIGHT COLUMN */
.book-details-col {
  padding-left: 1rem;
}

.book-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.book-author {
  font-size: 1rem;
  color: #6b7280;
}

/* Status */
.book-status {
  font-weight: 600;
  font-size: 0.95rem;
}
.book-status.text-success {
  color: #10b981 !important;
}
.book-status.text-danger {
  color: #ef4444 !important;
}

/* Buttons */
.button-group {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
  gap: 0.5rem;
}

.borrow-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgb(37 99 235 / 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.borrow-btn i {
  font-size: 18px;
  margin-right: 8px;
}

.borrow-btn:hover {
  background-color: #1e40af;
  box-shadow: 0 6px 12px rgb(29 78 216 / 0.5);
}

.borrow-btn:active {
  transform: scale(0.95);
}

/* ========================================= */
/* FAVORITE BUTTON STYLES (EDITED)     */
/* ========================================= */

/* Trạng thái bình thường (Chưa thích): Nền trắng, viền đỏ, chữ đỏ */
.favorite-btn {
  background-color: white;
  color: #b91c1c;
  border: 1.5px solid #b91c1c;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease; /* Transition all để mượt màu nền */
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.favorite-btn i {
  font-size: 18px;
  color: #b91c1c;
  transition: color 0.3s ease;
  margin-right: 8px;
}

/* Hover khi chưa thích */
.favorite-btn:hover {
  background-color: #ffe5e5;
}

/* Trạng thái ĐÃ THÍCH (Active): Nền đỏ, chữ trắng */
.favorite-btn.active {
  background-color: #b91c1c;
  color: white;
  box-shadow: 0 4px 8px rgba(185, 28, 28, 0.3);
}

/* Đổi màu icon sang trắng khi active */
.favorite-btn.active i {
  color: white;
}

/* Hover khi đang Active */
.favorite-btn.active:hover {
  background-color: #991b1b;
  border-color: #991b1b;
}

.favorite-btn:active {
  transform: scale(0.95);
}

/* ========================================= */

/* Description */
.description-text {
  text-align: justify;
  color: #4b5563;
}

.description-section {
  margin-top: 1.5rem;
}

/* Info section */
.info-section {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.info-title::before {
  content: '';
  width: 4px;
  height: 22px;
  background: #2563eb;
  border-radius: 2px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #374151;
}

.info-value {
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .book-cover-col {
    position: static;
    padding-right: 0;
    margin-bottom: 24px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .borrow-btn, .favorite-btn {
    width: 100%;
  }
  .button-group {
    flex-direction: column;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quantity-input {
  width: 80px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.quantity-selector .btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-selector .btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
</style>