  <template>
    <div class="docgia-borrowed-books">
      <div class="container-fluid px-3">
        <div class="borrowed-books-container py-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="page-title">Sách đang mượn</h2>
          </div>

          <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <div v-else-if="borrowedBooks.length === 0" class="text-center py-5">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Bạn chưa mượn sách nào</h5>
            <p class="text-muted">Hãy khám phá và mượn sách từ thư viện của chúng tôi!</p>
            <router-link to="/books" class="btn btn-primary">
              <i class="fas fa-search me-2"></i> Khám phá sách
            </router-link>
          </div>

          <div v-else class="books-table-container">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Ngày mượn</th>
                    <th scope="col">Ngày trả dự kiến</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(book, index) in borrowedBooks" :key="book._id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="book-info">
                        <strong>{{ book.tenSach }}</strong>
                      </div>
                    </td>
                    <td>{{ formatDate(book.ngayMuon) }}</td>
                    <td>{{ formatDate(book.ngayTra) }}</td>
                    <td>
                      <span
                        :class="getStatusClass(book.trangThai)"
                        class="badge"
                      >
                        {{ getStatusText(book.trangThai) }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="book.trangThai === 'đang mượn'"
                        @click="requestReturn(book)"
                        class="btn btn-sm btn-outline-warning"
                        title="Yêu cầu trả sách"
                      >
                        <i class="fas fa-undo"></i> Trả sách
                      </button>
                      <span v-else-if="book.trangThai === 'đang chờ trả'" class="text-info">
                        <i class="fas fa-clock"></i> Đang chờ duyệt
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận yêu cầu trả sách -->
      <div class="modal fade" id="returnModal" tabindex="-1" aria-labelledby="returnModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="returnModalLabel">Xác nhận yêu cầu trả sách</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p v-if="selectedBook">
                Bạn có chắc chắn muốn gửi yêu cầu trả sách "<strong>{{ selectedBook.tenSach }}</strong>" không?
              </p>
              <p class="text-muted">Nhân viên sẽ xác nhận và cập nhật trạng thái sách.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" @click="confirmReturnRequest" class="btn btn-warning" data-bs-dismiss="modal">
                Xác nhận yêu cầu
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
    name: "DocGiaBorrowedBooks",
    data() {
      return {
        borrowedBooks: [],
        loading: true,
        selectedBook: null,
        returnModal: null,
      };
    },
    methods: {
      async fetchBorrowedBooks() {
        const user = AuthService.getCurrentUser();
        if (!user) {
          this.$router.push("/login");
          return;
        }

        try {
          this.loading = true;
          const response = await MuonSachService.getForDocGia(user._id);
          const rawBooks = response.data || [];

          // Lọc sách đang mượn hoặc đang chờ trả
          const borrowedOnly = rawBooks.filter(book => book.trangThai === 'đang mượn' || book.trangThai === 'đang chờ trả');

          // Lấy thông tin sách cho mỗi phiếu mượn
          const booksWithInfo = await Promise.all(
            borrowedOnly.map(async (book) => {
              try {
                const sachResponse = await SachService.get(book.sachId);
                const sach = sachResponse.data || sachResponse;
                return {
                  ...book,
                  tenSach: sach ? sach.TENSACH : "N/A",
                };
              } catch (error) {
                console.error("Error fetching book info:", error);
                return {
                  ...book,
                  tenSach: "Không tìm thấy sách",
                };
              }
            })
          );

          this.borrowedBooks = booksWithInfo;
        } catch (error) {
          console.error("Error fetching borrowed books:", error);
          alert("Không thể tải danh sách sách đang mượn");
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
        };
        return statusMap[status] || status;
      },

      getStatusClass(status) {
        const classMap = {
          "đang mượn": "bg-primary",
          "đang chờ trả": "bg-warning",
        };
        return classMap[status] || "bg-secondary";
      },

      requestReturn(book) {
        this.selectedBook = book;
        this.returnModal.show();
      },

      async confirmReturnRequest() {
        if (!this.selectedBook) return;

        try {
          // Gửi yêu cầu cập nhật trạng thái thành "đang chờ trả"
          // Giả sử backend có trạng thái "đang chờ trả" hoặc tương tự
          // Ở đây chúng ta sẽ cập nhật thành "đang chờ trả" (cần thêm vào backend nếu chưa có)
          // Hoặc có thể dùng một API riêng cho yêu cầu trả sách

          // Tạm thời dùng update với trạng thái mới, nhưng cần backend hỗ trợ
          // Giả sử backend có trạng thái "đang chờ trả"
          await MuonSachService.update(this.selectedBook._id, {
            trangThai: "đang chờ trả", // Cần thêm trạng thái này vào backend
            nhanVienId: null, // Hoặc ID của nhân viên xử lý
          });

          alert("Đã gửi yêu cầu trả sách thành công. Nhân viên sẽ xác nhận.");
          await this.fetchBorrowedBooks(); // Tải lại danh sách
        } catch (error) {
          console.error("Error requesting return:", error);
          alert("Không thể gửi yêu cầu trả sách. Vui lòng thử lại.");
        }
      },
    },

    mounted() {
      this.fetchBorrowedBooks();
      this.returnModal = new Modal(document.getElementById("returnModal"));
    },
  };
  </script>

  <style scoped>
  .docgia-borrowed-books {
    background-color: #f5f6f7;
    min-height: 100vh;
  }

  .borrowed-books-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-title {
    color: #1f2937;
    font-weight: 700;
    margin-bottom: 0;
  }

  .books-table-container {
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

  @media (max-width: 768px) {
    .table-responsive {
      font-size: 0.9rem;
    }

    .book-info {
      max-width: 200px;
    }
  }
  </style>
