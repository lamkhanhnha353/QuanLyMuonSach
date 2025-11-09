<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Quản lý Độc Giả</h3>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-12">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Nhập tên, họ hoặc username độc giả để tìm..."
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
        <i class="fas fa-users me-2"></i> Danh sách Độc Giả
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Username</th>
                <th>Giới Tính</th>
                <th>Điện Thoại</th>
                <th>Địa Chỉ</th>
                <th style="width: 120px">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(docgia, index) in paginatedDocGias" :key="docgia._id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ docgia.HOLOT }} {{ docgia.TEN }}</td>
                <td>{{ docgia.username }}</td>
                <td>{{ docgia.GIOITINH }}</td>
                <td>{{ docgia.DIENTHOAI }}</td>
                <td>{{ docgia.DIACHI }}</td>
                <td>
                  <router-link
                    :to="{ name: 'admin.docgia.edit', params: { id: docgia._id } }"
                    class="btn btn-sm btn-info me-2"
                    title="Sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="openDeleteModal(docgia)"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedDocGias.length === 0">
                <td colspan="7" class="text-center">Không có dữ liệu.</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" class="text-center">
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
      id="confirmDeleteDocGiaModal"
      tabindex="-1"
      aria-labelledby="confirmDeleteDocGiaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmDeleteDocGiaModalLabel">Xác nhận Xóa</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedDocGia">
            Bạn có chắc chắn muốn xóa Độc Giả:
            <strong>{{ selectedDocGia.HOLOT }} {{ selectedDocGia.TEN }}</strong
            >? (Username: <strong>{{ selectedDocGia.username }}</strong
            >)
            <p class="text-warning mt-2">
              Lưu ý: Xóa độc giả sẽ không xóa lịch sử mượn sách.
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
import DocGiaService from "@/services/docgia.service";
import { Modal } from "bootstrap";

export default {
  name: "DocGiaManagement",
  data() {
    return {
      docGias: [],
      loading: true,
      searchText: "",
      
      deleteModal: null,
      selectedDocGia: null,

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    // Lọc Độc Giả
    filteredDocGias() {
      if (!this.searchText) {
        return this.docGias;
      }
      const lowerSearch = this.searchText.toLowerCase();
      return this.docGias.filter(
        (dg) =>
          dg.HOLOT.toLowerCase().includes(lowerSearch) ||
          dg.TEN.toLowerCase().includes(lowerSearch) ||
          dg.username.toLowerCase().includes(lowerSearch)
      );
    },
    // Phân trang
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
    
    search() {
      this.currentPage = 1;
    },

    openDeleteModal(docgia) {
      this.selectedDocGia = docgia;
      this.deleteModal.show();
    },

    async handleDelete() {
      if (!this.selectedDocGia) return;
      try {
        await DocGiaService.delete(this.selectedDocGia._id);
        this.deleteModal.hide();
        this.retrieveDocGias(); // Tải lại danh sách
      } catch (error) {
        alert("Không thể xóa độc giả này.");
      }
    },

    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
  },
  mounted() {
    this.retrieveDocGias();
    this.deleteModal = new Modal(document.getElementById("confirmDeleteDocGiaModal"));
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