<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <i class="fas fa-receipt me-2"></i>Quản Lý Phiếu Mượn
      </h1>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus me-2"></i>Thêm Phiếu Mượn
      </button>
    </div>

    <div class="card bg-dark">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-8">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm phiếu mượn..."
              v-model="searchQuery"
              @input="filterMuonSach"
            >
          </div>
          <div class="col-md-4">
            <select class="form-control" v-model="filterStatus" @change="filterMuonSach">
              <option value="">Tất cả Trạng Thái</option>
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="filteredMuonSach.length === 0" class="alert alert-info">
          Không có phiếu mượn nào
        </div>

        <table v-else class="table table-dark table-hover">
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
                    'bg-warning': muon.TrangThai === 'Đang mượn',
                    'bg-success': muon.TrangThai === 'Đã trả',
                    'bg-danger': muon.TrangThai === 'Quá hạn'
                  }"
                >
                  {{ muon.TrangThai }}
                </span>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-info me-2" 
                  @click="openEditModal(muon)"
                  title="Chỉnh sửa"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
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

    <!-- Modal Thêm/Sửa Phiếu Mượn -->
    <div class="modal fade" id="muonSachModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark">
          <div class="modal-header border-bottom border-secondary">
            <h5 class="modal-title">
              {{ isEdit ? 'Cập Nhật Phiếu Mượn' : 'Thêm Phiếu Mượn' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Độc Giả <span class="text-danger">*</span></label>
                <select class="form-control" v-model="formData.MaDG">
                  <option value="">Chọn Độc Giả</option>
                  <option v-for="dg in docGiaList" :key="dg.MaDG" :value="dg.MaDG">
                    {{ dg.HoTenDG }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Sách <span class="text-danger">*</span></label>
                <select class="form-control" v-model="formData.MaSach">
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
                <select class="form-control" v-model="formData.TrangThai">
                  <option value="Đang mượn">Đang mượn</option>
                  <option value="Đã trả">Đã trả</option>
                  <option value="Quá hạn">Quá hạn</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top border-secondary">
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
    };
  },
  mounted() {
    this.loadData();
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
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    filterMuonSach() {
      this.filteredMuonSach = this.muonSachList.filter((muon) => {
        const matchSearch =
          muon.HoTenDG.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          muon.TenSach.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchStatus =
          this.filterStatus === "" || muon.TrangThai === this.filterStatus;

        return matchSearch && matchStatus;
      });
    },
    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      const modal = new bootstrap.Modal(document.getElementById("muonSachModal"));
      modal.show();
    },
    openEditModal(muon) {
      this.isEdit = true;
      this.formData = { ...muon };
      const modal = new bootstrap.Modal(document.getElementById("muonSachModal"));
      modal.show();
    },
    resetForm() {
      this.formData = {
        MaPhieu: null,
        MaDG: "",
        MaSach: "",
        NgayMuon: "",
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
          await MuonSachService.create(this.formData);
        }
        this.loadData();
        bootstrap.Modal.getInstance(document.getElementById("muonSachModal")).hide();
      } catch (error) {
        console.error("Lỗi lưu phiếu mượn:", error);
        alert("Lỗi khi lưu phiếu mượn");
      }
    },
    async deleteMuonSach(maPhieu) {
      if (confirm("Bạn chắc chắn muốn xóa phiếu mượn này?")) {
        try {
          await MuonSachService.delete(maPhieu);
          this.loadData();
        } catch (error) {
          console.error("Lỗi xóa phiếu mượn:", error);
          alert("Lỗi khi xóa phiếu mượn");
        }
      }
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

h1 {
  color: white;
  font-size: 28px;
}

.form-control {
  background-color: #2a2a2a;
  color: white;
  border-color: #444;
}

.form-control:focus {
  background-color: #2a2a2a;
  color: white;
  border-color: #4299e1;
  box-shadow: 0 0 0 0.2rem rgba(66, 153, 225, 0.25);
}

.form-label {
  color: #aaa;
  margin-bottom: 8px;
}

.table {
  color: white;
}

.table th {
  color: #aaa;
  border-color: #444;
  font-weight: 600;
}

.table td {
  border-color: #444;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #3a3a3a;
}

.badge {
  font-size: 12px;
  padding: 5px 10px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
