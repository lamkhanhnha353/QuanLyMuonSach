<template>
  <div class="container-fluid">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Quản lý Nhân Viên</h3>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          
          <div class="col-md-3">
            <select class="form-select" v-model="filterChucVu">
              <option value="all">Tất cả chức vụ</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Nhân viên (Staff)</option>
            </select>
          </div>

          <div class="col-md-6">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Nhập tên nhân viên để tìm..."
                v-model="searchText"
              >
              <button class="btn btn-info" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div class="col-md-3 text-end">
            <router-link to="/admin/nhanvien/add" class="btn btn-primary w-100">
              <i class="fas fa-plus me-2"></i> Thêm Mới
            </router-link>
          </div>

        </div>
      </div>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-header">
        <i class="fas fa-users-cog me-2"></i> Danh sách Nhân Viên
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-hover">
            <thead>
              <tr>
                <th>STT</th>
                <th>MSNV</th>
                <th>Họ Tên</th>
                <th>Chức Vụ</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nv, index) in paginatedNhanViens" :key="nv._id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.HoTenNV }}</td>
                <td>
                  <span :class="nv.ChucVu === 'Admin' ? 'badge bg-success' : 'badge bg-info'">
                    {{ nv.ChucVu }}
                  </span>
                </td>
                <td>{{ nv.DiaChi }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button class="btn btn-info btn-sm me-2" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-warning btn-sm me-2" title="Sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="handleDelete(nv._id)" title="Xóa">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredNhanViens.length === 0">
                <td colspan="7" class="text-center">Không tìm thấy nhân viên nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer" v-if="totalPages > 1">
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                Trang trước
              </a>
            </li>
            <li 
              v-for="page in totalPages" 
              :key="page" 
              class="page-item" 
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                Trang sau
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

  </div>
</template>

<script>
// --- PHẦN SCRIPT ĐÃ NÂNG CẤP (Thêm logic Lọc, Tìm kiếm, Phân trang) ---
import NhanVienService from "@/services/nhanvien.service";

export default {
  name: "NhanVienManagement",
  components: {},
  data() {
    return {
      nhanviens: [], // Đây là danh sách GỐC từ API
      searchText: "", // v-model cho ô tìm kiếm
      filterChucVu: "all", // v-model cho bộ lọc
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 8, // FIX: 6 người 1 trang
    };
  },
  computed: {
    // 1. Lọc danh sách (Lọc + Tìm kiếm)
    filteredNhanViens() {
      let filtered = this.nhanviens;

      // Lọc theo Chức Vụ
      if (this.filterChucVu !== 'all') {
        filtered = filtered.filter(nv => nv.ChucVu === this.filterChucVu);
      }

      // Lọc theo Tên (Tìm kiếm)
      if (this.searchText.trim()) {
        const lowerSearch = this.searchText.trim().toLowerCase();
        filtered = filtered.filter(nv => 
          nv.HoTenNV.toLowerCase().includes(lowerSearch)
        );
      }
      return filtered;
    },

    // 2. Tính tổng số trang
    totalPages() {
      return Math.ceil(this.filteredNhanViens.length / this.itemsPerPage);
    },

    // 3. Phân trang danh sách (Lấy 6 người)
    paginatedNhanViens() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      // Cắt mảng đã lọc ra 6 người
      return this.filteredNhanViens.slice(start, end);
    }
  },
  methods: {
    async retrieveNhanViens() {
      try {
        const response = await NhanVienService.getAll();
        this.nhanviens = response.data; // Lấy danh sách gốc
      } catch (error) {
        console.error(error);
      }
    },
    
    async handleDelete(id) {
        if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
            try {
                await NhanVienService.delete(id);
                this.retrieveNhanViens(); // Tải lại bảng
            } catch (error) {
                alert("Không thể xóa nhân viên.");
            }
        }
    },

    // 4. Hàm chuyển trang
    changePage(pageNumber) {
      if (pageNumber < 1) pageNumber = 1;
      if (pageNumber > this.totalPages) pageNumber = this.totalPages;
      this.currentPage = pageNumber;
    }
  },
  watch: {
    // 5. Nếu người dùng Lọc hoặc Tìm kiếm, tự động quay về Trang 1
    filterChucVu() {
      this.currentPage = 1;
    },
    searchText() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.retrieveNhanViens();
  },
};
</script>

<style scoped>
/* Style cho Card, Form, Table... */
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
/* Style cho các input trong card (Search, Filter) */
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
.input-group-text {
  background-color: #343a40;
  border: 1px solid #495057;
  color: #fff;
}
/* Style cho Phân trang (Pagination) */
.page-link {
    background-color: #212529;
    color: #c9d1d9;
    border-color: #495057;
    cursor: pointer; /* Thêm con trỏ */
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
  color: #ffffff6e;
  font-style: italic;
}
</style>