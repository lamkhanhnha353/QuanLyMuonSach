n<template>
  <div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-dark">Quản lý Sách</h3>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus me-2"></i> Thêm Sách Mới
      </button>
    </div>

    <!-- Bộ lọc & tìm kiếm -->
    <div class="card mb-4">
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
        </div>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="card mb-4">
      <div class="card-header">
        <i class="fas fa-book me-2"></i> Danh sách Sách
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
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

                  <button
                    class="btn btn-warning btn-sm me-1"
                    title="Sửa"
                    @click="openEditModal(book)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>

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

    <!-- Modal Thêm/Sửa Sách -->
    <div class="modal fade" id="sachModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? 'Cập Nhật Sách' : 'Thêm Sách Mới' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSach">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Tên Sách <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="formData.TENSACH" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tác Giả <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="formData.TACGIA" required>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Nhà Xuất Bản</label>
                  <input type="text" class="form-control" v-model="formData.MANXB">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Năm Xuất Bản</label>
                  <input type="number" class="form-control" v-model="formData.NAMXUATBAN">
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Đơn Giá</label>
                  <input type="number" class="form-control" v-model="formData.DONGIA">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số Quyển <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" v-model="formData.SOQUYEN" required min="0">
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Số Trang</label>
                  <input type="number" class="form-control" v-model="formData.SOTRANG">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngôn Ngữ</label>
                  <input type="text" class="form-control" v-model="formData.NGONNGU">
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Thể Loại</label>
                  <input type="text" class="form-control" v-model="formData.THELOAI">
                </div>
                <div class="col-md-6">
                  <label class="form-label">URL Hình Ảnh</label>
                  <input type="url" class="form-control" v-model="formData.HinhAnh">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Mô Tả</label>
                <textarea class="form-control" rows="3" v-model="formData.MOTA"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="saveSach">
              {{ isEdit ? 'Cập Nhật' : 'Thêm' }}
            </button>
          </div>
        </div>
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
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sachDetailModalLabel">
              <i class="fas fa-book-reader me-2"></i>
              Chi tiết Sách: {{ selectedBook?.TENSACH }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                  <li class="list-group-item">
                    <strong>Tên sách:</strong> {{ selectedBook.TENSACH }}
                  </li>
                  <li class="list-group-item">
                    <strong>Tác giả:</strong> {{ selectedBook.TACGIA }}
                  </li>
                  <li class="list-group-item">
                    <strong>Nhà xuất bản:</strong> {{ selectedBook.MANXB }}
                  </li>
                  <li class="list-group-item">
                    <strong>Năm xuất bản:</strong> {{ selectedBook.NAMXUATBAN }}
                  </li>
                  <li class="list-group-item">
                    <strong>Đơn giá:</strong> {{ selectedBook.DONGIA }} VNĐ
                  </li>
                  <li class="list-group-item">
                    <strong>Tổng số quyển:</strong> {{ selectedBook.SOQUYEN }}
                  </li>
                  <li class="list-group-item">
                    <strong>Trạng thái:</strong>
                    <span :class="selectedBook.SOQUYEN > 0 ? 'text-success' : 'text-danger'">
                      {{ selectedBook.SOQUYEN > 0 ? 'Còn hàng' : 'Hết hàng' }}
                    </span>
                  </li>
                  <li class="list-group-item" v-if="selectedBook.THELOAI">
                    <strong>Thể loại:</strong> {{ selectedBook.THELOAI }}
                  </li>
                  <li class="list-group-item" v-if="selectedBook.NGONNGU">
                    <strong>Ngôn ngữ:</strong> {{ selectedBook.NGONNGU }}
                  </li>
                  <li class="list-group-item" v-if="selectedBook.SOTRANG">
                    <strong>Số trang:</strong> {{ selectedBook.SOTRANG }}
                  </li>
                  <li class="list-group-item" v-if="selectedBook.MOTA">
                    <strong>Mô tả:</strong> {{ selectedBook.MOTA }}
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
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle text-danger me-2"></i> Xác nhận xóa
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
  name: "StaffSachManagement",
  data() {
    return {
      books: [],
      searchText: "",
      filterStock: "all",
      currentPage: 1,
      itemsPerPage: 8,
      selectedBook: null,
      bookToDelete: null,
      isEdit: false,
      formData: {
        TENSACH: "",
        TACGIA: "",
        MANXB: "",
        NAMXUATBAN: "",
        DONGIA: "",
        SOQUYEN: 0,
        SOTRANG: "",
        NGONNGU: "",
        THELOAI: "",
        HinhAnh: "",
        MOTA: "",
      },
      detailModal: null,
      sachModal: null,
      confirmDeleteModal: null,
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
    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.sachModal.show();
    },
    openEditModal(book) {
      this.isEdit = true;
      this.formData = { ...book };
      this.sachModal.show();
    },
    resetForm() {
      this.formData = {
        TENSACH: "",
        TACGIA: "",
        MANXB: "",
        NAMXUATBAN: "",
        DONGIA: "",
        SOQUYEN: 0,
        SOTRANG: "",
        NGONNGU: "",
        THELOAI: "",
        HinhAnh: "",
        MOTA: "",
      };
    },
    async saveSach() {
      try {
        if (this.isEdit) {
          await SachService.update(this.formData._id, this.formData);
        } else {
          await SachService.create(this.formData);
        }
        this.retrieveBooks();
        this.sachModal.hide();
      } catch (error) {
        console.error("Lỗi lưu sách:", error);
        alert("Lỗi khi lưu sách");
      }
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
    this.sachModal = new Modal(document.getElementById("sachModal"));
    this.confirmDeleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
};
</script>

<style scoped>
.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.375rem;
}

.page-link {
  background-color: #fff;
  color: #0d6efd;
  border-color: #dee2e6;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #0d6efd;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

.page-item.disabled .page-link {
  background-color: #e9ecef;
  color: #6c757d;
  border-color: #dee2e6;
}
</style>
