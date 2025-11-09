<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">Quản lý Phiếu Mượn</h3>

    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <select class="form-select" v-model="filterTrangThai">
              <option value="all">Tất cả trạng thái</option>
              <option value="chờ duyệt">Chờ duyệt</option>
              <option value="đã duyệt">Đã duyệt</option>
              <option value="đang mượn">Đang mượn</option>
              <option value="đã trả">Đã trả</option>
              <option value="từ chối">Từ chối</option>
              <option value="trễ hạn">Trễ hạn</option>
            </select>
          </div>
          <div class="col-md-9">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Tìm theo tên độc giả hoặc tên sách..."
                v-model="searchText"
              />
              <button class="btn btn-info" type="button" @click="search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-receipt me-2"></i> Danh sách phiếu mượn
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Độc Giả</th>
                <th>Tên Sách</th>
                <th>Ngày Mượn</th>
                <th>Ngày Trả (Hẹn)</th>
                <th>Trạng Thái</th>
                <th>Nhân viên xử lý</th>
                <th class_="" style="width: 150px">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(phieu, index) in paginatedPhieuMuons" :key="phieu._id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ phieu.tenDocGia }}</td>
                <td>{{ phieu.tenSach }}</td>
                <td>{{ formatDate(phieu.ngayMuon) }}</td>
                <td>{{ formatDate(phieu.ngayTra) }}</td>
                <td>
                  <span :class="getStatusClass(phieu.trangThai)">
                    {{ phieu.trangThai }}
                  </span>
                </td>
                <td>{{ phieu.tenNhanVien || "N/A" }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info me-2"
                    @click="openUpdateModal(phieu)"
                    title="Cập nhật trạng thái"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="openDeleteModal(phieu)"
                    title="Xóa phiếu"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedPhieuMuons.length === 0">
                <td colspan="8" class="text-center">Không có dữ liệu.</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8" class="text-center">
                  <div class="spinner-border text-info" role="status">
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
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                &laquo;
              </a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                &raquo;
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      class="modal fade"
      id="updateStatusModal"
      tabindex="-1"
      aria-labelledby="updateStatusModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="updateStatusModalLabel">
              Cập nhật Trạng thái Phiếu
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedPhieu">
            <p><strong>Độc giả:</strong> {{ selectedPhieu.tenDocGia }}</p>
            <p><strong>Sách:</strong> {{ selectedPhieu.tenSach }}</p>
            <div class="form-group">
              <label for="trangThaiSelect" class="form-label">Trạng thái mới:</label>
              <select class="form-select" v-model="newTrangThai">
                <option value="chờ duyệt">Chờ duyệt</option>
                <option value="đã duyệt">Đã duyệt (Chờ độc giả lấy)</option>
                <option value="đang mượn">Đang mượn</option>
                <option value="đã trả">Đã trả</option>
                <option value="từ chối">Từ chối</option>
                <option value="trễ hạn">Trễ hạn</option>
              </select>
            </div>
            <div v-if="updateError" class="alert alert-danger mt-3">
              {{ updateError }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="handleUpdateStatus">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="confirmDeleteModal"
      tabindex="-1"
      aria-labelledby="confirmDeleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmDeleteModalLabel">Xác nhận Xóa</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedPhieu">
            Bạn có chắc chắn muốn xóa phiếu mượn của
            <strong>{{ selectedPhieu.tenDocGia }}</strong> (sách:
            <strong>{{ selectedPhieu.tenSach }}</strong
            >)?
            <p class="text-warning mt-2">
              Lưu ý: Nếu phiếu đang ở trạng thái "đang mượn", "đã duyệt" hoặc "chờ
              duyệt", sách sẽ được tự động trả về kho.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="handleDelete">
              Xác nhận Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// (Phần <script> giữ nguyên, không thay đổi)

// Import 4 service cần thiết
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import NhanVienService from "@/services/nhanvien.service";
import AuthService from "@/services/auth.service"; // Để lấy ID nhân viên đang đăng nhập

import { Modal } from "bootstrap";

export default {
  name: "MuonSachManagement",
  data() {
    return {
      // Dữ liệu thô từ API
      phieuMuons: [],
      docGias: [],
      sachs: [],
      nhanViens: [],

      // Dữ liệu xử lý
      loading: true,
      currentUser: null,

      // Filter & Search
      searchText: "",
      filterTrangThai: "all",

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      // Modals
      updateModal: null,
      deleteModal: null,
      selectedPhieu: null,
      newTrangThai: "chờ duyệt",
      updateError: "",
    };
  },
  computed: {
    // 1. GHÉP DỮ LIỆU: Thêm Tên vào các phiếu mượn
    resolvedPhieuMuons() {
      return this.phieuMuons.map((phieu) => {
        const docGia = this.docGias.find((d) => d._id === phieu.docGiaId);
        const sach = this.sachs.find((s) => s._id === phieu.sachId);
        const nhanVien = this.nhanViens.find((n) => n._id === phieu.nhanVienId);

        return {
          ...phieu,
          tenDocGia: docGia ? `${docGia.HOLOT} ${docGia.TEN}` : "N/A",
          tenSach: sach ? sach.TENSACH : "N/A",
          tenNhanVien: nhanVien ? nhanVien.HoTenNV : "N/A",
        };
      });
    },

    // 2. LỌC DỮ LIỆU
    filteredPhieuMuons() {
      let filtered = this.resolvedPhieuMuons;

      // Lọc theo trạng thái
      if (this.filterTrangThai !== "all") {
        filtered = filtered.filter((p) => p.trangThai === this.filterTrangThai);
      }

      // Lọc theo tìm kiếm (tên sách hoặc tên độc giả)
      if (this.searchText) {
        const lowerSearch = this.searchText.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.tenDocGia.toLowerCase().includes(lowerSearch) ||
            p.tenSach.toLowerCase().includes(lowerSearch)
        );
      }

      return filtered;
    },

    // 3. PHÂN TRANG
    totalPages() {
      return Math.ceil(this.filteredPhieuMuons.length / this.itemsPerPage);
    },
    paginatedPhieuMuons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPhieuMuons.slice(start, end);
    },
  },
  methods: {
    // HÀM LẤY TẤT CẢ DỮ LIỆU TỪ 4 API
    async fetchAllData() {
      this.loading = true;
      try {
        const [phieuData, docGiaData, sachData, nhanVienData] = await Promise.all([
          MuonSachService.getAll(),
          DocGiaService.getAll(),
          SachService.getAll(),
          NhanVienService.getAll(),
        ]);

        this.phieuMuons = phieuData.data.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon)); // Sắp xếp mới nhất
        this.docGias = docGiaData.data;
        this.sachs = sachData.data;
        this.nhanViens = nhanVienData.data;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },

    // Hàm lấy ID nhân viên đang đăng nhập
    getCurrentNhanVienId() {
      if (!this.currentUser) {
        this.currentUser = AuthService.getCurrentUser();
      }
      return this.currentUser ? this.currentUser._id : null;
    },

    // Xử lý Modal Cập nhật
    openUpdateModal(phieu) {
      this.selectedPhieu = phieu;
      this.newTrangThai = phieu.trangThai;
      this.updateError = "";
      this.updateModal.show();
    },
    async handleUpdateStatus() {
      if (!this.selectedPhieu || !this.newTrangThai) return;

      const nhanVienId = this.getCurrentNhanVienId();
      if (!nhanVienId) {
        this.updateError = "Không thể xác thực nhân viên. Vui lòng đăng nhập lại.";
        return;
      }

      try {
        await MuonSachService.update(this.selectedPhieu._id, {
          trangThai: this.newTrangThai,
          nhanVienId: nhanVienId,
        });
        this.updateModal.hide();
        await this.fetchAllData(); // Tải lại toàn bộ dữ liệu
      } catch (error) {
        this.updateError =
          error.response?.data?.message || "Lỗi khi cập nhật trạng thái.";
      }
    },

    // Xử lý Modal Xóa
    openDeleteModal(phieu) {
      this.selectedPhieu = phieu;
      this.deleteModal.show();
    },
    async handleDelete() {
      if (!this.selectedPhieu) return;
      try {
        await MuonSachService.delete(this.selectedPhieu._id);
        this.deleteModal.hide();
        await this.fetchAllData(); // Tải lại toàn bộ dữ liệu
      } catch (error) {
        alert("Không thể xóa phiếu mượn.");
      }
    },

    // Xử lý Phân trang
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    search() {
      this.currentPage = 1;
    },

    // Tiện ích
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    },
    getStatusClass(trangThai) {
      switch (trangThai) {
        case "đã trả":
          return "badge bg-success";
        case "đang mượn":
          return "badge bg-info";
        case "đã duyệt":
          return "badge bg-primary";
        case "chờ duyệt":
          return "badge bg-warning text-dark";
        case "trễ hạn":
        case "từ chối":
          return "badge bg-danger";
        default:
          return "badge bg-secondary";
      }
    },
  },
  watch: {
    filterTrangThai() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchAllData();
    this.currentUser = AuthService.getCurrentUser();
    // Khởi tạo đối tượng Modal của Bootstrap
    this.updateModal = new Modal(document.getElementById("updateStatusModal"));
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
};
</script>

<style scoped>
/* (Phần <style> giữ nguyên, không thay đổi) */
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.form-control,
.form-select {
  background-color: #212529;
  color: #fff;
  border: 1px solid #495057;
}
.form-control:focus,
.form-select:focus {
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
</style>