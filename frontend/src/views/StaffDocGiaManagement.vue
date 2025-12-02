<template>
  <div class="container-fluid py-4">
    <!-- Header & Button Thêm -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary">Quản lý Độc Giả</h3>
      <router-link to="/staff/nguoidung/add" class="btn btn-primary shadow-sm">
        <i class="fas fa-plus me-1"></i> Thêm Độc Giả Mới
      </router-link>
    </div>

    <!-- Thanh tìm kiếm & Bộ lọc hiển thị -->
    <div class="card border-0 shadow-sm mb-4 rounded-3">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <!-- Tìm kiếm -->
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 text-muted">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Nhập tên hoặc họ độc giả để tìm..."
                v-model="searchText"
                @keyup.enter="search"
              />
              <button class="btn btn-primary px-4" type="button" @click="search">
                Tìm kiếm
              </button>
            </div>
          </div>
          <!-- Chọn số lượng hiển thị -->
          <div class="col-md-4 text-end">
            <div class="d-flex align-items-center justify-content-end">
              <label class="me-2 text-muted fw-bold">Hiển thị:</label>
              <select v-model="itemsPerPage" @change="changeItemsPerPage" class="form-select w-auto border-0 bg-light fw-bold text-secondary">
                <option value="5">5 dòng</option>
                <option value="10">10 dòng</option>
                <option value="20">20 dòng</option>
                <option value="50">50 dòng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 py-3">
        <h5 class="mb-0 text-secondary">
          <i class="fas fa-users me-2 text-primary"></i> Danh sách Độc Giả
        </h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <!-- Đã thêm class text-primary và fw-bold cho tất cả các cột -->
                <th class="py-3 ps-4 text-primary fw-bold" style="width: 80px;">STT</th>
                <th class="py-3 text-primary fw-bold">Họ Tên</th>
                <th class="py-3 text-primary fw-bold" style="width: 100px;">Giới Tính</th>
                <th class="py-3 text-primary fw-bold">Ngày Sinh</th>
                <th class="py-3 text-primary fw-bold">Điện Thoại</th>
                <th class="py-3 pe-4 text-primary fw-bold">Địa Chỉ</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(docgia, index) in paginatedDocGias" :key="docgia._id">
                <!-- STT -->
                <td class="ps-4 fw-bold text-muted">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                
                <!-- Họ Tên -->
                <td>
                  <span class="fw-bold text-dark">{{ docgia.HOLOT }} {{ docgia.TEN }}</span>
                </td>
                
                <!-- Giới Tính -->
                <td>
                  <span class="badge" :class="docgia.GIOITINH === 'Nam' ? 'bg-soft-blue text-primary' : 'bg-soft-pink text-danger'">
                    {{ docgia.GIOITINH }}
                  </span>
                </td>
                
                <!-- Ngày Sinh -->
                <td class="text-secondary fw-bold">{{ formatDate(docgia.NGAYSINH) }}</td>
                
                <!-- Điện Thoại -->
                <td class="text-secondary">{{ docgia.DIENTHOAI }}</td>
                
                <!-- Địa Chỉ -->
                <td class="pe-4 text-secondary">{{ docgia.DIACHI }}</td>
              </tr>
              
              <!-- Nếu không có dữ liệu -->
              <tr v-if="paginatedDocGias.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="fas fa-inbox fa-3x mb-3 opacity-50"></i>
                  <p class="mb-0">Không tìm thấy độc giả nào.</p>
                </td>
              </tr>
            </tbody>
            
            <!-- Loading Spinner -->
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phân trang -->
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
  </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";

export default {
  name: "StaffDocGiaManagement",
  data() {
    return {
      docGias: [],
      loading: true,
      searchText: "",
      
      // Pagination configs
      currentPage: 1,
      itemsPerPage: 10,
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
          dg.TEN.toLowerCase().includes(lowerSearch)
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
      if (!dateString) return "—";
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    search() {
      this.currentPage = 1;
    },

    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.retrieveDocGias();
  },
};
</script>

<style scoped>
/* Màu nền nhẹ nhàng cho header bảng */
.table thead th {
  background-color: #f8f9fa;
  /* font-weight sẽ được override bởi class fw-bold ở html */
  color: #6c757d; /* Màu mặc định cho các cột không được highlight */
  border-bottom: 2px solid #e9ecef;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* Override màu cho các th có class text-primary */
.table thead th.text-primary {
    color: #0d6efd !important;
}

/* Hiệu ứng hover cho dòng */
.table-hover tbody tr:hover {
  background-color: #f1f5f9;
}

/* Badge màu tùy chỉnh cho Giới tính */
.bg-soft-blue {
  background-color: #e3f2fd;
  color: #0d6efd;
}
.bg-soft-pink {
  background-color: #fce4ec;
  color: #d81b60;
}
.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
  border-radius: 6px;
}

/* Input search clean style */
.input-group-text {
  border-color: #ced4da;
}
.form-control:focus {
  border-color: #86b7fe;
  box-shadow: none; /* Bỏ shadow mặc định, chỉ đổi màu viền */
}

/* Custom Pagination */
.page-link {
  color: #6c757d;
  background-color: transparent;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
.page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
  box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
}
.page-item.disabled .page-link {
  color: #dee2e6;
}
</style>