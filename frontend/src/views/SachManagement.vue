<template>
  <div class="container-fluid pt-1 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-md-6">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Sách
        </h3>
        <small class="text-muted">Xem và quản lý danh sách sách trong hệ thống</small>
      </div>
      <div class="col-md-6 text-md-end mt-3 mt-md-0">
        <router-link to="/admin/sach/add" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold">
          <i class="fas fa-plus me-2"></i> Thêm Sách Mới
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <div class="d-flex align-items-center">
              <span class="text-muted fw-semibold me-2 small text-nowrap">Trạng thái:</span>
              <select v-model="filterStock" @change="currentPage = 1" class="form-select form-select-sm border-light bg-light fw-bold text-dark shadow-none cursor-pointer">
                <option value="all">Tất cả sách</option>
                <option value="in_stock">Sách còn hàng</option>
                <option value="out_of_stock">Sách hết hàng</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary ps-3">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Tìm kiếm theo tên sách, tác giả..."
                v-model="searchText"
                @keyup.enter="currentPage = 1"
              />
              <button class="btn btn-primary px-4 fw-bold" type="button" @click="currentPage = 1">
                Tìm kiếm
              </button>
            </div>
          </div>
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
            <i class="fas fa-book fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Danh sách Sách</h5>
        </div>
      </div>

      <div class="card-body p-0 mt-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 5%;">STT</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 8%;">Ảnh</th>
                <th class="ps-3 text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 25%;">Tên Sách</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%;">Tác Giả</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 10%;">Năm XB</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 10%;">Số Lượng</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 12%;">Trạng Thái</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7 pe-5" style="width: 15%;">Hành Động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(book, index) in paginatedBooks" :key="book._id">
                <td class="text-center text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <img
                    :src="book.HinhAnh || defaultImage"
                    class="avatar-sm rounded shadow-sm"
                    alt="Book cover"
                    @error="$event.target.src = defaultImage"
                  >
                </td>
                <td class="ps-3">
                  <div class="d-flex flex-column">
                    <h6 class="mb-0 text-sm fw-bold text-dark">{{ book.TENSACH }}</h6>
                    <small class="text-muted">{{ formatCurrency(book.DONGIA) }}</small>
                  </div>
                </td>
                <td>
                  <span class="text-secondary text-sm fw-bold">{{ book.TACGIA }}</span>
                </td>
                <td>
                  <span class="text-secondary text-sm fw-bold">{{ book.NAMXUATBAN }}</span>
                </td>
                <td class="text-center">
                  <span class="badge bg-primary px-3 py-2 fw-bold">{{ book.SOQUYEN }}</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge px-3 py-2 fw-bold"
                    :class="book.SOQUYEN > 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'"
                  >
                    {{ book.SOQUYEN > 0 ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </td>
                <td class="text-center pe-5">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-success mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      @click="viewDetails(book)"
                      title="Xem chi tiết"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <router-link
                      :to="{ name: 'admin.sach.edit', params: { id: book._id } }"
                      class="btn btn-icon-only btn-rounded btn-outline-info mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-danger mb-0 btn-sm d-flex align-items-center justify-content-center"
                      @click="confirmDelete(book)"
                      title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedBooks.length === 0">
                <td colspan="8" class="text-center py-5">
                  <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-book-slash fa-3x text-secondary opacity-25 mb-3"></i>
                    <p class="text-muted fw-bold">Không tìm thấy cuốn sách nào.</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8" class="text-center py-5">
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

      <!-- Pagination Compact (Đã chỉnh sửa logic) -->
      <div class="card-footer bg-white border-top-0 py-3" v-if="!loading && totalPages > 1">
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mb-0">
            <!-- Nút Previous -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link border-0 rounded-circle mx-1" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>

            <!-- Logic hiển thị trang thông minh (1 ... 4 5 6 ... 10) -->
            <li 
              v-for="page in visiblePages" 
              :key="page" 
              class="page-item" 
              :class="{ active: page === currentPage, disabled: page === '...' }"
            >
              <a class="page-link border-0 rounded-circle mx-1 shadow-sm" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>

            <!-- Nút Next -->
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
    <div class="modal fade" id="sachDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-primary">Thông Tin Chi Tiết Sách</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4" v-if="selectedBook">
            <div class="row">
              <div class="col-md-4 text-center">
                <img
                  :src="selectedBook.HinhAnh || defaultImage"
                  class="avatar-modal rounded shadow-sm"
                  alt="Book cover"
                  @error="$event.target.src = defaultImage"
                >
                <h5 class="mt-3 fw-bold text-dark">{{ selectedBook.TENSACH }}</h5>
                <p class="text-muted mb-0">{{ selectedBook.TACGIA }}</p>
              </div>
              <div class="col-md-8">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="border-start border-primary border-3 ps-3">
                      <small class="text-muted fw-semibold">Mã Sách</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedBook._id }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border-start border-info border-3 ps-3">
                      <small class="text-muted fw-semibold">Mã NXB</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedBook.MANXB }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border-start border-success border-3 ps-3">
                      <small class="text-muted fw-semibold">Đơn Giá</small>
                      <p class="mb-0 fw-bold text-dark">{{ formatCurrency(selectedBook.DONGIA) }}</p>
                    </div>
                  </div>
                   <div class="col-md-6">
                    <div class="border-start border-danger border-3 ps-3">
                      <small class="text-muted fw-semibold">Số Lượng</small>
                      <p class="mb-0 fw-bold text-dark">{{ selectedBook.SOQUYEN }}</p>
                    </div>
                  </div>
                   <div class="col-12">
                     <div class="border-start border-secondary border-3 ps-3">
                      <small class="text-muted fw-semibold">Mô Tả</small>
                      <p class="mb-0 text-dark small">{{ selectedBook.MOTA || "Chưa có mô tả." }}</p>
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

    <!-- Modal Xác Nhận Xóa -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0 bg-danger bg-opacity-10">
            <div class="d-flex align-items-center">
               <h5 class="modal-title fw-bold text-danger mb-0">Xác Nhận Xóa</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4 text-center" v-if="bookToDelete">
             <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                <i class="fas fa-trash-alt fa-2x"></i>
            </div>
            <p class="mb-1 text-muted">Bạn có chắc chắn muốn xóa cuốn sách này?</p>
            <h5 class="fw-bold text-dark">{{ bookToDelete.TENSACH }}</h5>
            <small class="text-danger d-block mt-2">Hành động này không thể hoàn tác.</small>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold me-2" data-bs-dismiss="modal">
              Hủy
            </button>
            <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" @click="handleDeleteConfirm">
              Xóa Sách
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
import SachService from "@/services/sach.service";
import { Modal } from "bootstrap";

export default {
  name: "SachManagement",
  data() {
    return {
      books: [],
      searchText: "",
      filterStock: "all",
      currentPage: 1,
      itemsPerPage: 8,
      selectedBook: null,
      detailModal: null,
      confirmDeleteModal: null,
      bookToDelete: null,
      loading: true,
      defaultImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==",
      
      // Toast Notification
      toastMessage: "",
      isToastError: false,
    };
  },
  computed: {
    filteredBooks() {
      let filtered = this.books;
      if (this.filterStock === "in_stock") filtered = filtered.filter(b => b.SOQUYEN > 0);
      else if (this.filterStock === "out_of_stock") filtered = filtered.filter(b => b.SOQUYEN === 0);

      if (this.searchText.trim()) {
        const lower = this.searchText.trim().toLowerCase();
        filtered = filtered.filter(b => b.TENSACH.toLowerCase().includes(lower) || b.TACGIA.toLowerCase().includes(lower));
      }
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredBooks.slice(start, start + this.itemsPerPage);
    },
    // Logic phân trang thông minh (1 ... 4 5 6 ... 10)
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 1; // Số trang hiển thị xung quanh trang hiện tại
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
      return rangeWithDots;
    }
  },
  methods: {
    async retrieveBooks() {
      this.loading = true;
      try {
        const response = await SachService.getAll();
        this.books = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    viewDetails(book) {
      this.selectedBook = book;
      this.detailModal.show();
    },
    confirmDelete(book) {
      this.bookToDelete = book;
      this.confirmDeleteModal.show();
    },
    async handleDeleteConfirm() {
      try {
        await SachService.delete(this.bookToDelete._id);
        this.confirmDeleteModal.hide();
        this.retrieveBooks();
        
        // Hiển thị thông báo thành công
        this.showToast("Xóa sách thành công!");
      } catch (error) {
        this.showToast("Không thể xóa sách.", true);
      }
    },
    changePage(page) {
      if (page === '...') return;
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    search() {
      this.currentPage = 1;
    },
    formatCurrency(value) {
        if (!value) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
    // Hàm hiển thị Toast
    showToast(msg, isError = false) {
        this.toastMessage = msg;
        this.isToastError = isError;
        setTimeout(() => { this.toastMessage = "" }, 3000);
    }
  },
  watch: {
    filterStock() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.retrieveBooks();
    this.detailModal = new Modal(document.getElementById("sachDetailModal"));
    this.confirmDeleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.form-control, .form-select {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  transition: all 0.2s;
}

/* Input Group */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
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

/* Table & Text */
.text-xs { font-size: 0.75rem !important; }
.text-sm { font-size: 0.875rem !important; }
.text-xxs { font-size: 0.65rem !important; }
.table-hover tbody tr:hover { background-color: rgba(13, 110, 253, 0.04); }

/* Buttons */
.btn-icon-only { width: 2.25rem; height: 2.25rem; padding: 0; }

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
  cursor: not-allowed;
}
.page-link:hover:not(.active) {
  background-color: #e9ecef;
  color: #0d6efd;
}

.cursor-pointer { cursor: pointer; }

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
  object-fit: cover;
}
.avatar-modal {
  width: 150px;
  height: 200px; /* Tỉ lệ sách */
  object-fit: cover;
  border: 1px solid #e9ecef;
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
</style>