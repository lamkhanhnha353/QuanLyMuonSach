<template>
  <div class="container my-4">
    <div class="row">
      <!-- Sidebar filters -->
      <aside class="col-md-3">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Bộ lọc</h5>

            <div class="mb-3">
              <label class="form-label">Thể loại</label>
              <div>
                <div class="form-check" v-for="cat in categories" :key="cat">
                  <input class="form-check-input" type="checkbox" :id="`cat-`+cat" :value="cat" v-model="selectedCategories">
                  <label class="form-check-label" :for="`cat-`+cat">{{ cat }}</label>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Tình trạng</label>
              <div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="status-all" value="all" v-model="statusFilter">
                  <label class="form-check-label" for="status-all">Tất cả</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="status-available" value="available" v-model="statusFilter">
                  <label class="form-check-label" for="status-available">Còn sách</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="status-borrowed" value="borrowed" v-model="statusFilter">
                  <label class="form-check-label" for="status-borrowed">Đã mượn hết</label>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button class="btn btn-outline-secondary btn-sm" @click="clearFilters">Xóa bộ lọc</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="input-group w-50">
            <input type="text" class="form-control" placeholder="Tìm theo tên sách, tác giả, ISBN" v-model="searchText" @keyup.enter="applySearch">
            <button class="btn btn-primary" @click="applySearch"><i class="fas fa-search"></i></button>
          </div>

          <div class="d-flex align-items-center gap-2">
            <label class="me-2 mb-0">Sắp xếp:</label>
            <select class="form-select" style="width: 180px" v-model="sortOption">
              <option value="newest">Mới nhất</option>
              <option value="title">Tên A-Z</option>
              <option value="author">Tác giả</option>
            </select>
          </div>
        </div>

        <!-- Grid of books -->
        <div class="row g-4">
          <div class="col-6 col-md-4 col-lg-3" v-for="book in paginatedBooks" :key="book._id">
            <div class="card h-100 shadow-sm">
              <img :src="book.HinhAnh || placeholderImage" class="card-img-top" style="height:220px; object-fit:cover;" @error="onImgError($event)">
              <div class="card-body">
                <h6 class="card-title mb-1">{{ book.TENSACH }}</h6>
                <p class="card-text text-muted small mb-2">{{ book.TACGIA }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span :class="['badge','fw-bold', book.SOQUYEN > 0 ? 'bg-success' : 'bg-danger']">
                    {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Đã mượn hết' }}
                  </span>
                  <button class="btn btn-sm btn-outline-primary" @click="viewDetails(book)">Chi tiết</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">&lt;</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">&gt;</a>
            </li>
          </ul>
        </nav>

        <!-- Detail modal (reused from admin list to keep behavior) -->
        <div class="modal fade" id="homeDetailModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Chi tiết: {{ selectedBook?.TENSACH }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" v-if="selectedBook">
                <div class="row">
                  <div class="col-md-4 text-center">
                    <img :src="selectedBook.HinhAnh || placeholderImage" class="img-fluid rounded mb-3" style="width: 220px; height: 280px; object-fit:cover;" @error="onImgError($event)">
                    <h5>{{ selectedBook.TENSACH }}</h5>
                    <p class="text-muted">{{ selectedBook.TACGIA }}</p>
                  </div>
                  <div class="col-md-8">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item"><strong>Tên:</strong> {{ selectedBook.TENSACH }}</li>
                      <li class="list-group-item"><strong>Tác giả:</strong> {{ selectedBook.TACGIA }}</li>
                      <li class="list-group-item"><strong>Năm:</strong> {{ selectedBook.NAMXUATBAN }}</li>
                      <li class="list-group-item"><strong>Tổng số:</strong> {{ selectedBook.SOQUYEN }}</li>
                      <li class="list-group-item"><strong>Trạng thái:</strong> <span :class="selectedBook.SOQUYEN > 0 ? 'text-success' : 'text-danger'">{{ selectedBook.SOQUYEN > 0 ? 'Còn sách' : 'Đã mượn hết' }}</span></li>
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

      </main>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import { Modal } from "bootstrap";

export default {
  name: "Home",
  data() {
    return {
      books: [],
      searchText: "",
      categories: ["Văn học", "Khoa học", "Lịch sử", "Kinh tế", "Tâm lý học"],
      selectedCategories: [],
      statusFilter: "all",
      sortOption: "newest",
      currentPage: 1,
      itemsPerPage: 12,
      selectedBook: null,
      detailModal: null,
      placeholderImage: "https://via.placeholder.com/300x420?text=No+Image",
    };
  },
  computed: {
    filteredBooks() {
      let filtered = this.books || [];

      // Categories (if book has THELOAI field)
      if (this.selectedCategories.length > 0) {
        filtered = filtered.filter(b => this.selectedCategories.includes(b.THELOAI));
      }

      // Status
      if (this.statusFilter === "available") filtered = filtered.filter(b => b.SOQUYEN > 0);
      else if (this.statusFilter === "borrowed") filtered = filtered.filter(b => b.SOQUYEN === 0);

      // Search
      if (this.searchText && this.searchText.trim() !== "") {
        const q = this.searchText.trim().toLowerCase();
        filtered = filtered.filter(b => {
          return (b.TENSACH || "").toLowerCase().includes(q) || (b.TACGIA || "").toLowerCase().includes(q) || (b.ISBN || "").toLowerCase().includes(q);
        });
      }

      // Sort
      if (this.sortOption === "title") filtered = filtered.sort((a, b) => (a.TENSACH || "").localeCompare(b.TENSACH || ""));
      else if (this.sortOption === "author") filtered = filtered.sort((a, b) => (a.TACGIA || "").localeCompare(b.TACGIA || ""));
      else if (this.sortOption === "newest") filtered = filtered.sort((a, b) => (b.NAMXUATBAN || 0) - (a.NAMXUATBAN || 0));

      return filtered;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredBooks.length / this.itemsPerPage));
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredBooks.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        const res = await SachService.getAll();
        this.books = res.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    applySearch() {
      this.currentPage = 1;
    },
    clearFilters() {
      this.selectedCategories = [];
      this.statusFilter = "all";
      this.searchText = "";
      this.sortOption = "newest";
      this.currentPage = 1;
    },
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    viewDetails(book) {
      this.selectedBook = book;
      if (!this.detailModal) this.detailModal = new Modal(document.getElementById("homeDetailModal"));
      this.detailModal.show();
    },
    onImgError(e) {
      e.target.src = this.placeholderImage;
    }
  },
  mounted() {
    this.retrieveBooks();
  }
};
</script>

<style scoped>
.card {
  border: 1px solid rgba(0,0,0,0.08);
}
.form-control, .form-select {
  background-color: #fff;
  color: #212529;
}
.page-link { cursor: pointer; }
/* Responsive tweaks for better visual similarity to provided design */
@media (min-width: 992px) {
  .card-img-top { height: 220px; }
}
</style>