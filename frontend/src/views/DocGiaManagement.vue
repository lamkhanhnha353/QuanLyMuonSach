<template>
  <div class="container-fluid ">
    <!-- Header Section -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Độc Giả
        </h3>
        <small class="text-muted">Xem và quản lý danh sách độc giả trong hệ thống</small>
      </div>
      <div class="col-md-6 text-md-end mt-3 mt-md-0">
        <router-link to="/admin/docgia/add" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold">
          <i class="fas fa-plus me-2"></i> Thêm Độc Giả
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary ps-3">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Tìm kiếm theo tên, số điện thoại..."
                v-model="searchText"
                @keyup.enter="currentPage = 1"
              />
              <button class="btn btn-primary px-4 fw-bold" type="button" @click="currentPage = 1">
                Tìm kiếm
              </button>
            </div>
          </div>
          <div class="col-md-4 text-md-end">
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
            <i class="fas fa-users fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Danh sách Độc Giả</h5>
        </div>
      </div>

      <div class="card-body p-0 mt-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <!-- Tăng width và giữ padding cho STT -->
                <th class="ps-4 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7" style="width: 70px;">STT</th>
                <!-- Thêm ps-4 để tạo khoảng cách cho Họ Tên -->
                <th class="ps-4 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Họ Tên</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ngày Sinh</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Giới Tính</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Điện Thoại</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7" style="width: 25%;">Địa Chỉ</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7" style="width: 120px;">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(docgia, index) in paginatedDocGias" :key="docgia._id">
                <td class="ps-4 text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <!-- Thêm ps-4 tương ứng ở body -->
                <td class="ps-4">
                  <div class="d-flex flex-column">
                    <h6 class="mb-0 text-sm fw-bold text-dark">{{ docgia.HOLOT }} {{ docgia.TEN }}</h6>
                    <span class="text-xs text-secondary">{{ docgia.username }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-secondary text-sm fw-bold">{{ formatDate(docgia.NGAYSINH) }}</span>
                </td>
                <td>
                  <span class="badge rounded-pill px-3" 
                    :class="docgia.GIOITINH === 'Nam' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'">
                    {{ docgia.GIOITINH }}
                  </span>
                </td>
                <td>
                  <span class="text-secondary text-sm fw-bold">{{ docgia.DIENTHOAI }}</span>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0 text-truncate" style="max-width: 200px;" :title="docgia.DIACHI">
                    {{ docgia.DIACHI }}
                  </p>
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <router-link
                      :to="{ name: 'admin.docgia.edit', params: { id: docgia._id }, query: { page: currentPage } }"
                      class="btn btn-icon-only btn-rounded btn-outline-info mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-danger mb-0 btn-sm d-flex align-items-center justify-content-center"
                      @click="openDeleteModal(docgia)"
                      title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedDocGias.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-user-slash fa-3x text-secondary opacity-25 mb-3"></i>
                    <p class="text-muted fw-bold">Không tìm thấy dữ liệu độc giả nào.</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" class="text-center py-5">
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

    <!-- Modal Xóa -->
    <div
      class="modal fade"
      id="confirmDeleteDocGiaModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-danger">Xác nhận Xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-4" v-if="selectedDocGia">
            <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
            </div>
            <p class="mb-1 text-muted">Bạn có chắc chắn muốn xóa Độc Giả này?</p>
            <h5 class="fw-bold text-dark">{{ selectedDocGia.HOLOT }} {{ selectedDocGia.TEN }}</h5>
            <small class="text-muted d-block mt-2">Hành động này không thể hoàn tác.</small>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">
              Hủy bỏ
            </button>
            <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" @click="handleDelete">
              <i class="fas fa-trash me-2"></i> Xóa ngay
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
import DocGiaService from "@/services/docgia.service";
import { Modal } from "bootstrap";

export default {
  name: "DocGiaManagement",
  data() {
    return {
      docGias: [],
      loading: true,
      searchText: "",
      
      deleteModal: null,
      selectedDocGia: null,

      // Toast Notification
      toastMessage: "",
      isToastError: false,

      // Pagination
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredDocGias() {
      if (!this.searchText) {
        return this.docGias;
      }
      const lowerSearch = this.searchText.toLowerCase();
      return this.docGias.filter(
        (dg) =>
          dg.HOLOT.toLowerCase().includes(lowerSearch) ||
          dg.TEN.toLowerCase().includes(lowerSearch) ||
          (dg.DIENTHOAI && dg.DIENTHOAI.includes(lowerSearch))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredDocGias.length / this.itemsPerPage);
    },
    paginatedDocGias() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDocGias.slice(start, end);
    },
  },
  methods: {
    async retrieveDocGias() {
      this.loading = true;
      try {
        const response = await DocGiaService.getAll();
        this.docGias = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách độc giả:", error);
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },

    openDeleteModal(docgia) {
      this.selectedDocGia = docgia;
      this.deleteModal.show();
    },

    async handleDelete() {
      if (!this.selectedDocGia) return;
      try {
        await DocGiaService.delete(this.selectedDocGia._id);
        this.deleteModal.hide();
        this.retrieveDocGias(); // Tải lại danh sách
        
        // Hiển thị thông báo thành công
        this.toastMessage = "Đã xóa độc giả thành công.";
        this.isToastError = false;
        setTimeout(() => { this.toastMessage = "" }, 3000);

      } catch (error) {
        // Hiển thị thông báo lỗi
        this.toastMessage = "Không thể xóa độc giả này. Có thể đang có ràng buộc dữ liệu.";
        this.isToastError = true;
        this.deleteModal.hide();
        setTimeout(() => { this.toastMessage = "" }, 4000);
      }
    },

    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
  },
  mounted() {
    this.retrieveDocGias();
    this.deleteModal = new Modal(document.getElementById("confirmDeleteDocGiaModal"));

    // Set currentPage from query parameter if present
    const page = this.$route.query.page;
    if (page && parseInt(page) > 0) {
      this.currentPage = parseInt(page);
    }
  },
  watch: {
    '$route.query.page'(newPage) {
      if (newPage && parseInt(newPage) > 0) {
        this.currentPage = parseInt(newPage);
      }
    }
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

/* Input Group Styling */
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

/* Focus State */
.input-group:focus-within .input-group-text {
  background-color: #fff;
  border-color: #86b7fe;
  color: #0d6efd;
}
.input-group:focus-within .form-control {
  background-color: #fff;
  border-color: #86b7fe;
  box-shadow: none;
}
.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-radius: 0.375rem;
}

/* Table Styling */
.text-xxs {
    font-size: 0.75rem !important;
}
.text-sm {
    font-size: 0.875rem !important;
}
.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.04);
}

/* Button Icon Only */
.btn-icon-only {
    width: 2.375rem;
    height: 2.375rem;
    padding: 0;
}

/* Pagination Styling */
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

/* Toast Overlay Styles */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>