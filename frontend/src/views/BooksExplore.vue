<template>
  <div class="books-explore">
    <header class="header-sticky">
      <div class="container-fluid px-3">
        <div class="search-bar py-3">
          <div class="row g-2 align-items-center">
            
            <div class="col-md-3 d-flex align-items-center gap-2">
              <div class="library-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <h4 class="mb-0 fw-bold library-title">Khám phá thư viện</h4>
            </div>

            <div class="col-md-6">
              <div class="input-group search-input">
                <input type="text" class="form-control" placeholder="Tìm theo tên sách, tác giả, ISBN" v-model="searchText" @keyup.enter="applySearch">
                <button class="btn btn-primary" @click="applySearch"><i class="fas fa-search"></i></button>
              </div>
            </div>
            
            <div class="col-md-3">
              <div class="d-flex align-items-center gap-2 justify-content-end">
                <label class="mb-0 sort-label">Sắp xếp:</label>
                <select class="form-select sort-select" v-model="sortOption">
                  <option value="newest">Mới nhất</option>
                  <option value="title">Tên A-Z</option>
                  <option value="author">Tác giả</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid px-3">
      <div class="row g-4 py-4">
        <aside class="col-xl-2 col-lg-3">
          <div class="filter-panel">
            <div class="filter-header">
              <i class="fas fa-filter me-2"></i>
              <span>Bộ lọc</span>
            </div>

            <div class="filter-section">
              <div class="filter-section-title">Thể loại</div>
              <div class="filter-options">
                <div class="form-check" v-for="cat in categories" :key="cat">
                  <input class="form-check-input" type="checkbox" :id="`cat-${cat}`" :value="cat" v-model="selectedCategories">
                  <label class="form-check-label" :for="`cat-${cat}`">{{ cat }}</label>
                </div>
              </div>
            </div>

            <div class="filter-section">
              <div class="filter-section-title">Tình trạng</div>
              <div class="filter-options">
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

            <button class="btn btn-outline-secondary w-100 btn-sm" @click="clearFilters">
              <i class="fas fa-times me-1"></i>Xóa bộ lọc
            </button>
          </div>
        </aside>

        <main class="col-xl-10 col-lg-9">
          <div class="books-grid">
            <div class="book-item" v-for="book in paginatedBooks" :key="book._id">
              <div class="book-card">
                <div class="book-img-container">
                  <img :src="book.HinhAnh || placeholderImage" :alt="book.TENSACH" @error="onImgError">
                  <div class="book-overlay">
                    <button class="btn btn-light btn-sm" @click="viewDetails(book)">
                      <i class="fas fa-info-circle me-1"></i>Chi tiết
                    </button>
                  </div>
                </div>
                <div class="book-info">
                  <h6 class="book-title">{{ book.TENSACH }}</h6>
                  <p class="book-author">{{ book.TACGIA }}</p>
                  <div class="book-footer">
                    <span :class="['badge', 'fw-bold', book.SOQUYEN > 0 ? 'bg-success' : 'bg-danger']">
                      {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-container mt-5 mb-4">
            <ul class="pagination justify-content-center">
              <li class="page-item prev-next" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>

              <li v-if="totalPages > 0 && currentPage > 1" class="page-item" :class="{ 'd-none': currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
              </li>

              <li v-if="currentPage > 3" class="page-item disabled d-none d-sm-block">
                <span class="page-link ellipsis">...</span>
              </li>

              <li v-for="page in pageRange" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>

              <li v-if="currentPage < totalPages - 2" class="page-item disabled d-none d-sm-block">
                <span class="page-link ellipsis">...</span>
              </li>

              <li v-if="totalPages > 1 && currentPage < totalPages" class="page-item" :class="{ 'd-none': currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
              </li>
              
              <li class="page-item prev-next" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>

    <div class="modal fade" id="homeDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết sách</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedBook">
            <div class="row">
              <div class="col-md-4 text-center">
                <img :src="selectedBook.HinhAnh || placeholderImage" class="img-fluid rounded" style="max-height: 320px; object-fit: cover;" @error="onImgError">
              </div>
              <div class="col-md-8">
                <h5 class="mb-3">{{ selectedBook.TENSACH }}</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><strong>Tác giả:</strong> {{ selectedBook.TACGIA }}</li>
                  <li class="list-group-item"><strong>Năm xuất bản:</strong> {{ selectedBook.NAMXUATBAN }}</li>
                  <li class="list-group-item"><strong>Tổng số quyển:</strong> {{ selectedBook.SOQUYEN }}</li>
                  <li class="list-group-item">
                    <strong>Trạng thái:</strong>
                    <span :class="selectedBook.SOQUYEN > 0 ? 'badge bg-success' : 'badge bg-danger'">
                      {{ selectedBook.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
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
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import { Modal } from "bootstrap";

export default {
  name: "BooksExplore",
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
      placeholderImage: "https://via.placeholder.com/240x360?text=No+Cover",
    };
  },
  computed: {
    filteredBooks() {
      let filtered = this.books || [];

      if (this.selectedCategories.length > 0) {
        filtered = filtered.filter(b => this.selectedCategories.includes(b.THELOAI));
      }

      if (this.statusFilter === "available") filtered = filtered.filter(b => b.SOQUYEN > 0);
      else if (this.statusFilter === "borrowed") filtered = filtered.filter(b => b.SOQUYEN === 0);

      if (this.searchText && this.searchText.trim() !== "") {
        const q = this.searchText.trim().toLowerCase();
        filtered = filtered.filter(b => {
          return (b.TENSACH || "").toLowerCase().includes(q) || 
                 (b.TACGIA || "").toLowerCase().includes(q) || 
                 (b.ISBN || "").toLowerCase().includes(q);
        });
      }

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
    pageRange() {
      const delta = 2;
      const range = [];
      const rangeStart = Math.max(2, this.currentPage - delta);
      const rangeEnd = Math.min(this.totalPages - 1, this.currentPage + delta);

      if (this.currentPage === 1 && this.totalPages > 1) {
          range.push(1);
      }
      
      for (let i = rangeStart; i <= rangeEnd; i++) {
        if (i > 1 && i < this.totalPages) {
            range.push(i);
        } else if (this.totalPages <= 5 && i >= 1 && i <= this.totalPages) {
            range.push(i);
        }
      }
      
      if (this.currentPage === this.totalPages && this.totalPages > 1) {
          range.push(this.totalPages);
      }

      return [...new Set(range)].filter(p => p >= 1 && p <= this.totalPages);
    }
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
/* Header Title and Icon Style */
.library-icon {
  width: 48px;
  height: 48px;
  /* background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); */ /* ĐÃ XÓA */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937; /* ĐỔI TỪ 'white' SANG MÀU TỐI */
  font-size: 1.4rem;
  /* box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); */ /* ĐÃ XÓA */
}

.library-title {
  font-size: 1.5rem;
  color: #1f2937;
  white-space: nowrap;
}

.sort-label {
  font-size: 0.85rem;
  color: #6b7280;
  white-space: nowrap;
  font-weight: 500;
}

.sort-select {
  max-width: 130px;
  height: 36px;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
}

.books-explore {
  background-color: #f5f6f7;
  min-height: 100vh;
}

/* Header Sticky */
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 1020;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.search-bar {
  padding: 12px 0;
}

.search-input .form-control {
  height: 44px;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.search-input .btn-primary {
  height: 44px;
  width: 48px;
  background-color: #2563eb;
  border: none;
}

.search-input .form-select-sm {
  height: 40px;
  font-size: 0.9rem;
}

/* Sidebar Filters */
.filter-panel {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.filter-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.filter-section {
  margin-bottom: 18px;
}

.filter-section:last-of-type {
  margin-bottom: 20px;
}

.filter-section-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 10px;
}

.filter-options .form-check {
  margin-bottom: 8px;
}

.filter-options .form-check-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.filter-options .form-check-label {
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  margin-bottom: 0;
  margin-left: 6px;
}

/* Books Grid - COMPACT (Reverted to 4 columns) */
.books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 30px;
}

.book-item {
  height: 100%;
}

.book-card {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* * KHỐI .book-card:hover ĐÃ BỊ XÓA THEO YÊU CẦU 
 * .book-card:hover {
 * box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
 * transform: translateY(-4px);
 * border-color: #d1d5db;
 * }
*/

.book-img-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f3f4f6;
}

.book-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* HIỆU ỨNG NÀY VẪN ĐƯỢC GIỮ NGUYÊN */
.book-card:hover .book-img-container img {
  transform: scale(1.06);
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.book-overlay .btn {
  background: white;
  color: #2563eb;
  border: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.book-overlay .btn:hover {
  background: #f3f4f6;
}

.book-info {
  padding: 11px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-weight: 600;
  font-size: 0.88rem;
  color: #1f2937;
  line-height: 1.3;
  margin-bottom: 4px;
  min-height: 2.6em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-footer {
  margin-top: auto;
}

.badge {
  font-size: 0.7rem;
  padding: 4px 8px;
  font-weight: 600;
}

/* Pagination - Updated Style (Kept round style) */
.pagination-container {
  display: flex;
  justify-content: center;
}

.pagination {
  gap: 8px; 
}

.page-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-link {
  color: #4b5563;
  border: none;
  background-color: transparent;
  border-radius: 50%; 
  width: 38px;
  height: 38px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  line-height: 1;
}

/* Kiểu cho số trang đang hoạt động (active) */
.page-item.active .page-link {
  background-color: #2563eb; 
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

/* Kiểu khi di chuột (hover) */
.page-item:not(.active) .page-link:not(.ellipsis):hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

/* Kiểu cho nút mũi tên (prev/next) */
.page-item.prev-next .page-link {
  color: #4b5563;
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
}

.page-item.prev-next .page-link:hover {
  background-color: #e5e7eb;
}

/* Kiểu cho dấu ... và disabled */
.page-item.disabled .page-link {
  color: #9ca3af;
  background-color: transparent;
  border-color: transparent;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 1400px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 13px;
  }
}

@media (max-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .col-xl-2 { width: 100%; }
  .col-xl-10 { width: 100%; }
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .filter-panel {
    margin-bottom: 24px;
    margin-top: 0;
  }

  .books-grid {
    margin-top: 0;
  }

  .search-bar .col-md-4 {
    margin-top: 8px;
  }
}

@media (max-width: 576px) {
  .books-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .book-img-container {
    height: 240px;
  }

  .page-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .search-bar {
    padding: 8px 0;
  }

  .search-input .form-control,
  .search-input .btn-primary,
  .search-input .form-select-sm {
    height: 36px;
  }

  /* Responsive update for Pagination */
  .pagination {
    gap: 4px;
  }
  .page-link {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }

  /* Hide Icon and Title, make search wider on small screens */
  .header-sticky .col-md-3:first-child {
      display: none !important;
  }
  .header-sticky .col-md-6 {
      width: 75% !important;
  }
  .header-sticky .col-md-3:last-child {
      width: 25% !important;
  }
}
</style>