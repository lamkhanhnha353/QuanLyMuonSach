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
              <button class="btn btn-info" type="button" @click="search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-3 text-end">
            <router-link to="/admin/nhanvien/add" class="btn btn-primary w-100">
              <i class="fas fa-plus me-2"></i> Thêm Nhân Viên Mới
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-users-cog me-2"></i> Danh sách Nhân Viên
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th style="width: 60px;">STT</th>
                <th style="width: 60px;">Avatar</th> <th>Họ Tên</th>
                <th>MSNV</th>
                <th>Chức vụ</th>
                <th>Điện thoại</th>
                <th style="width: 150px">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(nv, index) in paginatedNhanViens" :key="nv._id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <img 
                    :src="nv.AVATAR || defaultAvatar" 
                    class="avatar-sm" 
                    alt="Avatar"
                  >
                </td>
                <td>{{ nv.HoTenNV }}</td>
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.ChucVu }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-success me-2" 
                    @click="openViewModal(nv)" 
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <router-link 
                    :to="{ name: 'admin.nhanvien.edit', params: { id: nv._id } }" 
                    class="btn btn-sm btn-info me-2" 
                    title="Sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="confirmDelete(nv)" 
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
               <tr v-if="paginatedNhanViens.length === 0">
                <td colspan="7" class="text-center">Không có nhân viên nào.</td> </tr>
            </tbody>
             <tbody v-else>
              <tr>
                <td colspan="7" class="text-center"> <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer" v-if="!loading && totalPages > 1">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">&laquo;</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">&raquo;</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div 
      class="modal fade" 
      id="viewNhanVienModal" 
      tabindex="-1" 
      aria-labelledby="viewNhanVienModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="viewNhanVienModalLabel">
              <i class="fas fa-id-card me-2"></i> Thông tin chi tiết Nhân Viên
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedNhanVien">
            <div class="row">
              <div class="col-md-4 text-center">
                <img 
                  :src="selectedNhanVien.AVATAR || defaultAvatar" 
                  class="avatar-modal" 
                  alt="Avatar"
                >
              </div>
              <div class="col-md-8">
                <h3 class="text-info">{{ selectedNhanVien.HoTenNV }}</h3>
                <p class="fs-5"><strong>Chức vụ:</strong> {{ selectedNhanVien.ChucVu }}</p>
                <hr class="border-secondary">
                <p><strong>MSNV (Username):</strong> {{ selectedNhanVien.MSNV }}</p>
                <p><strong>Email:</strong> {{ selectedNhanVien.EMAIL }}</p>
                <p><strong>CCCD:</strong> {{ selectedNhanVien.CCCD }}</p>
                <p><strong>Điện thoại:</strong> {{ selectedNhanVien.SoDienThoai }}</p>
                <p><strong>Địa chỉ:</strong> {{ selectedNhanVien.DiaChi }}</p>
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
import NhanVienService from "@/services/nhanvien.service";
import { Modal } from "bootstrap"; // 3. IMPORT MODAL TỪ BOOTSTRAP

export default {
  name: "NhanVienManagement",
  data() {
    return {
      nhanViens: [],
      loading: true,
      searchText: "",
      filterChucVu: "all",
      currentPage: 1,
      itemsPerPage: 10,
      defaultAvatar: "https://i.imgur.com/sC21Kna.png",
      
      // 4. KHAI BÁO BIẾN CHO MODAL MỚI
      viewModal: null,
      selectedNhanVien: null, 
    };
  },
  computed: {
    // (Toàn bộ computed giữ nguyên)
    filteredByChucVu() {
      if (this.filterChucVu === "all") {
        return this.nhanViens;
      }
      return this.nhanViens.filter((nv) => nv.ChucVu === this.filterChucVu);
    },
    filteredNhanViens() {
      if (!this.searchText) {
        return this.filteredByChucVu;
      }
      const lowerSearchText = this.searchText.toLowerCase();
      return this.filteredByChucVu.filter(
        (nv) => nv.HoTenNV.toLowerCase().includes(lowerSearchText)
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
    // (Các hàm retrieveNhanViens, confirmDelete, changePage, search giữ nguyên)
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
    async confirmDelete(nhanVien) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${nhanVien.HoTenNV}"?`)) {
        try {
          await NhanVienService.delete(nhanVien._id);
          this.retrieveNhanViens();
        } catch (error) {
          alert("Không thể xóa nhân viên.");
        }
      }
    },
    changePage(pageNumber) {
      if (pageNumber < 1) pageNumber = 1;
      if (pageNumber > this.totalPages) pageNumber = this.totalPages;
      this.currentPage = pageNumber;
    },
    search() {
        this.currentPage = 1;
    },

    // 5. HÀM MỞ MODAL XEM CHI TIẾT (MỚI)
    openViewModal(nhanVien) {
      this.selectedNhanVien = nhanVien;
      this.viewModal.show();
    }
  },
  watch: {
    filterChucVu() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.retrieveNhanViens();
    // 6. KHỞI TẠO MODAL MỚI KHI TRANG ĐƯỢC TẢI
    this.viewModal = new Modal(document.getElementById("viewNhanVienModal"));
  },
};
</script>

<style scoped>
/* (Style CSS cho card, form, table) */
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
.table-hover tbody tr:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.075);
}
.page-link {
    background-color: #212529;
    color: #58a6ff;
    border-color: #495057;
}
.page-item.active .page-link {
    background-color: #58a6ff;
    color: #fff;
    border-color: #58a6ff;
}
.page-item.disabled .page-link {
    background-color: #212529;
    color: #6c757d;
    border-color: #495057;
}

/* 7. STYLE CHO AVATAR (TRONG BẢNG) */
.avatar-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #495057;
}

/* 8. STYLE CHO AVATAR (TRONG MODAL) */
.avatar-modal {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #495057;
  margin-top: 1rem;
}

/* Style cho modal-body (để tránh lỗi thanh cuộn) */
.modal-body p {
  margin-bottom: 0.75rem;
}
</style>