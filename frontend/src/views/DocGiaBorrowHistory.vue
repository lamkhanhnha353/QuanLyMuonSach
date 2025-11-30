<template>
  <div class="docgia-borrow-history">
    <div class="container-fluid px-3">
      <div class="history-container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="page-title">Lịch sử mượn / trả sách</h2>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="borrowHistory.length === 0" class="text-center py-5">
          <i class="fas fa-history fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Chưa có lịch sử mượn sách</h5>
          <p class="text-muted">Hãy khám phá và mượn sách từ thư viện của chúng tôi!</p>
          <router-link to="/books" class="btn btn-primary">
            <i class="fas fa-search me-2"></i> Khám phá sách
          </router-link>
        </div>

        <div v-else class="history-table-container">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tên sách</th>
                  <th scope="col">Ngày mượn</th>
                  <th scope="col">Ngày trả</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, index) in paginatedHistory" :key="record._id">
                  <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td>
                    <div class="book-info">
                      <strong>{{ record.tenSach }}</strong>
                    </div>
                  </td>
                  <td>{{ formatDate(record.ngayMuon) }}</td>
                  <td>{{ formatDate(record.ngayTraThucTe || record.ngayTra) }}</td>
                  <td>
                    <span
                      :class="getStatusClass(record.trangThai)"
                      class="badge"
                    >
                      {{ getStatusText(record.trangThai) }}
                    </span>
                  </td>
                  <td>
                    <button
                      v-if="canBorrowAgain(record)"
                      @click="borrowAgain(record)"
                      class="btn btn-sm btn-success"
                      title="Mượn lại sách"
                    >
                      <i class="fas fa-plus"></i> Mượn lại
                    </button>
                    <span v-else class="text-muted">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav aria-label="Page navigation" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận mượn lại sách -->
    <div class="modal fade" id="borrowAgainModal" tabindex="-1" aria-labelledby="borrowAgainModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="borrowAgainModalLabel">Xác nhận mượn lại sách</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="selectedBook">
              Bạn có chắc chắn muốn mượn lại sách "<strong>{{ selectedBook.tenSach }}</strong>" không?
            </p>
            <p class="text-muted">Sách sẽ được thêm vào yêu cầu mượn của bạn.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" @click="confirmBorrowAgain" class="btn btn-success" data-bs-dismiss="modal">
              Xác nhận mượn lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      itemsPerPage: 10,
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

        // Sắp xếp theo ngày mượn mới nhất trước
        this.borrowHistory = historyWithInfo.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
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
        "đang chờ trả": "Đang chờ duyệt trả",
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
  },

  mounted() {
    this.fetchBorrowHistory();
    this.borrowAgainModal = new Modal(document.getElementById("borrowAgainModal"));
  },
};
</script>

<style scoped>
.docgia-borrow-history {
  background-color: #f5f6f7;
  min-height: 100vh;
}

.history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 0;
}

.history-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #374151;
}

.table td {
  vertical-align: middle;
}

.book-info {
  max-width: 300px;
}

.book-info strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  font-size: 0.85em;
  padding: 0.4em 0.8em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  color: #0d6efd;
  border-color: #dee2e6;
}

.page-link:hover {
  color: #0b5ed7;
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }

  .book-info {
    max-width: 200px;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
