<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Quản lý Nhà Xuất Bản</h3>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-9">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Nhập tên NXB để tìm..."
                v-model="searchText"
                @keyup.enter="search"
              />
              <button class="btn btn-info" type="button" @click="search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-3 text-end">
            <router-link to="/admin/nhaxuatban/add" class="btn btn-primary w-100">
              <i class="fas fa-plus me-2"></i> Thêm NXB Mới
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-dark text-white">
      <div class="card-header">
        <i class="fas fa-building me-2"></i> Danh sách Nhà Xuất Bản
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã NXB</th>
                <th>Tên Nhà Xuất Bản</th>
                <th>Địa Chỉ</th>
                <th style="width: 120px">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(nxb, index) in filteredNXB" :key="nxb._id">
                <td>{{ index + 1 }}</td>
                <td>{{ nxb.MANXB }}</td>
                <td>{{ nxb.TENNXB }}</td>
                <td>{{ nxb.DIACHI }}</td>
                <td>
                  <router-link
                    :to="{ name: 'admin.nhaxuatban.edit', params: { id: nxb._id } }"
                    class="btn btn-sm btn-info me-2"
                    title="Sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="openDeleteModal(nxb)"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredNXB.length === 0">
                <td colspan="5" class="text-center">Không có dữ liệu.</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">
                  <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="confirmDeleteNXBModal"
      tabindex="-1"
      aria-labelledby="confirmDeleteNXBModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmDeleteNXBModalLabel">Xác nhận Xóa</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedNXB">
            Bạn có chắc chắn muốn xóa Nhà Xuất Bản:
            <strong>{{ selectedNXB.TENNXB }}</strong
            >? (Mã: <strong>{{ selectedNXB.MANXB }}</strong
            >)
            <p class="text-warning mt-2">
              Lưu ý: Hành động này không thể hoàn tác.
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
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { Modal } from "bootstrap";

export default {
  name: "NhaXuatBanManagement",
  data() {
    return {
      nhaXuatBans: [],
      loading: true,
      searchText: "",
      
      deleteModal: null,
      selectedNXB: null,
    };
  },
  computed: {
    // Lọc NXB dựa trên searchText
    filteredNXB() {
      if (!this.searchText) {
        return this.nhaXuatBans;
      }
      const lowerSearch = this.searchText.toLowerCase();
      return this.nhaXuatBans.filter(
        (nxb) =>
          nxb.TENNXB.toLowerCase().includes(lowerSearch) ||
          nxb.MANXB.toLowerCase().includes(lowerSearch)
      );
    },
  },
  methods: {
    async retrieveNXB() {
      this.loading = true;
      try {
        const response = await NhaXuatBanService.getAll();
        this.nhaXuatBans = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách NXB:", error);
      } finally {
        this.loading = false;
      }
    },
    
    // Xử lý tìm kiếm
    search() {
      // Hàm này chỉ để kích hoạt re-render, logic lọc đã ở trong 'computed'
    },

    // Mở modal xóa
    openDeleteModal(nxb) {
      this.selectedNXB = nxb;
      this.deleteModal.show();
    },

    // Xử lý xóa
    async handleDelete() {
      if (!this.selectedNXB) return;
      try {
        await NhaXuatBanService.delete(this.selectedNXB._id);
        this.deleteModal.hide();
        // Tải lại danh sách
        this.retrieveNXB();
      } catch (error) {
        alert("Không thể xóa Nhà Xuất Bản. Có thể NXB này đang được gán cho Sách.");
      }
    },
  },
  mounted() {
    this.retrieveNXB();
    this.deleteModal = new Modal(document.getElementById("confirmDeleteNXBModal"));
  },
};
</script>

<style scoped>
/* (Style y hệt các trang Management khác) */
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
</style>