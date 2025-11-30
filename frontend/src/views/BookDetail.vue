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
          
          <!-- Left: Book Cover -->
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

          <!-- Right: Details -->
          <div class="col-lg-8 col-md-7 book-details-col">
            <div class="book-details-section">

              <h1 class="book-title">{{ book.TENSACH }}</h1>

              <p class="book-author">
                bởi <strong>{{ book.TACGIA || 'Không rõ' }}</strong>
              </p>

              <p :class="['book-status', book.SOQUYEN > 0 ? 'text-success' : 'text-danger']">
                {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
              </p>

              <!-- Buttons -->
              <div class="d-flex gap-2 mt-3 mb-4 button-group">
                <button
                  v-if="book.SOQUYEN > 0 && isLoggedIn"
                  class="btn borrow-btn d-flex align-items-center"
                  @click="borrowBook"
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

                <button class="btn favorite-btn d-flex align-items-center">
                  <i class="fas fa-heart me-2"></i> Thêm vào yêu thích
                </button>
              </div>

              <!-- Description -->
              <div class="description-section mt-4" v-if="book.MOTA">
                <p class="description-text">{{ book.MOTA }}</p>
              </div>
              <div class="description-section mt-4" v-else>
                <p class="description-text text-muted">
                  Cuốn sách này chưa có mô tả chi tiết.
                </p>
              </div>

              <!-- Info Section -->
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
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import AuthService from "@/services/auth.service";
import MuonSachService from "@/services/muonsach.service";

export default {
  name: "BookDetail",
  data() {
    return {
      book: null,
      loading: true,
      placeholderImage: "https://via.placeholder.com/400x600?text=No+Cover",
      isLoggedIn: false,
      publishers: [],
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

    async borrowBook() {
      const user = AuthService.getCurrentUser();
      if (!user) {
        alert("Vui lòng đăng nhập để mượn sách");
        this.$router.push("/login");
        return;
      }

      // Confirm borrow request
      const confirmBorrow = confirm(`Bạn có chắc muốn mượn sách "${this.book.TENSACH}" không?`);
      if (!confirmBorrow) return;

      try {
        // Calculate return date (e.g., 14 days from now)
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 14); // Default 14 days
        const ngayTra = returnDate.toISOString().split('T')[0];

        const borrowData = {
          docGiaId: user._id,
          sachId: this.book._id,
          ngayMuon: today.toISOString().split('T')[0],
          ngayTra: ngayTra,
        };

        const response = await MuonSachService.create(borrowData);

        if (response.status === 200 || response.status === 201) {
          alert("Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ nhân viên duyệt.");
          // Refresh book data to update quantity
          await this.fetchBook();
        } else {
          throw new Error("Không thể gửi yêu cầu mượn sách");
        }
      } catch (error) {
        console.error("Error borrowing book:", error);
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi mượn sách";
        alert(`Lỗi: ${errorMessage}`);
      }
    },

    onImgError(e) {
      e.target.src = this.placeholderImage;
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchBook();
      }
    }
  },

  mounted() {
    this.fetchPublishers();
    const user = AuthService.getCurrentUser();
    this.isLoggedIn = !!user;
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth; /* cuộn mượt */
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
  scroll-padding-top: 80px; /* scroll tới gần đầu tự nhiên */
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
  top: 20px; /* sticky khi cuộn */
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

.favorite-btn {
  background-color: white;
  color: #b91c1c;
  border: 1.5px solid #b91c1c;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  font-size: 1rem;
  transition: border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease, transform 0.15s ease;
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

.favorite-btn:hover, .favorite-btn:focus {
  background-color: #b91c1c;
  color: white;
}

.favorite-btn:hover i, .favorite-btn:focus i {
  color: white;
}

.favorite-btn:active {
  transform: scale(0.95);
}

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
  margin-top: 2rem; /* cách content trên */
  background: white;
  padding: 1.5rem; /* padding rộng hơn để dễ nhìn */
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem; /* khoảng cách xuống nội dung */
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
</style>
