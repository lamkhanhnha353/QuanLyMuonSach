<template>
  <div class="container-fluid">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Quản lý Sách</h3>
    </div>

    <!-- Bộ lọc & tìm kiếm -->
    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <select class="form-select" v-model="filterStock">
              <option value="all">Tất cả sách</option>
              <option value="in_stock">Sách còn hàng</option>
              <option value="out_of_stock">Sách hết hàng</option>
            </select>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Nhập tên sách để tìm..."
                v-model="searchText"
              >
              <button class="btn btn-info" type="button" @click="search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-3 text-end">
            <router-link to="/admin/sach/add" class="btn btn-primary w-100">
              <i class="fas fa-plus me-2"></i> Thêm Sách Mới
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="card bg-dark text-white mb-4">
      <div class="card-header">
        <i class="fas fa-book me-2"></i> Danh sách Sách
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">STT</th>
                <th>Tên Sách</th>
                <th style="width: 130px;">Tổng số sách</th>
                <th>Tác Giả</th>
                <th style="width: 100px;">Năm SX</th>
                <th style="width: 140px;">SL sách hiện tại</th>
                <th style="width: 130px; text-align: center;">Trạng thái</th>
                <th style="width: 150px; text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in paginatedBooks" :key="book._id">
                <td style="text-align: center;">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td>{{ book.TENSACH }}</td>
                <td>{{ book.SOQUYEN }}</td>
                <td>{{ book.TACGIA }}</td>
                <td>{{ book.NAMXUATBAN }}</td>
                <td>{{ book.SOQUYEN }}</td>
                <td style="text-align: center;">
                  <span 
                    class="badge px-3 py-2 fw-bold"
                    :class="book.SOQUYEN > 0 ? 'bg-success' : 'bg-danger'"
                  >
                    {{ book.SOQUYEN > 0 ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button 
                    class="btn btn-info btn-sm me-1" 
                    title="Xem chi tiết"
                    @click="viewDetails(book)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <router-link 
                    :to="{ name: 'admin.sach.edit', params: { id: book._id } }"
                    class="btn btn-warning btn-sm me-1" 
                    title="Sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>

                  <!-- Chỉnh đây -->
                  <button 
                    class="btn btn-danger btn-sm" 
                    title="Xóa"
                    @click="confirmDelete(book)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredBooks.length === 0">
                <td colspan="8" class="text-center">Không tìm thấy cuốn sách nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="card-footer" v-if="totalPages > 1">
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Trang trước</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Trang sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal chi tiết sách -->
    <div 
      class="modal fade" 
      id="sachDetailModal" 
      tabindex="-1" 
      aria-labelledby="sachDetailModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="sachDetailModalLabel">
              <i class="fas fa-book-reader me-2"></i> 
              Chi tiết Sách: {{ selectedBook?.TENSACH }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedBook">
            <div class="row">
              <div class="col-md-4 text-center">
                <img 
                  :src="selectedBook.HinhAnh || 'https://via.placeholder.com/200?text=No+Image'" 
                  class="img-fluid rounded mb-3" 
                  style="width: 200px; height: 250px; object-fit: cover;"
                  @error="(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }"
                >
                <h4>{{ selectedBook.TENSACH }}</h4>
                <p class="text-muted">{{ selectedBook.TACGIA }}</p>
              </div>
              <div class="col-md-8">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item bg-dark text-white">
                    <strong>Tên sách:</strong> {{ selectedBook.TENSACH }}
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Tác giả:</strong> {{ selectedBook.TACGIA }}
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Nhà xuất bản (Mã):</strong> {{ selectedBook.MANXB }}
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Năm xuất bản:</strong> {{ selectedBook.NAMXUATBAN }}
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Đơn giá:</strong> {{ selectedBook.DONGIA }} VNĐ
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Tổng số quyển:</strong> {{ selectedBook.SOQUYEN }}
                  </li>
                  <li class="list-group-item bg-dark text-white">
                    <strong>Trạng thái:</strong> 
                    <span :class="selectedBook.SOQUYEN > 0 ? 'text-success' : 'text-danger'">
                      {{ selectedBook.SOQUYEN > 0 ? 'Còn hàng' : ' Hết hàng' }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle text-danger me-2"></i> Xác nhận xóa
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sách <strong>{{ bookToDelete?.TENSACH }}</strong> không?</p>
            <p class="text-danger mb-0"><small>Hành động này không thể hoàn tác!</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger" @click="handleDeleteConfirm">Xóa</button>
          </div>
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
    };
  },
  computed: {
    filteredBooks() {
      let filtered = this.books;
      if (this.filterStock === "in_stock") filtered = filtered.filter(b => b.SOQUYEN > 0);
      else if (this.filterStock === "out_of_stock") filtered = filtered.filter(b => b.SOQUYEN === 0);

      if (this.searchText.trim()) {
        const lower = this.searchText.trim().toLowerCase();
        filtered = filtered.filter(b => b.TENSACH.toLowerCase().includes(lower));
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
  },
  methods: {
    async retrieveBooks() {
      try {
        const response = await SachService.getAll();
        this.books = response.data;
      } catch (error) {
        console.error(error);
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
      } catch (error) {
        alert("Không thể xóa sách.");
      }
    },
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    search() {
      this.currentPage = 1;
    },
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
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.form-control, .form-select {
  background-color: #212529;
  color: #fff;
  border: 1px solid #495057;
}
.form-control:focus, .form-select:focus {
  background-color: #212529;
  color: #fff;
  border-color: #58a6ff;
  box-shadow: 0 0 0 0.25rem rgba(88, 166, 255, 0.25);
}
.page-link {
  background-color: #212529;
  color: #c9d1d9;
  border-color: #495057;
  cursor: pointer;
}
.page-link:hover {
  background-color: #343a40;
}
.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}
.page-item.disabled .page-link {
  background-color: #343a40;
  color: #6c757d;
  border-color: #495057;
  cursor: not-allowed;
}
::placeholder{
    color: #ffffff9b;
    font-style: italic;
}
</style>
