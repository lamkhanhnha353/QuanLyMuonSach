<template>
  <div class="books-explore">
    <header class="header-sticky">
      <div class="container-fluid px-3">
        <div class="search-bar py-3">
          <div class="row g-2 align-items-center">
            
            <div class="col-md-3 d-flex align-items-center brand-area">
              <i class="fas fa-book-open fa-2x text-dark me-2"></i>
              <h4 class="mb-0 fw-bold text-dark library-title">Khám phá thư viện</h4>
            </div>

            <div class="col-md-5">
              <div class="input-group search-input shadow-sm">
                <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="fas fa-search"></i>
                </span>

                <input
                    type="text"
                    class="form-control border-start-0 border-end-0 ps-0 bg-white"
                    placeholder="Tìm kiếm sách, tác giả..."
                    v-model="searchText"
                    @keyup.enter="applySearch"
                >

                <button
                    class="btn bg-white border border-start-0 border-end-0"
                    style="border-color: #dee2e6;"
                    type="button"
                    @click="toggleVoiceSearch"
                    :title="isListening ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'"
                >
                  <i 
                    class="fas fa-microphone" 
                    :class="{ 'text-danger fa-pulse': isListening, 'text-secondary': !isListening }"
                  ></i>
                </button>

                <button class="btn btn-primary px-4 fw-bold" @click="applySearch">Tìm</button>
              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex align-items-center gap-2 justify-content-end sort-area">
                
                <label class="mb-0 sort-label text-muted small" style="white-space: nowrap;">Hiển thị:</label>
                <select 
                  class="form-select form-select-sm sort-select me-2" 
                  style="width: 70px;" 
                  v-model.number="itemsPerPage"
                  @change="handlePageSizeChange"
                >
                  <option :value="12">12</option>
                  <option :value="24">24</option>
                  <option :value="48">48</option>
                </select>

                <label class="mb-0 sort-label text-muted small" style="white-space: nowrap;">Sắp xếp:</label>
                <select class="form-select form-select-sm sort-select" v-model="sortOption">
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

    <div class="container-fluid px-3 main-content">
      <div class="row g-4 py-4">
        
        <aside class="col-xl-2 col-lg-3">
          <div class="filter-panel sticky-top" style="top: 100px; z-index: 1000;">
            <div class="filter-header">
              <i class="fas fa-sliders-h me-2"></i>
              <span>Bộ lọc tìm kiếm</span>
            </div>

            <div class="filter-body">
              <div class="filter-section">
                <div class="filter-section-title">Thể loại</div>
                <div class="filter-options custom-scrollbar">
                  <div class="form-check" v-for="cat in categories" :key="cat">
                    <input class="form-check-input" type="checkbox" :id="`cat-${cat}`" :value="cat" v-model="selectedCategories">
                    <label class="form-check-label" :for="`cat-${cat}`">{{ cat }}</label>
                  </div>
                </div>
              </div>

              <div class="filter-divider"></div>

              <div class="filter-section">
                <div class="filter-section-title">Tình trạng</div>
                <div class="filter-options">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="status-all" value="all" v-model="statusFilter">
                    <label class="form-check-label" for="status-all">Tất cả</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="status-available" value="available" v-model="statusFilter">
                    <label class="form-check-label" for="status-available">Sẵn sàng cho mượn</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="status-borrowed" value="borrowed" v-model="statusFilter">
                    <label class="form-check-label" for="status-borrowed">Đã hết sách</label>
                  </div>
                </div>
              </div>
              
              <button class="btn btn-light w-100 btn-sm mt-3 text-muted border" @click="clearFilters">
                <i class="fas fa-undo me-1"></i> Đặt lại bộ lọc
              </button>
            </div>
          </div>
        </aside>

        <main class="col-xl-10 col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small">
                Hiển thị <b>{{ paginatedBooks.length }}</b> trên tổng số <b>{{ filteredBooks.length }}</b> sách
              </span>
          </div>

          <div class="books-grid">
            <div class="book-item" v-for="book in paginatedBooks" :key="book._id">
              
              <div class="book-card">
                <div class="book-cover">
                  <img 
                    :src="book.HinhAnh || placeholderImage" 
                    :alt="book.TENSACH" 
                    class="book-image" 
                    @error="onImgError"
                  >
                  
                  <div class="status-badge" :class="book.SOQUYEN > 0 ? 'available' : 'out'">
                    {{ book.SOQUYEN > 0 ? 'Còn Sách' : 'Hết Sách' }}
                  </div>

                  <div class="book-overlay">
                    <div class="overlay-buttons">
                        <button 
                            class="btn btn-light btn-sm action-btn" 
                            @click="viewDetails(book)"
                            title="Xem chi tiết"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        
                        <button 
                            v-if="book.SOQUYEN > 0"
                            class="btn btn-primary btn-sm action-btn" 
                            @click="requestLogin(book)"
                            title="Đăng ký mượn"
                        >
                          <i class="fas fa-book-medical"></i>
                        </button>
                    </div>
                  </div>
                </div>

                <div class="book-info">
                  <div class="book-meta mb-1">
                    <span class="badge bg-light text-dark border">{{ book.THELOAI || 'Tổng hợp' }}</span>
                  </div>
                  <h6 class="book-title" :title="book.TENSACH">{{ book.TENSACH }}</h6>
                  <p class="book-author">
                    <i class="fas fa-pen-nib me-1 small"></i>{{ book.TACGIA }}
                  </p>
                  
                  <div class="book-footer">
                      <button class="btn btn-outline-primary btn-sm w-100 mt-2 rounded-pill" @click="viewDetails(book)">
                        Xem chi tiết
                      </button>
                  </div>
                </div>
              </div>
              </div>
          </div>

          <div v-if="paginatedBooks.length === 0" class="text-center py-5 empty-state">
            <div class="mb-3">
                <i class="fas fa-search text-muted display-4"></i>
            </div>
            <h5 class="text-muted">Không tìm thấy sách nào</h5>
            <p class="text-muted small">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
            <button class="btn btn-primary btn-sm mt-2" @click="clearFilters">Xóa bộ lọc</button>
          </div>

          <div class="pagination-container mt-5 mb-5" v-if="totalPages > 1">
            <ul class="pagination justify-content-center flex-wrap">
              <li class="page-item" :class="{ disabled: currentPage === 1 }" v-if="totalPages > 5">
                <a class="page-link" href="#" @click.prevent="changePage(1)" title="Trang đầu">
                  <i class="fas fa-angle-double-left"></i>
                </a>
              </li>

              <li class="page-item prev-next" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>

              <li v-for="page in pageRange" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              
              <li class="page-item prev-next" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>

               <li class="page-item" :class="{ disabled: currentPage === totalPages }" v-if="totalPages > 5">
                <a class="page-link" href="#" @click.prevent="changePage(totalPages)" title="Trang cuối">
                  <i class="fas fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import AuthService from "@/services/auth.service";

export default {
  name: "BooksExplore",
  data() {
    return {
      books: [],
      searchText: "",
      categories: ["Văn Học", "Khoa Học", "Lịch Sử", "Kinh Tế", "Tâm Lý Học", "Tiểu Thuyết", "Công Nghệ", "Thiếu Nhi"],
      selectedCategories: [],
      statusFilter: "all",
      sortOption: "newest",
      currentPage: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      itemsPerPage: 12, // Giá trị mặc định
      placeholderImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgQ292ZXI8L3RleHQ+PC9zdmc+",
      isLoggedIn: false,
      isListening: false,
      recognition: null,
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
      // Logic hiển thị phân trang thông minh: Luôn hiện trang đầu, cuối và xung quanh trang hiện tại
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2; // Số trang hiện bên cạnh trang hiện tại
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
          range.push(i);
        }
      }
      return range;
    }
  },
  watch: {
    // Khi bộ lọc thay đổi, reset về trang 1
    selectedCategories() { this.currentPage = 1; },
    statusFilter() { this.currentPage = 1; },
    searchText() { this.currentPage = 1; },
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
    handlePageSizeChange() {
        this.currentPage = 1; // Reset về trang 1 khi đổi số lượng hiển thị
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
    clearFilters() {
      this.selectedCategories = [];
      this.statusFilter = "all";
      this.searchText = "";
      this.sortOption = "newest";
      this.currentPage = 1;
      this.itemsPerPage = 12; // Reset cả số lượng hiển thị
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      // Cập nhật URL mà không reload trang (Optional)
      this.$router.replace({ query: { ...this.$route.query, page: page } }).catch(()=>{});
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    requestLogin(book) {
      if (this.isLoggedIn) {
        this.viewDetails(book);
      } else {
        alert("Vui lòng đăng nhập để mượn sách.");
        this.$router.push("/login");
      }
    },
    viewDetails(book) {
      this.$router.push({ name: 'books.detail', params: { id: book._id } });
    },
    onImgError(e) {
      e.target.src = this.placeholderImage;
    },
    toggleVoiceSearch() {
      if (this.isListening) {
        this.stopVoiceSearch();
      } else {
        this.startVoiceSearch();
      }
    },
    startVoiceSearch() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'vi-VN'; 

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.searchText = transcript;
        this.applySearch();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        alert('Có lỗi xảy ra khi nhận dạng giọng nói. Vui lòng thử lại.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    },
    stopVoiceSearch() {
      if (this.recognition) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  },
  mounted() {
    this.retrieveBooks();
    const user = AuthService.getCurrentUser();
    this.isLoggedIn = !!user;
  }
};
</script>

<style scoped>
/* Giữ nguyên toàn bộ CSS cũ của bạn, chỉ thêm css cho cột mới nếu cần (Bootstrap đã lo phần lớn) */

/* --- 1. Global & Page Setup --- */
.books-explore {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* --- 2. Header Sticky --- */
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 1020;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.library-title {
  font-size: 1.5rem;
  color: #1f2937;
  letter-spacing: -0.5px;
}

/* Search Input */
.search-input .form-control {
  background-color: #fff; 
  border: 1px solid #dee2e6;
  border-left: none;
  border-right: none; 
}
.search-input .form-control:focus {
  background-color: #fff;
  box-shadow: none;
  border-color: #dee2e6;
}
.search-input .input-group-text {
  background-color: #fff; 
  border: 1px solid #dee2e6;
  border-right: none;
}

.search-input button.btn-light:hover, 
.search-input button.bg-white:hover {
    background-color: #f8f9fa !important;
}

/* --- SORT SELECT --- */
.sort-select {
  border-color: #dee2e6;
  cursor: pointer;
}
.sort-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}


/* --- 3. Sidebar Filter --- */
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #f0f0f0;
}

.filter-header {
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e5e7eb;
  font-size: 1rem;
}

.filter-section-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-scrollbar {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.form-check-input:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.filter-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 20px 0;
}

/* --- 4. BOOKS GRID --- */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); 
  gap: 24px;
  margin-bottom: 40px;
}

/* === CARD STYLE === */
.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Cover Image */
.book-cover {
  position: relative;
  width: 100%;
  padding-top: 140%;
  overflow: hidden;
  background-color: #f1f5f9;
}

.book-image {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.status-badge.available { background-color: rgba(16, 185, 129, 0.9); color: white; }
.status-badge.out { background-color: rgba(239, 68, 68, 0.9); color: white; }

/* === OVERLAY === */
.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); 
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.overlay-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 1rem;
  transition: all 0.2s;
}
.action-btn:hover {
  transform: scale(1.1);
}

/* Book Info */
.book-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: auto;
}

/* Pagination */
.pagination-container .pagination {
  gap: 6px;
}
.page-link {
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-weight: 600;
  margin: 0 2px;
  transition: all 0.2s;
}
.page-item.active .page-link {
  background-color: #4f46e5;
  color: white;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}
.page-item:not(.active) .page-link:hover {
  background-color: #e5e7eb;
  color: #111827;
}

/* Responsive */
@media (max-width: 991px) {
  .books-grid {
    gap: 16px;
  }
  .filter-panel {
    margin-bottom: 20px;
    z-index: 1;
  }
}

@media (max-width: 576px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .book-info {
    padding: 12px;
  }
  .book-title {
    font-size: 0.9rem;
  }
  .brand-area h4 { display: none; }
  .sort-area label { display: none; }
}
</style>