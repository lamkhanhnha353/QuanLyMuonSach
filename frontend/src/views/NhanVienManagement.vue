<template>
  <div class="container-fluid pt-1 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-md-6">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Nhân Viên
        </h3>
        <small class="text-muted">Xem và quản lý danh sách nhân viên trong hệ thống</small>
      </div>
      <div class="col-md-6 text-md-end mt-3 mt-md-0">
        <router-link to="/admin/nhanvien/add" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold">
          <i class="fas fa-plus me-2"></i> Thêm Nhân Viên
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
                placeholder="Tìm kiếm theo tên, MSNV, số điện thoại..."
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
            <i class="fas fa-users-cog fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Danh sách Nhân Viên</h5>
        </div>
      </div>

      <div class="card-body p-0 mt-3">
        <div class="table-responsive">
          <!-- Đã xóa class 'table-sm' để các hàng to và thoáng hơn -->
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <!-- Đổi text-xxs thành text-xs cho chữ to hơn -->
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 5%;">STT</th>
                <th class="ps-3 text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 12%;">MSNV</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 10%;">Avatar</th>
                <th class="ps-3 text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 20%;">Họ Tên</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%;">Điện Thoại</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 28%;">Địa Chỉ</th>
                <!-- Thêm pe-5 để tăng khoảng cách với lề phải -->
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7 pe-5" style="width: 10%;">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(nv, index) in paginatedNhanViens" :key="nv._id">
                <td class="text-center text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="ps-3">
                  <span class="text-secondary text-sm fw-bold">{{ nv.MSNV }}</span>
                </td>
                <td class="text-center">
                  <img
                    :src="nv.AVATAR || defaultAvatar"
                    class="avatar-sm rounded-circle"
                    alt="Avatar"
                    @error="$event.target.src = defaultAvatar"
                  >
                </td>
                <td class="ps-3">
                  <div class="d-flex flex-column">
                    <h6 class="mb-0 text-sm fw-bold text-dark">{{ nv.HoTenNV }}</h6>
                  </div>
                </td>
                <td>
                  <span class="text-secondary text-sm fw-bold">{{ nv.SoDienThoai }}</span>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0 text-truncate" style="max-width: 250px;" :title="nv.DiaChi">
                    {{ nv.DiaChi }}
                  </p>
                </td>
                <!-- Thêm pe-5 tương ứng ở body -->
                <td class="text-center pe-5">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-success mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      @click="openViewModal(nv)"
                      title="Xem chi tiết"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <router-link
                      :to="{ name: 'admin.nhanvien.edit', params: { id: nv._id }, query: { page: currentPage } }"
                      class="btn btn-icon-only btn-rounded btn-outline-info mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-danger mb-0 btn-sm d-flex align-items-center justify-content-center"
                      @click="openDeleteModal(nv)"
                      title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedNhanViens.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-user-slash fa-3x text-secondary opacity-25 mb-3"></i>
                    <p class="text-muted fw-bold">Không tìm thấy dữ liệu nhân viên nào.</p>
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

    <!-- Modal Xem Chi Tiết -->
    <div
      class="modal fade"
      id="viewNhanVienModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-primary">Thông Tin Chi Tiết</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4" v-if="selectedNhanVien">
            <div class="row">
              <div class="col-md-4 text-center">
                <img
                  :src="selectedNhanVien.AVATAR || defaultAvatar"
                  class="avatar-modal rounded-circle shadow-sm"
                  alt="Avatar"
                  @error="$event.target.src = defaultAvatar"
                >
                <h5 class="mt-3 fw-bold text-dark">{{ selectedNhanVien.HoTenNV }}</h5>
              </div>
              <div class="col-md-8">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="border-start border-primary border-3 ps-3">
                      <small class="text-muted fw-semibold">MSNV</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedNhanVien.MSNV }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border-start border-info border-3 ps-3">
                      <small class="text-muted fw-semibold">Email</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedNhanVien.EMAIL }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border-start border-warning border-3 ps-3">
                      <small class="text-muted fw-semibold">CCCD</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedNhanVien.CCCD }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border-start border-success border-3 ps-3">
                      <small class="text-muted fw-semibold">Điện Thoại</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedNhanVien.SoDienThoai }}</p>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="border-start border-danger border-3 ps-3">
                      <small class="text-muted fw-semibold">Địa Chỉ</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedNhanVien.DiaChi }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xóa -->
    <div
      class="modal fade"
      id="confirmDeleteNhanVienModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-danger">Xác nhận Xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-4" v-if="selectedNhanVien">
            <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
            </div>
            <p class="mb-1 text-muted">Bạn có chắc chắn muốn xóa Nhân Viên này?</p>
            <h5 class="fw-bold text-dark">{{ selectedNhanVien.HoTenNV }}</h5>
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
import NhanVienService from "@/services/nhanvien.service";
import { Modal } from "bootstrap";

export default {
  name: "NhanVienManagement",
  data() {
    return {
      nhanViens: [],
      loading: true,
      searchText: "",

      viewModal: null,
      deleteModal: null,
      selectedNhanVien: null,

      // Toast Notification
      toastMessage: "",
      isToastError: false,

      // Pagination
      currentPage: 1,
      itemsPerPage: 5,
      defaultAvatar: "https://i.imgur.com/sC21Kna.png",
    };
  },
  computed: {
    filteredNhanViens() {
      let filtered = this.nhanViens;
      // Exclude the current admin user from the list
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.MSNV) {
        filtered = filtered.filter(nv => nv.MSNV !== currentUser.MSNV);
      }
      if (!this.searchText) {
        return filtered;
      }
      const lowerSearch = this.searchText.toLowerCase();
      return filtered.filter(
        (nv) =>
          nv.HoTenNV.toLowerCase().includes(lowerSearch) ||
          nv.MSNV.toLowerCase().includes(lowerSearch) ||
          (nv.SoDienThoai && nv.SoDienThoai.includes(lowerSearch))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredNhanViens.length / this.itemsPerPage);
    },
    paginatedNhanViens() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNhanViens.slice(start, end);
    },
  },
  methods: {
    async retrieveNhanViens() {
      this.loading = true;
      try {
        const response = await NhanVienService.getAll();
        this.nhanViens = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      } finally {
        this.loading = false;
      }
    },

    openViewModal(nhanVien) {
      this.selectedNhanVien = nhanVien;
      this.viewModal.show();
    },

    openDeleteModal(nhanVien) {
      this.selectedNhanVien = nhanVien;
      this.deleteModal.show();
    },

    async handleDelete() {
      if (!this.selectedNhanVien) return;
      try {
        await NhanVienService.delete(this.selectedNhanVien._id);
        this.deleteModal.hide();
        this.retrieveNhanViens(); // Tải lại danh sách

        // Hiển thị thông báo thành công
        this.toastMessage = "Đã xóa nhân viên thành công.";
        this.isToastError = false;
        setTimeout(() => { this.toastMessage = "" }, 3000);

      } catch (error) {
        // Hiển thị thông báo lỗi
        this.toastMessage = "Không thể xóa nhân viên này. Có thể đang có ràng buộc dữ liệu.";
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
    this.retrieveNhanViens();
    this.viewModal = new Modal(document.getElementById("viewNhanVienModal"));
    this.deleteModal = new Modal(document.getElementById("confirmDeleteNhanVienModal"));

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

/* Avatar Styles */
.avatar-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.avatar-modal {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e9ecef;
  margin-top: 1rem;
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