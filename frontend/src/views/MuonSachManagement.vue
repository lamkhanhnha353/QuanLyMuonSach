<template>
  <div class="container-fluid pt-2 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Phiếu Mượn
        </h3>
        <small class="text-muted">Theo dõi và xử lý yêu cầu mượn trả sách</small>
      </div>
    </div>

    <!-- Filter & Search Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="row g-3">
          <!-- Filter Status -->
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary"><i class="fas fa-filter"></i></span>
              <select class="form-select bg-light fw-medium text-secondary filter-select" v-model="filterTrangThai" @change="currentPage = 1">
                <option value="all">Tất cả trạng thái</option>
                <option value="chờ duyệt">Chờ duyệt</option>
                <option value="đã duyệt">Đã duyệt (Chờ lấy)</option>
                <option value="đang mượn">Đang mượn</option>
                <option value="đã trả">Đã trả</option>
                <option value="từ chối">Từ chối</option>
                <option value="trễ hạn">Trễ hạn</option>
              </select>
            </div>
          </div>
          
          <!-- Search Input -->
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary ps-3">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Tìm theo tên độc giả hoặc tên sách..."
                v-model="searchText"
                @keyup.enter="search"
              />
              <button class="btn btn-primary px-4 fw-bold" type="button" @click="search">
                Tìm kiếm
              </button>
            </div>
          </div>

          <!-- Items Per Page -->
          <div class="col-md-3 text-md-end">
            <div class="d-inline-flex align-items-center">
              <span class="text-muted fw-semibold me-2 small text-nowrap">Hiển thị:</span>
              <select v-model="itemsPerPage" @change="currentPage = 1" class="form-select form-select-sm w-auto border-light bg-light fw-bold text-dark shadow-none cursor-pointer">
                <option :value="5">5 dòng</option>
                <option :value="10">10 dòng</option>
                <option :value="20">20 dòng</option>
                <option :value="50">50 dòng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div class="d-flex align-items-center">
          <div class="icon-shape bg-primary text-white rounded-3 me-3 p-2">
            <i class="fas fa-receipt fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Danh sách phiếu mượn</h5>
        </div>
      </div>

      <div class="card-body p-0 mt-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4 text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 80px;">STT</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 35%;">Độc Giả & Sách</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Thời Gian</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Trạng Thái</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Người Xử Lý</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7 pe-4" style="width: 120px;">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(phieu, index) in paginatedPhieuMuons" :key="phieu._id">
                <td class="ps-4 text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="book-image-container me-3">
                      <img
                        v-if="phieu.hinhAnhSach"
                        :src="phieu.hinhAnhSach"
                        :alt="phieu.tenSach"
                        class="book-image rounded shadow-sm"
                        @error="handleImageError"
                      />
                      <div v-else class="book-image-placeholder rounded shadow-sm d-flex align-items-center justify-content-center bg-light">
                        <i class="fas fa-book text-secondary"></i>
                      </div>
                    </div>
                    <div class="d-flex flex-column">
                      <h6 class="mb-0 text-sm fw-bold text-dark">{{ phieu.tenDocGia }}</h6>
                      <span class="text-xs text-secondary text-truncate" style="max-width: 200px;">
                        <i class="fas fa-book me-1 text-primary opacity-50"></i> {{ phieu.tenSach }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-xs text-secondary mb-1">Mượn: <span class="text-dark fw-semibold">{{ formatDate(phieu.ngayMuon) }}</span></span>
                    <span class="text-xs text-secondary">Hẹn trả: <span class="text-dark fw-semibold">{{ formatDate(phieu.ngayTra) }}</span></span>
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 text-xxs border" :class="getStatusClass(phieu.trangThai)">
                    {{ phieu.trangThai }}
                  </span>
                </td>
                <td>
                  <span class="text-secondary text-sm">{{ phieu.tenNhanVien !== "N/A" ? phieu.tenNhanVien : "-" }}</span>
                </td>
                <td class="text-center pe-4">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-info mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      @click="openUpdateModal(phieu)"
                      title="Cập nhật trạng thái"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-danger mb-0 btn-sm d-flex align-items-center justify-content-center"
                      @click="openDeleteModal(phieu)"
                      title="Xóa phiếu"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedPhieuMuons.length === 0">
                <td colspan="6" class="text-center py-5">
                   <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-inbox fa-3x text-secondary opacity-25 mb-3"></i>
                    <p class="text-muted fw-bold">Không tìm thấy phiếu mượn nào.</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="text-muted mt-2">Đang tải dữ liệu...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="card-footer bg-white border-top-0 py-3" v-if="!loading && totalPages > 1">
        <nav>
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link border-0 rounded-circle mx-1" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link border-0 rounded-circle mx-1 shadow-sm" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link border-0 rounded-circle mx-1" href="#" @click.prevent="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Update Modal -->
    <div class="modal fade" id="updateStatusModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-primary">Cập nhật Trạng Thái</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4" v-if="selectedPhieu">
            <div class="mb-3 p-3 bg-light rounded-3">
                <div class="d-flex mb-2">
                    <span class="text-secondary me-2"><i class="fas fa-user me-1"></i> Độc giả:</span>
                    <span class="fw-bold text-dark">{{ selectedPhieu.tenDocGia }}</span>
                </div>
                <div class="d-flex">
                    <span class="text-secondary me-2"><i class="fas fa-book me-1"></i> Sách:</span>
                    <span class="fw-bold text-dark">{{ selectedPhieu.tenSach }}</span>
                </div>
            </div>
            
            <div class="form-group">
              <label class="form-label fw-semibold text-secondary">Chọn trạng thái mới:</label>
              <select class="form-select" v-model="newTrangThai">
                <option value="chờ duyệt">🕒 Chờ duyệt</option>
                <option value="đã duyệt">✅ Đã duyệt (Chờ lấy)</option>
                <option value="đang mượn">📖 Đang mượn</option>
                <option value="đã trả">📥 Đã trả</option>
                <option value="từ chối">⛔ Từ chối</option>
                <option value="trễ hạn">⚠️ Trễ hạn</option>
              </select>
            </div>
            <div v-if="updateError" class="alert alert-danger mt-3 d-flex align-items-center">
               <i class="fas fa-exclamation-circle me-2"></i> {{ updateError }}
            </div>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold" @click="handleUpdateStatus">
               <i class="fas fa-save me-2"></i> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-danger">Xác nhận Xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-4" v-if="selectedPhieu">
             <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                <i class="fas fa-trash-alt fa-2x"></i>
            </div>
            <p class="mb-2 text-muted">Bạn có chắc chắn muốn xóa phiếu mượn của</p>
            <h5 class="fw-bold text-dark mb-1">{{ selectedPhieu.tenDocGia }}</h5>
            <p class="text-muted small">Sách: <span class="fw-semibold">{{ selectedPhieu.tenSach }}</span></p>
            
            <div class="alert alert-warning d-flex align-items-start text-start mt-3 mb-0 small">
               <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
               <div>
                  Lưu ý: Nếu phiếu đang ở trạng thái "đang mượn" hoặc "đã duyệt", số lượng sách trong kho sẽ được hoàn trả tự động.
               </div>
            </div>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" @click="handleDelete">
               <i class="fas fa-trash me-2"></i> Xác nhận Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- TOAST NOTIFICATION -->
    <div v-if="toastMessage" class="toast-overlay">
      <div 
        class="toast show align-items-center text-white border-0 shadow-lg" 
        :class="isToastError ? 'bg-danger' : 'bg-success'"
        role="alert" 
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i :class="isToastError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'" class="me-2"></i>
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toastMessage = ''"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import NhanVienService from "@/services/nhanvien.service";
import AuthService from "@/services/auth.service";
import { Modal } from "bootstrap";

export default {
  name: "MuonSachManagement",
  data() {
    return {
      // Dữ liệu
      phieuMuons: [],
      docGias: [],
      sachs: [],
      nhanViens: [],

      loading: true,
      currentUser: null,

      // Filter & Search
      searchText: "",
      filterTrangThai: "all",

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      // Modals & Toast
      updateModal: null,
      deleteModal: null,
      selectedPhieu: null,
      newTrangThai: "chờ duyệt",
      updateError: "",
      
      toastMessage: "",
      isToastError: false,
    };
  },
  computed: {
    resolvedPhieuMuons() {
      return this.phieuMuons.map((phieu) => {
        const docGia = this.docGias.find((d) => d._id === phieu.docGiaId);
        const sach = this.sachs.find((s) => s._id === phieu.sachId);
        const nhanVien = this.nhanViens.find((n) => n._id === phieu.nhanVienId);

        return {
          ...phieu,
          tenDocGia: docGia ? `${docGia.HOLOT} ${docGia.TEN}` : "Không xác định",
          tenSach: sach ? sach.TENSACH : "Sách đã xóa",
          hinhAnhSach: sach ? sach.HinhAnh : null,
          tenNhanVien: nhanVien ? nhanVien.HoTenNV : "N/A",
        };
      });
    },
    filteredPhieuMuons() {
      let filtered = this.resolvedPhieuMuons;

      if (this.filterTrangThai !== "all") {
        filtered = filtered.filter((p) => p.trangThai === this.filterTrangThai);
      }

      if (this.searchText) {
        const lowerSearch = this.searchText.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.tenDocGia.toLowerCase().includes(lowerSearch) ||
            p.tenSach.toLowerCase().includes(lowerSearch)
        );
      }
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredPhieuMuons.length / this.itemsPerPage);
    },
    paginatedPhieuMuons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPhieuMuons.slice(start, end);
    },
  },
  methods: {
    async fetchAllData() {
      this.loading = true;
      try {
        const [phieuData, docGiaData, sachData, nhanVienData] = await Promise.all([
          MuonSachService.getAll(),
          DocGiaService.getAll(),
          SachService.getAll(),
          NhanVienService.getAll(),
        ]);

        this.phieuMuons = phieuData.data.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
        this.docGias = docGiaData.data;
        this.sachs = sachData.data;
        this.nhanViens = nhanVienData.data;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },

    getCurrentNhanVienId() {
      if (!this.currentUser) {
        this.currentUser = AuthService.getCurrentUser();
      }
      return this.currentUser ? this.currentUser._id : null;
    },

    // UPDATE STATUS
    openUpdateModal(phieu) {
      this.selectedPhieu = phieu;
      this.newTrangThai = phieu.trangThai;
      this.updateError = "";
      this.updateModal.show();
    },
    async handleUpdateStatus() {
      if (!this.selectedPhieu || !this.newTrangThai) return;

      const nhanVienId = this.getCurrentNhanVienId();
      if (!nhanVienId) {
        this.updateError = "Không thể xác thực nhân viên. Vui lòng đăng nhập lại.";
        return;
      }

      try {
        await MuonSachService.update(this.selectedPhieu._id, {
          trangThai: this.newTrangThai,
          nhanVienId: nhanVienId,
        });
        this.updateModal.hide();
        await this.fetchAllData();
        
        this.showToast("Cập nhật trạng thái thành công!");
      } catch (error) {
        this.updateError = error.response?.data?.message || "Lỗi khi cập nhật trạng thái.";
      }
    },

    // DELETE
    openDeleteModal(phieu) {
      this.selectedPhieu = phieu;
      this.deleteModal.show();
    },
    async handleDelete() {
      if (!this.selectedPhieu) return;
      try {
        await MuonSachService.delete(this.selectedPhieu._id);
        this.deleteModal.hide();
        await this.fetchAllData();
        this.showToast("Đã xóa phiếu mượn thành công!");
      } catch (error) {
        this.showToast("Không thể xóa phiếu mượn này.", true);
        this.deleteModal.hide();
      }
    },

    // UTILS
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    search() {
      this.currentPage = 1;
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    },
    getStatusClass(trangThai) {
      switch (trangThai) {
        case "đã trả": return "bg-success-subtle text-success";
        case "đang mượn": return "bg-info-subtle text-info";
        case "đã duyệt": return "bg-primary-subtle text-primary";
        case "chờ duyệt": return "bg-warning-subtle text-warning-emphasis";
        case "trễ hạn": return "bg-danger-subtle text-danger fw-bold";
        case "từ chối": return "bg-secondary-subtle text-secondary";
        default: return "bg-light text-dark";
      }
    },
    showToast(msg, isError = false) {
        this.toastMessage = msg;
        this.isToastError = isError;
        setTimeout(() => { this.toastMessage = "" }, 3000);
    },
    handleImageError(event) {
      // Hide the broken image and show placeholder
      event.target.style.display = 'none';
      const placeholder = event.target.nextElementSibling;
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }
  },
  watch: {
    filterTrangThai() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchAllData();
    this.currentUser = AuthService.getCurrentUser();
    this.updateModal = new Modal(document.getElementById("updateStatusModal"));
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

/* Input Group */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
}
.form-control, .form-select {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  transition: all 0.2s;
}
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

/* Status Select Options */
.form-select option {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0.125rem;
  background-color: #fff;
}

/* Filter Select Full Border */
.filter-select {
  border-radius: 0 !important;
}

/* Table & Text */
.text-xs {
    font-size: 0.75rem !important;
}
.text-sm {
    font-size: 0.875rem !important;
}
.text-xxs {
    font-size: 0.65rem !important;
}
.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.04);
}

/* Buttons */
.btn-icon-only {
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
}

/* Pagination */
.page-link {
  color: #6c757d;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-weight: 600;
  transition: all 0.2s;
}
.page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}
.page-item.disabled .page-link {
  background-color: #e9ecef;
  color: #adb5bd;
}
.page-link:hover:not(.active) {
  background-color: #e9ecef;
  color: #0d6efd;
}

.cursor-pointer {
    cursor: pointer;
}

.icon-shape {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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

/* Book Image Styles */
.book-image-container {
  flex-shrink: 0;
  width: 50px;
  height: 70px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

.book-image-placeholder {
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
