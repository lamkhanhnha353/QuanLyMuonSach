<template>
  <div class="staff-dashboard">
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Yêu Cầu Chờ Xử Lý</div>
          <div class="stat-value">{{ pendingCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon borrowed">
          <i class="fas fa-book"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Sách Đang Mượn</div>
          <div class="stat-value">{{ borrowedCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon return">
          <i class="fas fa-undo"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Yêu Cầu Trả</div>
          <div class="stat-value">{{ returnCount }}</div>
        </div>
      </div>
    </div>

    <div class="filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm theo mã nhân viên, mã độc giả, tên sách..."
          @keyup.enter="applyFilters"
        >
      </div>
      <div class="filter-box">
        <i class="fas fa-filter"></i>
        <select v-model="statusFilter" @change="applyFilters">
          <option value="all">Tất cả trạng thái</option>
          <option value="chờ duyệt">Chờ duyệt</option>
          <option value="đã duyệt">Đã duyệt</option>
          <option value="đang mượn">Đang mượn</option>
          <option value="đã trả">Đã trả</option>
          <option value="từ chối">Từ chối</option>
          <option value="trễ hạn">Trễ hạn</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <h4>Yêu cầu mượn/trả</h4>
        <button class="btn-refresh" @click="fetchData" :disabled="loading">
          <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>

      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="filteredData.length === 0" class="text-center p-5 text-muted">
        Không tìm thấy yêu cầu nào phù hợp.
      </div>

      <table v-else class="main-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã độc giả</th>
            <th>Tên độc giả</th>
            <th>Tên sách</th>
            <th>Trạng thái</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item._id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ item.docGiaInfo?.username || 'N/A' }}</td>
            <td>{{ (item.docGiaInfo?.HOLOT || '') + ' ' + (item.docGiaInfo?.TEN || '') }}</td>
            <td>{{ item.sachInfo?.TENSACH || 'N/A' }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(item.trangThai)]">
                {{ item.trangThai }}
              </span>
            </td>
            <td>{{ formatDate(item.ngayMuon) }}</td>
            <td>{{ formatDate(item.ngayTra) }}</td>
            <td>
              <div class="action-buttons">
                <template v-if="item.trangThai === 'chờ duyệt'">
                  <button class="btn-action confirm" title="Duyệt yêu cầu" @click="openUpdateModal(item, 'đã duyệt')">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="btn-action cancel" title="Từ chối yêu cầu" @click="openUpdateModal(item, 'từ chối')">
                    <i class="fas fa-times"></i>
                  </button>
                </template>
                
                <template v-if="item.trangThai === 'đã duyệt'">
                  <button class="btn-action confirm" title="Xác nhận đã lấy sách" @click="openUpdateModal(item, 'đang mượn')">
                    <i class="fas fa-hand-holding"></i> Giao sách
                  </button>
                </template>

                <template v-if="item.trangThai === 'đang mượn'">
                  <button class="btn-action return" title="Xác nhận đã trả sách" @click="openUpdateModal(item, 'đã trả')">
                    <i class="fas fa-undo"></i> Nhận trả
                  </button>
                </template>

                <template v-if="item.trangThai === 'đang chờ trả'">
                  <button class="btn-action return" title="Xác nhận đã trả sách" @click="openUpdateModal(item, 'đã trả')">
                    <i class="fas fa-check"></i> Duyệt trả
                  </button>
                </template>
                 <!-- UPDATED: Use confirmReturn modal instead -->
                 <!-- Replaced openUpdateModal(item, 'đã trả') with openConfirmReturnModal(item) -->
                
                <button class="btn-action detail" title="Xem chi tiết" @click="viewDetails(item)">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination-container" v-if="totalPages > 1">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          &laquo;
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)" 
          :class="['page-btn', { 'active': currentPage === page }]"
        >
          {{ page }}
        </button>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          &raquo;
        </button>
      </div>
    </div>

    <div class="modal" id="confirmUpdateModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận cập nhật</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="itemToUpdate">
              Bạn có chắc muốn cập nhật trạng thái của phiếu mượn sách <strong>{{ itemToUpdate.sachInfo?.TENSACH }}</strong>
              (mượn bởi <strong>{{ (itemToUpdate.docGiaInfo?.HOLOT || '') + ' ' + (itemToUpdate.docGiaInfo?.TEN || '') }}</strong>)
              thành <strong>"{{ newStatus }}"</strong>?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
            <button type="button" class="btn btn-primary" @click="handleUpdateStatus">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="detailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết Phiếu Mượn</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedItem">
            <div class="row">
              <div class="col-md-5">
                <h6 class="text-primary fw-bold">Thông Tin Sách</h6>
                <img :src="selectedItem.sachInfo?.HinhAnh || defaultBookImage" class="img-fluid rounded mb-2" alt="Book cover" @error="onImgError">
                <p><strong>Tên sách:</strong> {{ selectedItem.sachInfo?.TENSACH }}</p>
                <p><strong>Tác giả:</strong> {{ selectedItem.sachInfo?.TACGIA }}</p>
                <p><strong>Năm XB:</strong> {{ selectedItem.sachInfo?.NAMXUATBAN }}</p>
              </div>
              <div class="col-md-7">
                <h6 class="text-primary fw-bold">Thông Tin Độc Giả</h6>
                <p><strong>Họ tên:</strong> {{ (selectedItem.docGiaInfo?.HOLOT || '') + ' ' + (selectedItem.docGiaInfo?.TEN || '') }}</p>
                <p><strong>Username:</strong> {{ selectedItem.docGiaInfo?.username }}</p>
                <p><strong>Điện thoại:</strong> {{ selectedItem.docGiaInfo?.DIENTHOAI }}</p>
                <p><strong>Địa chỉ:</strong> {{ selectedItem.docGiaInfo?.DIACHI }}</p>
                
                <hr>
                
                <h6 class="text-primary fw-bold">Thông Tin Phiếu Mượn</h6>
                <p><strong>Trạng thái:</strong> <span :class="['status-badge', getStatusClass(selectedItem.trangThai)]">{{ selectedItem.trangThai }}</span></p>
                <p><strong>Ngày mượn (dự kiến):</strong> {{ formatDate(selectedItem.ngayMuon) }}</p>
                <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(selectedItem.ngayTra) }}</p>
                <p><strong>Ngày trả (thực tế):</strong> {{ formatDate(selectedItem.ngayTraThucTe) || 'Chưa trả' }}</p>

                <hr>
                
                <h6 class="text-primary fw-bold">Nhân Viên Xử Lý</h6>
                <p v-if="selectedItem.nhanVienInfo">
                  <strong>Họ tên:</strong> {{ selectedItem.nhanVienInfo?.HoTenNV }}<br>
                  <strong>MSNV:</strong> {{ selectedItem.nhanVienInfo?.MSNV }}
                </p>
                <p v-else class="text-muted">
                  (Chưa có nhân viên xử lý)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import NhanVienService from "@/services/nhanvien.service";
import AuthService from "@/services/auth.service";
import { Modal } from "bootstrap";

export default {
  name: "StaffDashboard",
  data() {
    return {
      allData: [], // Chứa tất cả dữ liệu gốc từ API
      filteredData: [], // Dữ liệu đã lọc
      
      loading: false,
      searchQuery: "",
      statusFilter: "all",
      
      currentUser: null,
      
      // Modals
      updateModalInstance: null,
      detailModalInstance: null,
      itemToUpdate: null,
      newStatus: "",
      selectedItem: null,
      defaultBookImage: "https://via.placeholder.com/300x400.png?text=No+Image",
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    // Thống kê
    pendingCount() {
      return this.allData.filter(item => item.trangThai === 'chờ duyệt').length;
    },
    borrowedCount() {
      return this.allData.filter(item => item.trangThai === 'đang mượn').length;
    },
    returnCount() {
      // (Giả sử bạn có trạng thái 'chờ trả' hoặc 'đã trả')
      // Hiện tại, chúng ta đếm số sách 'đã trả'
      return this.allData.filter(item => item.trangThai === 'đã trả').length;
    },
    
    // Phân trang
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        // 1. Tải tất cả phiếu mượn
        const muonSachRes = await MuonSachService.getAll();
        let muonSachList = muonSachRes.data || [];

        // 2. Tải tất cả thông tin liên quan (song song)
        const [docGiaRes, sachRes, nhanVienRes] = await Promise.all([
          DocGiaService.getAll(),
          SachService.getAll(),
          NhanVienService.getAll()
        ]);

        const docGiaMap = new Map(docGiaRes.data.map(item => [item._id, item]));
        const sachMap = new Map(sachRes.data.map(item => [item._id, item]));
        const nhanVienMap = new Map(nhanVienRes.data.map(item => [item._id, item]));

        // 3. Gắn thông tin vào danh sách phiếu mượn
        muonSachList.forEach(item => {
          item.docGiaInfo = docGiaMap.get(item.docGiaId);
          item.sachInfo = sachMap.get(item.sachId);
          if (item.nhanVienId) {
            item.nhanVienInfo = nhanVienMap.get(item.nhanVienId);
          }
        });

        this.allData = muonSachList;
        this.applyFilters(); // Áp dụng bộ lọc ban đầu
        
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        this.loading = false;
      }
    },
    
    applyFilters() {
      let result = this.allData;

      // 1. Lọc theo trạng thái
      if (this.statusFilter !== 'all') {
        result = result.filter(item => item.trangThai === this.statusFilter);
      }

      // 2. Lọc theo tìm kiếm
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter(item => {
          const docGiaUser = item.docGiaInfo?.username?.toLowerCase() || '';
          const docGiaHoTen = `${item.docGiaInfo?.HOLOT} ${item.docGiaInfo?.TEN}`.toLowerCase();
          const tenSach = item.sachInfo?.TENSACH?.toLowerCase() || '';
          const msnv = item.nhanVienInfo?.MSNV?.toLowerCase() || '';
          
          return docGiaUser.includes(query) || 
                 docGiaHoTen.includes(query) || 
                 tenSach.includes(query) ||
                 msnv.includes(query);
        });
      }
      
      // Sắp xếp: các phiếu "chờ duyệt" lên đầu
      result.sort((a, b) => {
        if (a.trangThai === 'chờ duyệt' && b.trangThai !== 'chờ duyệt') return -1;
        if (a.trangThai !== 'chờ duyệt' && b.trangThai === 'chờ duyệt') return 1;
        // (Bạn có thể thêm logic sắp xếp theo ngày tháng ở đây)
        return 0;
      });

      this.filteredData = result;
      this.currentPage = 1; // Reset về trang 1
    },

    // Xử lý Modal
    openUpdateModal(item, newStatus) {
      this.itemToUpdate = item;
      this.newStatus = newStatus;
      this.updateModalInstance.show();
    },
    
    async handleUpdateStatus() {
      if (!this.itemToUpdate || !this.newStatus || !this.currentUser) return;
      
        // Check if this is a return confirmation
        if (this.newStatus === 'đã trả' && this.itemToUpdate.trangThai === 'đang chờ trả') {
          return this.handleConfirmReturn();
        }
      
      this.loading = true; // (Có thể thêm 1 cờ loading riêng cho modal)
      
      try {
        const payload = {
          trangThai: this.newStatus,
          nhanVienId: this.currentUser._id, // Gửi ID của nhân viên đang đăng nhập
        };

        // Gọi API
        await MuonSachService.update(this.itemToUpdate._id, payload);
        
        // Cập nhật lại dữ liệu
        await this.fetchData();
        
        this.updateModalInstance.hide();
        
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        alert("Cập nhật thất bại. Lỗi: " + (error.response?.data?.message || error.message));
      } finally {
        this.loading = false;
      }
    },
    
    viewDetails(item) {
      this.selectedItem = item;
      this.detailModalInstance.show();
    },
    
      openConfirmReturnModal(item) {
        this.itemToUpdate = item;
        this.newStatus = 'đã trả';
        this.updateModalInstance.show();
      },

      async handleConfirmReturn() {
        if (!this.itemToUpdate || !this.currentUser) return;
      
        this.loading = true;
      
        try {
          // Call confirmReturn API instead of update
          await MuonSachService.confirmReturn(this.itemToUpdate._id, this.currentUser._id);
        
          // Reload data
          await this.fetchData();
        
          this.updateModalInstance.hide();
          alert('Xác nhận trả sách thành công! SOQUYEN đã được cập nhật.');
        
        } catch (error) {
          console.error("Lỗi khi xác nhận trả sách:", error);
          alert("Xác nhận trả sách thất bại. Lỗi: " + (error.response?.data?.message || error.message));
        } finally {
          this.loading = false;
        }
      },

    // Phân trang
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    // Tiện ích
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        // Kiểm tra nếu ngày không hợp lệ (ví dụ: 'Chưa trả')
        if (isNaN(date.getTime())) return dateString; 
        
        // Tách ngày-tháng-năm
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return dateString; // Trả về nguyên bản nếu không thể định dạng
      }
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'chờ duyệt': return 'status-pending';
        case 'đã duyệt': return 'status-approved';
        case 'đang mượn': return 'status-borrowed';
        case 'đang chờ trả': return 'status-return-requested';
        case 'đã trả': return 'status-returned';
        case 'từ chối': return 'status-cancelled';
        case 'trễ hạn': return 'status-overdue';
        default: return 'status-default';
      }
    },
    
    onImgError(e) {
      e.target.src = this.defaultBookImage;
    }
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
    this.fetchData();
    
    // Khởi tạo Modals
    this.updateModalInstance = new Modal(document.getElementById("confirmUpdateModal"));
    this.detailModalInstance = new Modal(document.getElementById("detailModal"));
  },
};
</script>

<style scoped>
.staff-dashboard {
  padding: 24px;
  background-color: #f4f7fc;
  height: 100%;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
}
.stat-icon.pending { background: #eef7ff; color: #0d6efd; }
.stat-icon.borrowed { background: #e6f7f0; color: #198754; }
.stat-icon.return { background: #fff8e6; color: #ffc107; }

.stat-content .stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 4px;
}
.stat-content .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
}

/* Filter Section */
.filter-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.search-box, .filter-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid #dee2e6;
}
.search-box i, .filter-box i {
  color: #6c757d;
  margin-right: 10px;
}
.search-box input, .filter-box select {
  width: 100%;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 14px;
}
.search-box input:focus, .filter-box select:focus {
  outline: none;
  box-shadow: none;
}
.filter-box select {
  cursor: pointer;
}

/* Table Container */
.table-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.table-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}
.table-header h4 {
  margin: 0;
  font-weight: 600;
}
.btn-refresh {
  border: 1px solid #dee2e6;
  background: #fff;
  color: #0d6efd;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;
}
.btn-refresh:hover {
  background: #eef7ff;
}
.btn-refresh:disabled {
  color: #6c757d;
  cursor: not-allowed;
}

/* Table */
.main-table {
  width: 100%;
  border-collapse: collapse;
}
.main-table th, .main-table td {
  padding: 15px 20px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
}
.main-table th {
  font-weight: 600;
  color: #6c757d;
  background: #f8f9fa;
}
.main-table tbody tr:hover {
  background: #f8f9fa;
}

/* Status Badge */
.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.status-pending { background: #fff8e6; color: #ffc107; }
.status-approved { background: #eef7ff; color: #0d6efd; }
.status-borrowed { background: #e6f7f0; color: #198754; }
.status-returned { background: #e9ecef; color: #495057; }
.status-cancelled, .status-overdue { background: #fdeeee; color: #dc3545; }

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}
.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-action.confirm { background: #198754; }
.btn-action.confirm:hover { background: #157347; }

.btn-action.cancel { background: #dc3545; }
.btn-action.cancel:hover { background: #bb2d3b; }

.btn-action.return { background: #ffc107; color: #212529; }
.btn-action.return:hover { background: #ffca2c; }

.btn-action.detail { background: #0d6efd; }
.btn-action.detail:hover { background: #0b5ed7; }

/* Pagination */
.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.page-btn {
  border: 1px solid #dee2e6;
  background: #fff;
  color: #0d6efd;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.page-btn:hover {
  background: #eef7ff;
}
.page-btn:disabled {
  color: #6c757d;
  background: #f8f9fa;
  cursor: not-allowed;
}
.page-btn.active {
  background: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

/* Modal Detail */
.modal-body img {
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
  max-height: 350px;
  width: auto;
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.modal-body p {
  font-size: 15px;
  margin-bottom: 10px;
}
.modal-body .text-muted {
  font-style: italic;
}
</style>