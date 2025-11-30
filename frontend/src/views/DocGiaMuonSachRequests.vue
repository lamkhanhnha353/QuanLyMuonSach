<template>
  <div class="docgia-muon-sach-requests">
    <div class="container-fluid px-3">
      <div class="requests-container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="page-title">Yêu cầu mượn của tôi</h2>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="requests.length === 0" class="text-center py-5">
          <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Bạn chưa có yêu cầu mượn sách nào</h5>
          <p class="text-muted">Hãy khám phá và mượn sách từ thư viện của chúng tôi!</p>
          <router-link to="/books" class="btn btn-primary">
            <i class="fas fa-search me-2"></i> Khám phá sách
          </router-link>
        </div>

        <div v-else class="requests-table-container">
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
                <tr v-for="(request, index) in requests" :key="request._id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="book-info">
                      <strong>{{ request.tenSach }}</strong>
                    </div>
                  </td>
                  <td>{{ formatDate(request.ngayMuon) }}</td>
                  <td>{{ formatDate(request.ngayTra) }}</td>
                  <td>
                    <span
                      :class="getStatusClass(request.trangThai)"
                      class="badge"
                    >
                      {{ getStatusText(request.trangThai) }}
                    </span>
                  </td>
                  <td>
                    <button
                      v-if="request.trangThai === 'chờ duyệt'"
                      @click="cancelRequest(request)"
                      class="btn btn-sm btn-outline-danger"
                      title="Hủy yêu cầu"
                    >
                      <i class="fas fa-times"></i> Hủy
                    </button>
                    <span v-else class="text-muted">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận hủy -->
    <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cancelModalLabel">Xác nhận hủy yêu cầu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="selectedRequest">
              Bạn có chắc chắn muốn hủy yêu cầu mượn sách "<strong>{{ selectedRequest.tenSach }}</strong>" không?
            </p>
            <p class="text-muted">Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" @click="confirmCancel" class="btn btn-danger" data-bs-dismiss="modal">
              Xác nhận hủy
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
  name: "DocGiaMuonSachRequests",
  data() {
    return {
      requests: [],
      loading: true,
      selectedRequest: null,
      cancelModal: null,
    };
  },
  methods: {
    async fetchRequests() {
      const user = AuthService.getCurrentUser();
      if (!user) {
        this.$router.push("/login");
        return;
      }

      try {
        this.loading = true;
        const response = await MuonSachService.getForDocGia(user._id);
        const rawRequests = response.data || [];

        // Lấy thông tin sách cho mỗi yêu cầu
        const requestsWithBookInfo = await Promise.all(
          rawRequests.map(async (request) => {
            try {
              const sachResponse = await SachService.get(request.sachId);
              const sach = sachResponse.data || sachResponse;
              return {
                ...request,
                tenSach: sach ? sach.TENSACH : "N/A",
              };
            } catch (error) {
              console.error("Error fetching book info:", error);
              return {
                ...request,
                tenSach: "Không tìm thấy sách",
              };
            }
          })
        );

        this.requests = requestsWithBookInfo;
      } catch (error) {
        console.error("Error fetching requests:", error);
        this.$bvToast.toast("Không thể tải danh sách yêu cầu", {
          title: "Lỗi",
          variant: "danger",
          solid: true,
        });
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
        "chờ duyệt": "Chờ duyệt",
        "đã duyệt": "Đã duyệt",
        "đang mượn": "Đang mượn",
        "đã trả": "Đã trả",
        "từ chối": "Từ chối",
      };
      return statusMap[status] || status;
    },

    getStatusClass(status) {
      const classMap = {
        "chờ duyệt": "bg-warning text-dark",
        "đã duyệt": "bg-info text-white",
        "đang mượn": "bg-primary",
        "đã trả": "bg-success",
        "từ chối": "bg-danger",
      };
      return classMap[status] || "bg-secondary";
    },

    cancelRequest(request) {
      this.selectedRequest = request;
      this.cancelModal.show();
    },

    async confirmCancel() {
      if (!this.selectedRequest) return;

      try {
        await MuonSachService.delete(this.selectedRequest._id);
        alert("Đã hủy yêu cầu mượn sách thành công");
        await this.fetchRequests(); // Tải lại danh sách
      } catch (error) {
        console.error("Error canceling request:", error);
        alert("Không thể hủy yêu cầu. Vui lòng thử lại.");
      }
    },
  },

  mounted() {
    this.fetchRequests();
    this.cancelModal = new Modal(document.getElementById("cancelModal"));
  },
};
</script>

<style scoped>
.docgia-muon-sach-requests {
  background-color: #f5f6f7;
  min-height: 100vh;
}

.requests-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 0;
}

.requests-table-container {
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
