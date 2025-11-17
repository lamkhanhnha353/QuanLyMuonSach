<template>
  <div class="muon-sach-management">
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="stats-card card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon bg-light-warning me-3">
              <i class="fas fa-inbox text-warning"></i>
            </div>
            <div>
              <h5 class="card-title fw-bold mb-1">12</h5>
              <p class="card-text text-muted mb-0">Yêu cầu mượn chờ duyệt</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stats-card card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon bg-light-danger me-3">
              <i class="fas fa-book-dead text-danger"></i>
            </div>
            <div>
              <h5 class="card-title fw-bold mb-1">5</h5>
              <p class="card-text text-muted mb-0">Sách quá hạn</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stats-card card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon bg-light-info me-3">
              <i class="fas fa-undo-alt text-info"></i>
            </div>
            <div>
              <h5 class="card-title fw-bold mb-1">8</h5>
              <p class="card-text text-muted mb-0">Yêu cầu trả chờ xác nhận</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-white pt-3 pb-0 border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0 fw-bold">
            <i class="fas fa-receipt me-2 text-primary"></i>Quản Lý Phiếu Mượn
          </h4>
          <button class="btn btn-primary" @click="openAddModal">
            <i class="fas fa-plus me-2"></i>Thêm Phiếu Mượn
          </button>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control bg-light border-0" 
                placeholder="Tìm kiếm phiếu mượn, độc giả, tên sách..."
                v-model="searchQuery"
                @input="filterMuonSach"
              >
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filterStatus" @change="filterMuonSach">
              <option value="">Tất cả Trạng Thái</option>
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="filteredMuonSach.length === 0" class="alert alert-light text-center">
          Không có phiếu mượn nào phù hợp.
        </div>

        <div class="table-responsive" v-else>
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Độc Giả</th>
                <th>Sách</th>
                <th>Ngày Mượn</th>
                <th>Ngày Trả Dự Kiến</th>
                <th>Ngày Trả Thực Tế</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="muon in filteredMuonSach" :key="muon.MaPhieu">
                <td>{{ muon.MaPhieu }}</td>
                <td>{{ muon.HoTenDG }}</td>
                <td>{{ muon.TenSach }}</td>
                <td>{{ formatDate(muon.NgayMuon) }}</td>
                <td>{{ formatDate(muon.NgayTraDuKien) }}</td>
                <td>{{ formatDate(muon.NgayTra) }}</td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'badge-light-warning': muon.TrangThai === 'Đang mượn',
                      'badge-light-success': muon.TrangThai === 'Đã trả',
                      'badge-light-danger': muon.TrangThai === 'Quá hạn'
                    }"
                  >
                    {{ muon.TrangThai }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-primary me-2" 
                    @click="openEditModal(muon)"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="deleteMuonSach(muon.MaPhieu)"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="muonSachModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? 'Cập Nhật Phiếu Mượn' : 'Thêm Phiếu Mượn' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Độc Giả <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.MaDG">
                  <option value="">Chọn Độc Giả</option>
                  <option v-for="dg in docGiaList" :key="dg.MaDG" :value="dg.MaDG">
                    {{ dg.HoTenDG }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Sách <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.MaSach">
                  <option value="">Chọn Sách</option>
                  <option v-for="sach in sachList" :key="sach.MaSach" :value="sach.MaSach">
                    {{ sach.TenSach }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Ngày Mượn <span class="text-danger">*</span></label>
                <input type="date" class="form-control" v-model="formData.NgayMuon">
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày Trả Dự Kiến <span class="text-danger">*</span></label>
                <input type="date" class="form-control" v-model="formData.NgayTraDuKien">
              </div>
            </div>
            <div class="row mb-3" v-if="isEdit">
              <div class="col-md-6">
                <label class="form-label">Ngày Trả Thực Tế</label>
                <input type="date" class="form-control" v-model="formData.NgayTra">
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng Thái</label>
                <select class="form-select" v-model="formData.TrangThai">
                  <option value="Đang mượn">Đang mượn</option>
                  <option value="Đã trả">Đã trả</option>
                  <option value="Quá hạn">Quá hạn</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="saveMuonSach">
              {{ isEdit ? 'Cập Nhật' : 'Thêm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MuonSachService from "@/services/muonsach.service";
import SachService from "@/services/sach.service";
import DocGiaService from "@/services/docgia.service";
// Import Modal của Bootstrap để xử lý
import { Modal } from 'bootstrap'; 

export default {
  name: "StaffMuonSachManagement",
  data() {
    return {
      muonSachList: [],
      filteredMuonSach: [],
      sachList: [],
      docGiaList: [],
      searchQuery: "",
      filterStatus: "",
      loading: false,
      isEdit: false,
      formData: {
        MaPhieu: null,
        MaDG: "",
        MaSach: "",
        NgayMuon: "",
        NgayTraDuKien: "",
        NgayTra: "",
        TrangThai: "Đang mượn",
      },
      muonSachModalInstance: null, // Để lưu trữ modal
    };
  },
  mounted() {
    this.loadData();
    // Khởi tạo modal
    const modalEl = document.getElementById("muonSachModal");
    if(modalEl) {
      this.muonSachModalInstance = new Modal(modalEl);
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const [muonData, sachData, docGiaData] = await Promise.all([
          MuonSachService.getAll(),
          SachService.getAll(),
          DocGiaService.getAll(),
        ]);
        
        this.muonSachList = muonData.data || [];
        this.filteredMuonSach = this.muonSachList;
        this.sachList = sachData.data || [];
        this.docGiaList = docGiaData.data || [];

        this.filterMuonSach();
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        alert("Lỗi khi tải dữ liệu. Vui lòng kiểm tra console.");
      } finally {
        this.loading = false;
      }
    },
    filterMuonSach() {
      // Sửa lỗi logic tìm kiếm từ file gốc
      this.filteredMuonSach = this.muonSachList.filter((muon) => {
        const matchSearch =
          (muon.HoTenDG || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (muon.TenSach || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (muon.MaPhieu || '').toString().toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchStatus =
          this.filterStatus === "" || muon.TrangThai === this.filterStatus;

        return matchSearch && matchStatus;
      });
    },
    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      if(this.muonSachModalInstance) this.muonSachModalInstance.show();
    },
    openEditModal(muon) {
      this.isEdit = true;
      this.formData = { 
        ...muon,
        NgayMuon: this.formatDateForInput(muon.NgayMuon),
        NgayTraDuKien: this.formatDateForInput(muon.NgayTraDuKien),
        NgayTra: this.formatDateForInput(muon.NgayTra),
      };
      if(this.muonSachModalInstance) this.muonSachModalInstance.show();
    },
    resetForm() {
      this.formData = {
        MaPhieu: null,
        MaDG: "",
        MaSach: "",
        NgayMuon: new Date().toISOString().split('T')[0], // Mặc định hôm nay
        NgayTraDuKien: "",
        NgayTra: "",
        TrangThai: "Đang mượn",
      };
    },
    async saveMuonSach() {
      try {
        if (this.isEdit) {
          await MuonSachService.update(this.formData.MaPhieu, this.formData);
        } else {
          const { MaPhieu, ...addData } = this.formData;
          await MuonSachService.create(addData);
        }
        await this.loadData();
        if(this.muonSachModalInstance) this.muonSachModalInstance.hide();
      } catch (error) {
        console.error("Lỗi lưu phiếu mượn:", error);
        alert("Lỗi khi lưu phiếu mượn. Vui lòng kiểm tra console.");
      }
    },
    async deleteMuonSach(maPhieu) {
      if (confirm("Bạn chắc chắn muốn xóa phiếu mượn này?")) {
        try {
          await MuonSachService.delete(maPhieu);
          await this.loadData();
        } catch (error) {
          console.error("Lỗi xóa phiếu mượn:", error);
          alert("Lỗi khi xóa phiếu mượn. Vui lòng kiểm tra console.");
        }
      }
    },
    formatDate(date) {
      if (!date) return "Chưa có";
      try {
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
      } catch (e) {
        return date;
      }
    },
    formatDateForInput(date) {
        if (!date) return "";
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch (e) {
            return "";
        }
    }
  },
};
</script>

<style scoped>
/* Thẻ Thống Kê */
.stats-card .card-body {
  padding: 1.5rem;
}
.stats-card .stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stats-icon i {
  font-size: 1.5rem;
}
.bg-light-warning { background-color: #fff8eb; }
.text-warning { color: #ffc107 !important; }
.bg-light-danger { background-color: #fff5f5; }
.text-danger { color: #dc3545 !important; }
.bg-light-info { background-color: #eef7ff; }
.text-info { color: #0d6efd !important; }

/* Bảng và Card chính */
.card {
  border-radius: 12px;
}
.card-header {
  border-radius: 12px 12px 0 0;
}
.form-control, .form-select {
  border-radius: 8px;
}
.form-control.bg-light, .form-select.bg-light {
  background-color: #f8f9fa !important;
}
.form-control:focus, .form-select:focus {
  background-color: #fff;
  border-color: #90baff;
  box-shadow: 0 0 0 0.25rem rgba(63, 131, 255, 0.25);
}
.input-group-text {
  border-radius: 8px 0 0 8px;
}
.input-group .form-control {
  border-radius: 0 8px 8px 0;
}

/* Badge Trạng Thái */
.badge {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
}
.badge-light-warning {
  background-color: #fff8eb;
  color: #ffc107;
}
.badge-light-success {
  background-color: #e6f7f1;
  color: #198754;
}
.badge-light-danger {
  background-color: #fff5f5;
  color: #dc3545;
}

/* Nút bấm */
.btn-primary {
  background-color: #303f9f; /* Màu xanh đậm của sidebar */
  border-color: #303f9f;
  font-weight: 500;
}
.btn-primary:hover {
  background-color: #24307b;
  border-color: #24307b;
}
.btn-outline-primary {
  color: #303f9f;
  border-color: #303f9f;
}
.btn-outline-primary:hover {
  background-color: #303f9f;
  color: #fff;
}
.text-primary {
  color: #303f9f !important;
}
</style>