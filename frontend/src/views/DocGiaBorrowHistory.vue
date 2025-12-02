<template>
  <div class="docgia-borrow-history">
    <div class="bg-decoration-circle-1"></div>
    <div class="bg-decoration-circle-2"></div>

    <div class="container py-5 position-relative">
      <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div class="card-header header-gradient border-0 pt-4 pb-4 px-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 class="page-title mb-1 text-white">
              <i class="fas fa-history me-2 opacity-75"></i>Lịch sử mượn / trả sách
            </h2>
            <p class="text-white-50 small mb-0">Theo dõi quá trình và trạng thái các cuốn sách của bạn</p>
          </div>
          <div class="d-none d-md-block">
             <i class="fas fa-book-reader fa-3x text-white opacity-25"></i>
          </div>
        </div>

        <div class="card-body px-4 pb-4 bg-white">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
          </div>

          <div v-else-if="borrowHistory.length === 0" class="text-center py-5 empty-state">
            <div class="mb-4 icon-wrapper">
              <i class="fas fa-book-open fa-3x text-primary opacity-50"></i>
            </div>
            <h5 class="fw-bold text-dark">Chưa có lịch sử mượn sách</h5>
            <p class="text-muted mb-4">Bạn chưa thực hiện giao dịch mượn/trả nào. Hãy ghé thăm thư viện nhé!</p>
            <router-link to="/books" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
              <i class="fas fa-search me-2"></i> Khám phá sách ngay
            </router-link>
          </div>

          <div v-else class="history-table-container">
            <div class="table-responsive mt-3">
              <table class="table table-hover align-middle custom-table">
                <thead class="table-light-custom text-secondary">
                  <tr>
                    <th scope="col" class="ps-4 py-3 rounded-start">#</th>
                    <th scope="col" class="py-3">Sách</th>
                    <th scope="col" class="py-3">Ngày mượn</th>
                    <th scope="col" class="py-3">Ngày trả</th>
                    <th scope="col" class="py-3">Trạng thái</th>
                    <th scope="col" class="text-end pe-4 py-3 rounded-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(record, index) in paginatedHistory" :key="record._id">
                    <td class="ps-4 fw-bold text-secondary number-cell">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="book-image-wrapper me-3 shadow-sm">
                          <img v-if="record.sachInfo && record.sachInfo.HinhAnh" :src="record.sachInfo.HinhAnh" alt="Book Cover" class="book-cover">
                          <img v-else src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" alt="Book Cover" class="book-cover">
                        </div>
                        <div class="book-info">
                          <h6 class="mb-1 text-dark fw-bold book-title">{{ record.tenSach }}</h6>
                          <div class="d-flex align-items-center">
                             <span class="badge bg-light text-secondary border me-2" v-if="record.sachInfo">Tác giả: {{ record.sachInfo.TACGIA }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="text-muted fw-medium">
                        <div class="d-flex align-items-center">
                            <i class="far fa-calendar-alt me-2 text-primary opacity-75"></i> 
                            {{ formatDate(record.ngayMuon) }}
                        </div>
                    </td>
                    <td class="text-muted fw-medium">
                        <div class="d-flex align-items-center">
                            <i class="far fa-calendar-check me-2 text-success opacity-75"></i> 
                            {{ formatDate(record.ngayTraThucTe || record.ngayTra) }}
                        </div>
                    </td>
                    
                    <td>
                      <span
                        :class="getStatusClass(record.trangThai)"
                        class="badge rounded-pill px-3 py-2 fw-normal status-badge shadow-sm"
                      >
                        <i class="fas fa-circle me-1 small status-dot"></i>
                        {{ getStatusText(record.trangThai) }}
                      </span>
                    </td>

                    <td class="text-end pe-4">
                      <button
                        @click="viewBookDetails(record)"
                        class="btn btn-light text-primary btn-sm rounded-pill px-3 hover-scale shadow-sm border"
                        title="Xem chi tiết sách"
                      >
                        <i class="fas fa-info-circle me-1"></i> Chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <nav aria-label="Page navigation" class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
              <p class="text-muted small mb-0">Hiển thị trang {{ currentPage }} trên {{ totalPages }}</p>
              <ul class="pagination justify-content-center mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link rounded-circle mx-1" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link rounded-circle mx-1" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link rounded-circle mx-1" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="borrowAgainModal" tabindex="-1" aria-labelledby="borrowAgainModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light border-bottom-0">
            <h5 class="modal-title fw-bold" id="borrowAgainModalLabel">Xác nhận mượn lại</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="mb-3">
                  <i class="fas fa-sync-alt fa-3x text-success mb-3"></i>
            </div>
            <p v-if="selectedBook" class="mb-1">
              Bạn có muốn mượn lại cuốn: <br>
              <strong class="fs-5 text-primary">{{ selectedBook.tenSach }}</strong>
            </p>
            <p class="text-muted small mt-2">Sách sẽ được thêm vào danh sách yêu cầu mượn.</p>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy bỏ</button>
            <button type="button" @click="confirmBorrowAgain" class="btn btn-success rounded-pill px-4 ms-2" data-bs-dismiss="modal">
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Logic giữ nguyên 100%
import MuonSachService from "@/services/muonsach.service";
import SachService from "@/services/sach.service";
import AuthService from "@/services/auth.service";
import { Modal } from "bootstrap";

export default {
  name: "DocGiaBorrowHistory",
  data() {
    return {
      borrowHistory: [],
      loading: true,
      selectedBook: null,
      borrowAgainModal: null,
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.borrowHistory.length / this.itemsPerPage);
    },
    paginatedHistory() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.borrowHistory.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    async fetchBorrowHistory() {
      const user = AuthService.getCurrentUser();
      if (!user) {
        this.$router.push("/login");
        return;
      }

      try {
        this.loading = true;
        const response = await MuonSachService.getForDocGia(user._id);
        const rawHistory = response.data || [];

        // Lấy thông tin sách cho mỗi phiếu mượn
        const historyWithInfo = await Promise.all(
          rawHistory.map(async (record) => {
            try {
              const sachResponse = await SachService.get(record.sachId);
              const sach = sachResponse.data || sachResponse;
              return {
                ...record,
                tenSach: sach ? sach.TENSACH : "N/A",
                sachInfo: sach,
              };
            } catch (error) {
              console.error("Error fetching book info:", error);
              return {
                ...record,
                tenSach: "Không tìm thấy sách",
                sachInfo: null,
              };
            }
          })
        );

        // Lọc chỉ hiển thị các trạng thái "đã trả", "quá hạn" và "từ chối"
        // Bao gồm cả sách đang mượn nhưng đã quá hạn
        const filteredHistory = historyWithInfo.filter(record => {
          if (record.trangThai === "đã trả" || record.trangThai === "từ chối") {
            return true;
          }
          if (record.trangThai === "quá hạn") {
            return true;
          }
          if (record.trangThai === "đang mượn") {
            // Kiểm tra nếu sách đã quá hạn
            const today = new Date();
            const dueDate = new Date(record.ngayTra);
            if (today > dueDate) {
              // Đánh dấu là quá hạn để hiển thị
              record.trangThai = "quá hạn";
              return true;
            }
          }
          return false;
        });

        // Sắp xếp theo ngày mượn mới nhất trước
        this.borrowHistory = filteredHistory.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
      } catch (error) {
        console.error("Error fetching borrow history:", error);
        alert("Không thể tải lịch sử mượn sách");
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    },

    getStatusText(status) {
      const statusMap = {
        "đang mượn": "Đang mượn",
        "đang chờ trả": "Chờ duyệt trả",
        "đã trả": "Đã trả",
        "quá hạn": "Quá hạn",
      };
      return statusMap[status] || status;
    },

    getStatusClass(status) {
      const classMap = {
        "đang mượn": "bg-primary",
        "đang chờ trả": "bg-warning",
        "đã trả": "bg-success",
        "quá hạn": "bg-danger",
      };
      return classMap[status] || "bg-secondary";
    },

    canBorrowAgain(record) {
      // Chỉ cho phép mượn lại nếu sách đã trả và còn hàng
      return record.trangThai === "đã trả" && record.sachInfo && record.sachInfo.SOLUONG > 0;
    },

    borrowAgain(book) {
      this.selectedBook = book;
      this.borrowAgainModal.show();
    },

    async confirmBorrowAgain() {
      if (!this.selectedBook) return;

      try {
        const user = AuthService.getCurrentUser();
        const borrowData = {
          docGiaId: user._id,
          sachId: this.selectedBook.sachId,
          ngayMuon: new Date(),
          ngayTra: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày sau
          trangThai: "đang mượn",
        };

        await MuonSachService.create(borrowData);
        alert("Đã thêm sách vào yêu cầu mượn. Vui lòng kiểm tra trang yêu cầu mượn của bạn.");
        this.$router.push("/docgia/requests");
      } catch (error) {
        console.error("Error borrowing again:", error);
        alert("Không thể mượn lại sách. Vui lòng thử lại.");
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    viewBookDetails(record) {
      if (record.sachId) {
        this.$router.push(`/books/${record.sachId}`);
      }
    },
  },

  mounted() {
    this.fetchBorrowHistory();
    this.borrowAgainModal = new Modal(document.getElementById("borrowAgainModal"));
  },
};
</script>

<style scoped>
/* 1. Background Gradient cho toàn trang */
.docgia-borrow-history {
  background: linear-gradient(135deg, #f0f4f8 0%, #d7e1ec 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 2. Các vòng tròn trang trí background (tạo hiệu ứng hiện đại) */
.bg-decoration-circle-1 {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(13, 110, 253, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    z-index: 0;
}

.bg-decoration-circle-2 {
    position: absolute;
    bottom: 50px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(13, 202, 240, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    z-index: 0;
}

/* 3. Header Gradient */
.header-gradient {
    /* Gradient màu xanh hiện đại */
    background: linear-gradient(120deg, #0d6efd 0%, #0dcaf0 100%);
    color: white;
}

.page-title {
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Tinh chỉnh bảng */
.table-light-custom th {
    background-color: #f8f9fc !important; /* Màu nền header bảng hơi xám xanh nhẹ */
    color: #4e5d78;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #eaecf0;
}

.custom-table tbody tr {
  transition: all 0.25s ease;
  border-bottom: 1px solid #f2f4f7;
}

.custom-table tbody tr:hover {
  background-color: #f8faff;
  transform: translateY(-2px);
  /* Bóng đổ khi hover vào hàng */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  z-index: 2;
  position: relative;
}

.custom-table td {
  padding: 1.2rem 0.5rem;
  border-bottom: none;
  font-size: 0.95rem;
}

.number-cell {
    color: #8da2fb !important; /* Số thứ tự có màu xanh nhạt */
}

/* Ảnh sách */
.book-image-wrapper {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.book-cover {
  width: 50px;
  height: 75px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.custom-table tbody tr:hover .book-cover {
  transform: scale(1.1);
}

.book-title {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
  color: #2c3e50;
}

/* Override Bootstrap Backgrounds for Softer Badges */
.status-badge {
    font-size: 0.85rem;
    border: 1px solid transparent;
}

.status-badge.bg-success {
  background-color: #e6f6ec !important; /* Xanh lá cực nhạt */
  color: #0d8a46 !important;
  border-color: #bbf7d0;
}

.status-badge.bg-primary {
  background-color: #ebf5ff !important;
  color: #0063d8 !important;
  border-color: #bfdbfe;
}

.status-badge.bg-warning {
  background-color: #fff9e6 !important;
  color: #b27b05 !important;
  border-color: #fde68a;
}

.status-badge.bg-danger {
  background-color: #fef2f2 !important;
  color: #dc2626 !important;
  border-color: #fecaca;
}

.status-dot {
    font-size: 6px;
    vertical-align: middle;
    margin-bottom: 1px;
}

/* Pagination Styling */
.page-link {
  border: none;
  color: #6c757d;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 50%;
  margin: 0 3px;
  background-color: transparent;
  transition: all 0.2s;
}

.page-link:hover {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(13, 110, 253, 0.3);
}

.page-item.disabled .page-link {
  background-color: transparent;
  color: #d1d5db;
}

/* Empty State Icon Wrapper */
.icon-wrapper {
  width: 90px;
  height: 90px;
  background-color: #ebf5ff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.hover-scale {
    transition: transform 0.2s;
}
.hover-scale:hover {
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .book-title {
    max-width: 150px;
  }
  .card-body {
    padding: 1rem !important;
  }
  .badge {
    font-size: 0.75rem;
  }
}
</style>