<template>
  <div class="container-fluid pt-1 pb-4">
    <!-- Header Section -->
    <div class="row align-items-center mb-3">
      <div class="col-md-6">
        <h3 class="fw-bold text-dark mb-0">
          <span class="text-primary">Quản Lý</span> Nhà Xuất Bản
        </h3>
        <small class="text-muted">Xem và quản lý danh sách nhà xuất bản trong hệ thống</small>
      </div>
      <div class="col-md-6 text-md-end mt-3 mt-md-0">
        <button class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold" @click="openAddModal">
          <i class="fas fa-plus me-2"></i> Thêm Nhà Xuất Bản
        </button>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-12">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary ps-3">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Tìm kiếm theo tên NXB, mã NXB..."
                v-model="searchText"
                @keyup.enter="currentPage = 1"
              />
              <button class="btn btn-primary px-4 fw-bold" type="button" @click="currentPage = 1">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div class="d-flex align-items-center">
          <div class="icon-shape bg-primary text-white rounded-3 me-3 p-2">
            <i class="fas fa-building fa-lg"></i>
          </div>
          <h5 class="mb-0 fw-bold text-secondary">Danh sách Nhà Xuất Bản</h5>
        </div>
      </div>

      <div class="card-body p-0 mt-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 8%;">STT</th>
                <th class="ps-3 text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%;">Mã NXB</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 30%;">Tên Nhà Xuất Bản</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 37%;">Địa Chỉ</th>
                <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7 pe-5" style="width: 10%;">Hành động</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(nxb, index) in paginatedNXB" :key="nxb._id">
                <td class="text-center text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="ps-3">
                  <span class="text-secondary text-sm fw-bold">{{ nxb.MANXB }}</span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <h6 class="mb-0 text-sm fw-bold text-dark">{{ nxb.TENNXB }}</h6>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0 text-truncate" style="max-width: 300px;" :title="nxb.DIACHI">
                    {{ nxb.DIACHI }}
                  </p>
                </td>
                <td class="text-center pe-5">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-info mb-0 me-1 btn-sm d-flex align-items-center justify-content-center"
                      @click="openEditModal(nxb)"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-icon-only btn-rounded btn-outline-danger mb-0 btn-sm d-flex align-items-center justify-content-center"
                      @click="openDeleteModal(nxb)"
                      title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedNXB.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-building fa-3x text-secondary opacity-25 mb-3"></i>
                    <p class="text-muted fw-bold">Không tìm thấy dữ liệu nhà xuất bản nào.</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="text-muted mt-2">Đang tải dữ liệu...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
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

    <!-- Modal Thêm Nhà Xuất Bản -->
    <div
      class="modal fade"
      id="addNhaXuatBanModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-primary">Thêm Nhà Xuất Bản Mới</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4">
            <Form @submit="handleCreate" :validation-schema="nxbSchema" :validate-on-input="true">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label for="MANXB" class="form-label fw-bold text-dark">Mã Nhà Xuất Bản (MANXB)</label>
                    <Field name="MANXB" type="text" class="form-control" placeholder="Nhập mã NXB" />
                    <ErrorMessage name="MANXB" class="error-feedback" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label for="TENNXB" class="form-label fw-bold text-dark">Tên Nhà Xuất Bản</label>
                    <Field name="TENNXB" type="text" class="form-control" placeholder="Nhập tên NXB" />
                    <ErrorMessage name="TENNXB" class="error-feedback" />
                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="DIACHI" class="form-label fw-bold text-dark">Địa Chỉ</label>
                <Field name="DIACHI" type="text" class="form-control" placeholder="Nhập địa chỉ" />
                <ErrorMessage name="DIACHI" class="error-feedback" />
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">
                  Hủy bỏ
                </button>
                <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-if="!loading" class="fas fa-save me-2"></i>
                  Lưu Lại
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chỉnh Sửa Nhà Xuất Bản -->
    <div
      class="modal fade"
      id="editNhaXuatBanModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-warning">Chỉnh Sửa Nhà Xuất Bản</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4">
            <Form v-if="editingNXB" @submit="handleUpdate" :validation-schema="nxbSchema" :validate-on-input="true" :initial-values="editingNXB" :key="editingNXB._id">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label for="MANXB" class="form-label fw-bold text-dark">Mã Nhà Xuất Bản (MANXB)</label>
                    <Field name="MANXB" type="text" class="form-control" placeholder="Nhập mã NXB" />
                    <ErrorMessage name="MANXB" class="error-feedback" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label for="TENNXB" class="form-label fw-bold text-dark">Tên Nhà Xuất Bản</label>
                    <Field name="TENNXB" type="text" class="form-control" placeholder="Nhập tên NXB" />
                    <ErrorMessage name="TENNXB" class="error-feedback" />
                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="DIACHI" class="form-label fw-bold text-dark">Địa Chỉ</label>
                <Field name="DIACHI" type="text" class="form-control" placeholder="Nhập địa chỉ" />
                <ErrorMessage name="DIACHI" class="error-feedback" />
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">
                  Hủy bỏ
                </button>
                <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-if="!loading" class="fas fa-save me-2"></i>
                  Cập Nhật
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xóa -->
    <div
      class="modal fade"
      id="confirmDeleteNXBModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-danger">Xác nhận Xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-4" v-if="selectedNXB">
            <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
            </div>
            <p class="mb-1 text-muted">Bạn có chắc chắn muốn xóa Nhà Xuất Bản này?</p>
            <h5 class="fw-bold text-dark">{{ selectedNXB.TENNXB }}</h5>
            <small class="text-muted d-block mt-2">Hành động này không thể hoàn tác.</small>
          </div>
          <div class="modal-footer border-top-0 justify-content-center pb-4">
            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">
              Hủy bỏ
            </button>
            <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" @click="handleDelete">
              <i class="fas fa-trash me-2"></i> Xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div v-if="toastMessage" class="toast-overlay">
      <div
        class="toast show align-items-center text-white border-0 shadow-lg"
        :class="isToastError ? 'bg-danger' : 'bg-success'"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body fs-6 fw-bold">
            <i :class="isToastError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'" class="me-2"></i>
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toastMessage = ''"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { Modal } from "bootstrap";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "NhaXuatBanManagement",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Validation Schema
    const nxbSchema = yup.object().shape({
      MANXB: yup.string().required("Mã NXB là bắt buộc!"),
      TENNXB: yup.string().required("Tên NXB là bắt buộc!"),
      DIACHI: yup.string().required("Địa chỉ là bắt buộc!"),
    });

    return {
      nhaXuatBans: [],
      loading: false,
      searchText: "",

      addModal: null,
      editModal: null,
      deleteModal: null,
      selectedNXB: null,
      editingNXB: null,

      // Toast Notification
      toastMessage: "",
      isToastError: false,

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      nxbSchema,
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
    totalPages() {
      return Math.ceil(this.filteredNXB.length / this.itemsPerPage);
    },
    paginatedNXB() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNXB.slice(start, end);
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

    // Mở modal thêm
    openAddModal() {
      this.addModal.show();
    },

    // Mở modal chỉnh sửa
    openEditModal(nxb) {
      this.editingNXB = nxb;
      this.editModal.show();
    },

    // Xử lý thêm NXB
    async handleCreate(nxb) {
      this.loading = true;
      try {
        await NhaXuatBanService.create(nxb);
        this.addModal.hide();
        this.retrieveNXB(); // Tải lại danh sách

        // Hiển thị thông báo thành công
        this.toastMessage = "Thêm nhà xuất bản thành công.";
        this.isToastError = false;
        setTimeout(() => { this.toastMessage = "" }, 3000);

      } catch (error) {
        console.error("Error creating publisher:", error);
        console.error("Error response:", error.response);

        // Hiển thị thông báo lỗi cụ thể từ backend
        let errorMessage = "Không thể thêm nhà xuất bản. Vui lòng thử lại.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        this.toastMessage = errorMessage;
        this.isToastError = true;
        this.addModal.hide();
        setTimeout(() => { this.toastMessage = "" }, 4000);
      } finally {
        this.loading = false;
      }
    },

    // Xử lý cập nhật NXB
    async handleUpdate(nxb) {
      this.loading = true;
      try {
        await NhaXuatBanService.update(this.editingNXB._id, nxb);
        this.editModal.hide();
        this.retrieveNXB(); // Tải lại danh sách

        // Hiển thị thông báo thành công
        this.toastMessage = "Cập nhật nhà xuất bản thành công.";
        this.isToastError = false;
        setTimeout(() => { this.toastMessage = "" }, 3000);

      } catch (error) {
        console.error("Error updating publisher:", error);
        console.error("Error response:", error.response);

        // Hiển thị thông báo lỗi cụ thể từ backend
        let errorMessage = "Không thể cập nhật nhà xuất bản. Vui lòng thử lại.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        this.toastMessage = errorMessage;
        this.isToastError = true;
        this.editModal.hide();
        setTimeout(() => { this.toastMessage = "" }, 4000);
      } finally {
        this.loading = false;
      }
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
        this.retrieveNXB(); // Tải lại danh sách

        // Hiển thị thông báo thành công
        this.toastMessage = "Đã xóa nhà xuất bản thành công.";
        this.isToastError = false;
        setTimeout(() => { this.toastMessage = "" }, 3000);

      } catch (error) {
        // Hiển thị thông báo lỗi
        this.toastMessage = "Không thể xóa nhà xuất bản này. Có thể đang có ràng buộc dữ liệu.";
        this.isToastError = true;
        this.deleteModal.hide();
        setTimeout(() => { this.toastMessage = "" }, 4000);
      }
    },

    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
  },
  mounted() {
    this.retrieveNXB();
    this.addModal = new Modal(document.getElementById("addNhaXuatBanModal"));
    this.editModal = new Modal(document.getElementById("editNhaXuatBanModal"));
    this.deleteModal = new Modal(document.getElementById("confirmDeleteNXBModal"));
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

/* Input Group Styling */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
}

.form-control, .form-select {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  transition: all 0.2s;
}

/* Focus State */
.input-group:focus-within .input-group-text {
  background-color: #fff;
  border-color: #86b7fe;
  color: #0d6efd;
}
.input-group:focus-within .form-control {
  background-color: #fff;
  border-color: #86b7fe;
  box-shadow: none;
}
.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-radius: 0.375rem;
}

/* Table Styling */
.text-xxs {
    font-size: 0.75rem !important;
}
.text-sm {
    font-size: 0.875rem !important;
}
.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.04);
}

/* Button Icon Only */
.btn-icon-only {
    width: 2.375rem;
    height: 2.375rem;
    padding: 0;
}

/* Pagination Styling */
.page-link {
  color: #6c757d;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-weight: 600;
  transition: all 0.2s;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

.page-item.disabled .page-link {
  background-color: #e9ecef;
  color: #adb5bd;
}

.page-link:hover:not(.active) {
  background-color: #e9ecef;
  color: #0d6efd;
}

.cursor-pointer {
    cursor: pointer;
}

.icon-shape {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Toast Overlay Styles */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.error-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style>
