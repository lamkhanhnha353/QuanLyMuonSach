<template>
  <div class="container-fluid pt-3 pb-4 bg-light-gray min-vh-100">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-dark mb-1">Quản lý Mượn Trả</h3>
            <small class="text-muted">Xử lý các yêu cầu mượn và trả sách từ độc giả</small>
        </div>
        <button class="btn btn-white shadow-sm rounded-pill px-3 fw-bold text-primary border" @click="fetchData" :disabled="loading">
            <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i> Làm mới
        </button>
    </div>

    <!-- Main Content Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
       <!-- Custom Tabs Header -->
       <div class="card-header bg-white border-bottom p-0">
           <div class="d-flex overflow-auto px-2 custom-scrollbar">
               <button 
                  v-for="tab in tabs" 
                  :key="tab.key"
                  class="btn btn-tab rounded-0 border-0 py-3 px-4 fw-bold position-relative"
                  :class="{ 'active text-primary': activeTab === tab.key, 'text-secondary': activeTab !== tab.key }"
                  @click="switchTab(tab.key)"
               >
                  {{ tab.label }}
                  <span class="badge rounded-pill ms-2" :class="activeTab === tab.key ? 'bg-primary' : 'bg-light text-dark border'">{{ getTabCount(tab.key) }}</span>
                  <div class="tab-indicator" v-if="activeTab === tab.key"></div>
               </button>
           </div>
       </div>

       <!-- Filter Bar -->
       <div class="card-body border-bottom p-3 bg-light-subtle">
          <div class="row justify-content-end">
             <div class="col-md-5">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-secondary"><i class="fas fa-search"></i></span>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="form-control border-start-0 ps-0 bg-white" 
                        :placeholder="`Tìm kiếm trong ${getTabLabel(activeTab)}...`"
                    >
                </div>
             </div>
          </div>
       </div>

       <!-- Table -->
       <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
             <thead class="bg-light text-secondary">
                <tr>
                   <th class="ps-4 text-uppercase text-xs font-weight-bolder opacity-7" style="width: 50px;">STT</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7">Độc Giả</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7" style="min-width: 200px;">Sách Mượn</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7" style="width: 80px;">Số Lượng</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7">Trạng Thái</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7">Ngày Mượn</th>
                   <th class="text-uppercase text-xs font-weight-bolder opacity-7">Ngày Trả</th>
                   <th class="text-center text-uppercase text-xs font-weight-bolder opacity-7">Hành Động</th>
                </tr>
             </thead>
             <tbody v-if="!loading && filteredData.length > 0">
                <tr v-for="(item, index) in paginatedData" :key="item._id">
                   <td class="ps-4 text-secondary fw-bold">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                   <td>
                      <div class="d-flex flex-column">
                         <h6 class="mb-0 text-sm fw-bold text-dark">{{ (item.docGiaInfo?.HOLOT || '') + ' ' + (item.docGiaInfo?.TEN || '') }}</h6>
                         <small class="text-xs text-secondary">Mã: {{ item.docGiaInfo?.username || 'N/A' }}</small>
                      </div>
                   </td>
                   <td>
                      <!-- HIỂN THỊ ẢNH SÁCH VÀ TÊN SÁCH -->
                      <div class="d-flex align-items-center">
                        <img
                          :src="item.sachInfo?.HinhAnh || defaultBookImage"
                          class="book-thumb me-3 shadow-sm border"
                          alt="Book"
                          @error="onImgError"
                        />
                        <div>
                          <span class="text-dark fw-bold text-sm text-break d-block">{{ item.sachInfo?.TENSACH || 'N/A' }}</span>
                          <small class="text-muted" v-if="item.sachInfo?.TACGIA">{{ item.sachInfo?.TACGIA }}</small>
                        </div>
                      </div>
                   </td>
                   <td class="text-center fw-bold">{{ item.soLuong || 1 }}</td>
                   <td>
                      <span :class="['badge rounded-pill px-3 py-2 border', getStatusClass(item.trangThai)]">
                         {{ item.trangThai }}
                      </span>
                   </td>
                   <td class="text-sm text-secondary fw-medium">{{ formatDate(item.ngayMuon) }}</td>
                   <td class="text-sm text-secondary fw-medium">{{ formatDate(item.ngayTra) }}</td>
                   <td class="text-center">
                      <div class="d-flex justify-content-center gap-2">
                         <!-- Actions based on status -->
                         <template v-if="item.trangThai === 'chờ duyệt'">
                            <button class="btn btn-icon-only btn-rounded btn-success btn-sm text-white shadow-sm" title="Duyệt" @click="openUpdateModal(item, 'đã duyệt')"><i class="fas fa-check"></i></button>
                            <button class="btn btn-icon-only btn-rounded btn-danger btn-sm text-white shadow-sm" title="Từ chối" @click="openUpdateModal(item, 'từ chối')"><i class="fas fa-times"></i></button>
                         </template>

                         <template v-if="item.trangThai === 'đã duyệt'">
                            <button class="btn btn-icon-only btn-rounded btn-info btn-sm text-white shadow-sm" title="Giao sách" @click="openUpdateModal(item, 'đang mượn')"><i class="fas fa-hand-holding"></i></button>
                         </template>

                         <template v-if="item.trangThai === 'đang chờ trả'">
                             <button class="btn btn-icon-only btn-rounded btn-warning btn-sm text-dark shadow-sm" title="Nhận trả" @click="openUpdateModal(item, 'đã trả')"><i class="fas fa-undo"></i></button>
                         </template>

                         <template v-if="item.trangThai === 'trễ hạn' && item.daXacNhanNopPhat">
                             <button class="btn btn-icon-only btn-rounded btn-info btn-sm text-white shadow-sm" title="Xác nhận nộp phạt" @click="openFinePaymentModal(item)"><i class="fas fa-check-circle"></i></button>
                         </template>

                         <button class="btn btn-icon-only btn-rounded btn-light border btn-sm text-secondary" title="Chi tiết" @click="viewDetails(item)"><i class="fas fa-eye"></i></button>
                      </div>
                   </td>
                </tr>
             </tbody>
             <tbody v-else>
                <tr>
                   <td colspan="8" class="text-center py-5">
                      <div v-if="loading" class="spinner-border text-primary" role="status"></div>
                      <div v-else class="text-muted d-flex flex-column align-items-center">
                         <i class="fas fa-inbox fa-3x mb-3 opacity-25"></i>
                         <p class="fw-bold">Không tìm thấy yêu cầu nào.</p>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
       
       <!-- Pagination -->
       <div class="card-footer bg-white border-top-0 py-3" v-if="!loading && totalPages > 1">
           <nav>
               <ul class="pagination justify-content-center mb-0">
                   <li class="page-item" :class="{ disabled: currentPage === 1 }">
                       <a class="page-link border-0 rounded-circle mx-1" href="#" @click.prevent="changePage(currentPage - 1)"><i class="fas fa-chevron-left"></i></a>
                   </li>
                   <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                        <a class="page-link border-0 rounded-circle mx-1 shadow-sm" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                   </li>
                   <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                       <a class="page-link border-0 rounded-circle mx-1" href="#" @click.prevent="changePage(currentPage + 1)"><i class="fas fa-chevron-right"></i></a>
                   </li>
               </ul>
           </nav>
       </div>
    </div>

    <!-- Confirm Update Modal -->
    <div class="modal fade" id="confirmUpdateModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom-0" :class="isFinePayment ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'">
                    <h5 class="modal-title fw-bold" :class="isFinePayment ? 'text-warning' : 'text-primary'">{{ isFinePayment ? 'Xác nhận nộp phạt' : 'Xác nhận hành động' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body py-4 text-center" v-if="itemToUpdate">
                    <div class="avatar-circle mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" :class="isFinePayment ? 'bg-warning-subtle text-warning' : 'bg-primary-subtle text-primary'" style="width: 60px; height: 60px;">
                        <i :class="isFinePayment ? 'fas fa-money-bill-wave fa-2x' : 'fas fa-question fa-2x'"></i>
                    </div>
                    <template v-if="isFinePayment">
                        <p class="mb-1">Xác nhận độc giả</p>
                        <h5 class="fw-bold text-dark mb-2">{{ itemToUpdate.docGiaInfo?.HOLOT }} {{ itemToUpdate.docGiaInfo?.TEN }}</h5>
                        <p class="text-muted mb-2">đã nộp phạt trễ hạn với số tiền:</p>
                        <h4 class="fw-bold text-warning mb-2">{{ formatCurrency(itemToUpdate.tienPhat || 0) }}</h4>
                        <p class="text-muted">Phiếu sẽ được chuyển sang trạng thái "Đã trả"</p>
                    </template>
                    <template v-else>
                        <p class="mb-1">Bạn có chắc muốn chuyển trạng thái phiếu của</p>
                        <h5 class="fw-bold text-dark mb-2">{{ itemToUpdate.docGiaInfo?.HOLOT }} {{ itemToUpdate.docGiaInfo?.TEN }}</h5>
                        <p class="text-muted">Sang trạng thái: <span class="badge bg-primary px-3 py-2 rounded-pill">{{ newStatus }}</span></p>
                    </template>
                </div>
                <div class="modal-footer border-top-0 justify-content-center pb-4">
                    <button type="button" class="btn btn-light rounded-pill px-4 fw-bold me-2" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" :class="['btn rounded-pill px-4 fw-bold', isFinePayment ? 'btn-warning' : 'btn-primary']" @click="handleUpdateStatus">{{ isFinePayment ? 'Xác nhận nộp phạt' : 'Xác nhận' }}</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Rejection Reason Modal -->
    <div class="modal fade" id="rejectionReasonModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom-0 bg-danger bg-opacity-10">
                    <h5 class="modal-title fw-bold text-danger">Lý do từ chối</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body py-4" v-if="itemToUpdate">
                    <div class="text-center mb-4">
                        <div class="avatar-circle bg-danger-subtle text-danger mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
                            <i class="fas fa-times fa-2x"></i>
                        </div>
                        <p class="mb-1">Từ chối yêu cầu mượn sách của</p>
                        <h5 class="fw-bold text-dark mb-2">{{ itemToUpdate.docGiaInfo?.HOLOT }} {{ itemToUpdate.docGiaInfo?.TEN }}</h5>
                        <p class="text-muted">Sách: {{ itemToUpdate.sachInfo?.TENSACH }}</p>
                    </div>
                    <div class="mb-3">
                        <label for="rejectionReason" class="form-label fw-bold">Lý do từ chối <span class="text-danger">*</span></label>
                        <textarea
                            id="rejectionReason"
                            v-model="rejectionReason"
                            class="form-control"
                            rows="4"
                            placeholder="Nhập lý do từ chối yêu cầu mượn sách..."
                            required
                        ></textarea>
                        <div class="form-text">Lý do này sẽ được gửi cho độc giả để họ biết tại sao yêu cầu bị từ chối.</div>
                    </div>
                </div>
                <div class="modal-footer border-top-0 justify-content-center pb-4">
                    <button type="button" class="btn btn-light rounded-pill px-4 fw-bold me-2" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold" @click="handleRejectWithReason" :disabled="!rejectionReason.trim()">Từ chối</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Detail Modal (GIỮ NGUYÊN NHƯ BẠN YÊU CẦU) -->
    <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow rounded-4">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-primary">
              <i class="fas fa-info-circle me-2"></i>Chi tiết Phiếu Mượn
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4" v-if="selectedItem">
            <div class="row g-4">
              <div class="col-md-4 text-center border-end">
                <div class="position-relative d-inline-block mb-3">
                  <img 
                    :src="selectedItem.sachInfo?.HinhAnh || defaultBookImage" 
                    class="img-fluid rounded-3 shadow" 
                    style="max-height: 220px; object-fit: cover;"
                    alt="Book cover" 
                    @error="onImgError"
                  >
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" v-if="selectedItem.soLuong > 1">
                    x{{ selectedItem.soLuong }}
                  </span>
                </div>
                
                <h6 class="text-dark fw-bold mb-1">{{ selectedItem.sachInfo?.TENSACH }}</h6>
                <p class="text-muted small mb-1"><i class="fas fa-pen-nib me-1"></i>{{ selectedItem.sachInfo?.TACGIA }}</p>
                <span class="badge bg-light text-secondary border">NXB: {{ selectedItem.sachInfo?.tenNhaXuatBan || 'N/A' }}</span>
              </div>

              <div class="col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-3">
                   <span class="text-uppercase text-xs fw-bold text-muted ls-1">Trạng thái phiếu</span>
                   <span :class="['badge rounded-pill px-3 py-2', getStatusClass(selectedItem.trangThai)]">
                      {{ selectedItem.trangThai }}
                   </span>
                </div>

                <div class="bg-light-gray p-3 rounded-3 mb-3">
                   <div class="d-flex align-items-center mb-2">
                      <div class="avatar-circle bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                        <i class="fas fa-user"></i>
                      </div>
                      <div>
                        <h6 class="fw-bold mb-0 text-dark">{{ (selectedItem.docGiaInfo?.HOLOT || '') + ' ' + (selectedItem.docGiaInfo?.TEN || '') }}</h6>
                        <small class="text-muted">@{{ selectedItem.docGiaInfo?.username }}</small>
                      </div>
                   </div>
                   <div class="row g-2 text-sm">
                      <div class="col-6">
                        <span class="text-muted"><i class="fas fa-phone-alt me-1"></i> {{ selectedItem.docGiaInfo?.DIENTHOAI || 'N/A' }}</span>
                      </div>
                      <div class="col-12">
                        <span class="text-muted"><i class="fas fa-map-marker-alt me-1"></i> {{ selectedItem.docGiaInfo?.DIACHI || 'N/A' }}</span>
                      </div>
                   </div>
                </div>

                <h6 class="text-uppercase text-xs fw-bold text-muted ls-1 mb-2">Thời gian mượn trả</h6>
                <div class="row g-3 mb-3">
                   <div class="col-6">
                      <div class="border rounded p-2 text-center bg-white h-100">
                         <small class="d-block text-muted mb-1">Ngày Mượn</small>
                         <span class="fw-bold text-dark">{{ formatDate(selectedItem.ngayMuon) }}</span>
                      </div>
                   </div>
                   <div class="col-6">
                      <div class="border rounded p-2 text-center bg-white h-100">
                         <small class="d-block text-muted mb-1">Hạn Trả</small>
                         <span class="fw-bold text-primary">{{ formatDate(selectedItem.ngayTra) }}</span>
                      </div>
                   </div>
                   <div class="col-12" v-if="selectedItem.ngayTraThucTe">
                      <div class="border rounded p-2 d-flex justify-content-between align-items-center bg-success-subtle border-success-subtle">
                         <span class="text-success small fw-bold"><i class="fas fa-check-circle me-1"></i> Đã trả thực tế:</span>
                         <span class="fw-bold text-success">{{ formatDate(selectedItem.ngayTraThucTe) }}</span>
                      </div>
                   </div>
                   <div class="col-12" v-if="selectedItem.trangThai === 'từ chối' && selectedItem.lyDoTuChoi">
                      <div class="border rounded p-2 d-flex justify-content-between align-items-center bg-danger-subtle border-danger-subtle">
                         <span class="text-danger small fw-bold"><i class="fas fa-times-circle me-1"></i> Lý do từ chối:</span>
                         <span class="fw-bold text-danger">{{ selectedItem.lyDoTuChoi }}</span>
                      </div>
                   </div>
                   <div class="col-12" v-if="selectedItem.trangThai === 'trễ hạn'">
                      <div class="border rounded p-2 d-flex justify-content-between align-items-center bg-warning-subtle border-warning-subtle">
                         <span class="text-warning small fw-bold"><i class="fas fa-exclamation-triangle me-1"></i> Phạt trễ hạn:</span>
                         <span class="fw-bold text-warning">{{ formatCurrency(selectedItem.tienPhat || 0) }}</span>
                      </div>
                   </div>

                </div>

                <div v-if="selectedItem.trangThai !== 'chờ duyệt'" class="border-top pt-3 mt-auto">
                   <div class="d-flex align-items-center text-muted small">
                      <i class="fas fa-user-shield me-2 fs-5"></i>
                      <div v-if="selectedItem.nhanVienInfo">
                         <span>Xử lý bởi: <strong class="text-dark">{{ selectedItem.nhanVienInfo?.HoTenNV }}</strong></span>
                         <span class="mx-1">•</span>
                         <span>MSNV: {{ selectedItem.nhanVienInfo?.MSNV }}</span>
                      </div>
                      <div v-else class="fst-italic">
                         {{ selectedItem.trangThai === 'đang mượn' ? '(Chưa cập nhật nhân viên giao sách)' : '(Hệ thống xử lý)' }}
                      </div>
                   </div>
                </div>

              </div>
            </div>
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
// --- LOGIC GIỮ NGUYÊN NHƯ CŨ (CHỈ COPY LẠI) ---
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import NhanVienService from "@/services/nhanvien.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import AuthService from "@/services/auth.service";
import { Modal } from "bootstrap";

export default {
  name: "StaffDashboard",
  data() {
    return {
      allData: [],
      loading: false,
      searchQuery: "",
      activeTab: "chờ duyệt",
      currentUser: null,
      updateModalInstance: null,
      detailModalInstance: null,
      itemToUpdate: null,
      newStatus: "",
      selectedItem: null,
      defaultBookImage: "https://via.placeholder.com/300x400.png?text=No+Image",
      tabPages: {
        "chờ duyệt": 1, "đã duyệt": 1, "đang mượn": 1, "đã trả": 1,
        "từ chối": 1, "trễ hạn": 1, "đang chờ trả": 1,
      },
      itemsPerPage: 10,
      tabs: [
        { key: "chờ duyệt", label: "Chờ Duyệt" },
        { key: "đã duyệt", label: "Đã Duyệt" },
        { key: "đang mượn", label: "Đang Mượn" },
        { key: "đang chờ trả", label: "Chờ Trả" },
        { key: "đã trả", label: "Đã Trả" },
        { key: "từ chối", label: "Từ Chối" },
        { key: "trễ hạn", label: "Trễ Hạn" },
      ],
      toastMessage: "",
      isToastError: false,
      rejectionReason: "",
      rejectionModalInstance: null,
      isFinePayment: false,
    };
  },
  computed: {
    pendingCount() { return this.allData.filter(item => item.trangThai === 'chờ duyệt').length; },
    borrowedCount() { return this.allData.filter(item => item.trangThai === 'đang mượn').length; },
    returnCount() { return this.allData.filter(item => item.trangThai === 'đang chờ trả' || item.trangThai === 'đã trả').length; },
    currentPage: {
      get() { return this.tabPages[this.activeTab] || 1; },
      set(value) { this.tabPages[this.activeTab] = value; } 
    },
    filteredData() {
      let result = this.allData;
      if (this.activeTab !== 'all') {
        result = result.filter(item => item.trangThai === this.activeTab);
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter(item => {
          const docGiaUser = item.docGiaInfo?.username?.toLowerCase() || '';
          const docGiaHoTen = `${item.docGiaInfo?.HOLOT} ${item.docGiaInfo?.TEN}`.toLowerCase();
          const tenSach = item.sachInfo?.TENSACH?.toLowerCase() || '';
          return docGiaUser.includes(query) || docGiaHoTen.includes(query) || tenSach.includes(query);
        });
      }
      result.sort((a, b) => {
        if (a.trangThai === 'chờ duyệt' && b.trangThai !== 'chờ duyệt') return -1;
        return 0;
      });
      return result;
    },
    totalPages() { return Math.ceil(this.filteredData.length / this.itemsPerPage); },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [muonSachRes, docGiaRes, sachRes, nhanVienRes, nhaXuatBanRes] = await Promise.all([
          MuonSachService.getAll(), DocGiaService.getAll(), SachService.getAll(), NhanVienService.getAll(), NhaXuatBanService.getAll()
        ]);
        const docGiaMap = new Map(docGiaRes.data.map(item => [item._id, item]));
        const sachMap = new Map(sachRes.data.map(item => [item._id, item]));
        const nhanVienMap = new Map(nhanVienRes.data.map(item => [item._id, item]));
        const nhaXuatBanMap = new Map(nhaXuatBanRes.data.map(item => [item._id, item]));

        const today = new Date();
        this.allData = muonSachRes.data.map(item => {
          const sachInfo = sachMap.get(item.sachId);
          // Tìm nhà xuất bản dựa vào MANXB từ sachInfo
          let nhaXuatBanInfo = null;
          if (sachInfo?.MANXB) {
            // Tìm nhà xuất bản có MANXB matching
            nhaXuatBanInfo = nhaXuatBanRes.data.find(nxb => nxb.MANXB === sachInfo.MANXB);
          }
          return {
            ...item,
            docGiaInfo: docGiaMap.get(item.docGiaId),
            sachInfo: sachInfo ? { ...sachInfo, tenNhaXuatBan: nhaXuatBanInfo?.TENNXB || 'N/A' } : null,
            nhanVienInfo: item.nhanVienId ? nhanVienMap.get(item.nhanVienId) : null,
          };
        });
      } catch (error) { console.error(error); } finally { this.loading = false; }
    },
    switchTab(tabKey) { this.activeTab = tabKey; this.searchQuery = ""; },
    getTabCount(tabKey) { return this.allData.filter(item => item.trangThai === tabKey).length; },
    getTabLabel(tabKey) { const tab = this.tabs.find(t => t.key === tabKey); return tab ? tab.label : 'Tất cả'; },
    openUpdateModal(item, newStatus) {
      this.itemToUpdate = item;
      this.newStatus = newStatus;
      this.isFinePayment = false; // Reset flag for non-fine payment modals
      if (newStatus === 'từ chối') {
        this.rejectionReason = "";
        this.rejectionModalInstance.show();
      } else {
        this.updateModalInstance.show();
      }
    },
    async handleUpdateStatus() {
      if (!this.itemToUpdate || !this.currentUser) return;
      
      // Nếu đây là xác nhận nộp phạt riêng lẻ
      if (this.isFinePayment) {
        return this.handleFinePaymentConfirmation();
      }
      
      if (!this.newStatus) return;
      
      if (this.newStatus === 'đã trả' && this.itemToUpdate.trangThai === 'đang chờ trả') {
         return this.handleConfirmReturn();
      }
      
      this.loading = true;
      try {
        await MuonSachService.update(this.itemToUpdate._id, {
          trangThai: this.newStatus,
          nhanVienId: this.currentUser._id,
        });
        await this.fetchData();
        this.updateModalInstance.hide();
        this.showToast("Cập nhật thành công!");
      } catch (error) { 
         this.showToast("Lỗi: " + error.message, true);
      } finally { this.loading = false; }
    },

    async handleFinePaymentConfirmation() {
      if (!this.itemToUpdate || !this.currentUser) return;
      this.loading = true;
      try {
        // Xác nhận nộp phạt cho phiếu trễ hạn này
        // Chuyển trạng thái sang 'đã trả' và ghi nhận nộp phạt
        await MuonSachService.update(this.itemToUpdate._id, {
          trangThai: 'đã trả',
          nhanVienId: this.currentUser._id,
          daNopPhat: true, // Ghi nhận đã nộp phạt
        });
        await this.fetchData();
        this.updateModalInstance.hide();
        this.isFinePayment = false; // Reset flag
        this.showToast("Xác nhận nộp phạt thành công!");
      } catch (error) {
        console.error("Lỗi khi xác nhận nộp phạt:", error);
        this.showToast("Lỗi xác nhận nộp phạt: " + (error.response?.data?.message || error.message), true);
      } finally {
        this.loading = false;
      }
    },
    viewDetails(item) { this.selectedItem = item; this.detailModalInstance.show(); },
    
    async handleConfirmReturn() {
        if (!this.itemToUpdate || !this.currentUser) return;
        this.loading = true;
        try {
            await MuonSachService.confirmReturn(this.itemToUpdate._id, this.currentUser._id);
            await this.fetchData();
            this.updateModalInstance.hide();
            this.showToast("Xác nhận trả sách thành công!");
        } catch (error) {
            console.error("Lỗi khi xác nhận trả sách:", error);
            this.showToast("Lỗi xác nhận: " + (error.response?.data?.message || error.message), true);
        } finally {
            this.loading = false;
        }
    },

    async handleRejectWithReason() {
        if (!this.itemToUpdate || !this.rejectionReason.trim() || !this.currentUser) return;
        this.loading = true;
        try {
            await MuonSachService.update(this.itemToUpdate._id, {
                trangThai: 'từ chối',
                nhanVienId: this.currentUser._id,
                lyDoTuChoi: this.rejectionReason.trim()
            });
            await this.fetchData();
            this.rejectionModalInstance.hide();
            this.showToast("Từ chối yêu cầu thành công!");
        } catch (error) {
            console.error("Lỗi khi từ chối yêu cầu:", error);
            this.showToast("Lỗi từ chối: " + (error.response?.data?.message || error.message), true);
        } finally {
            this.loading = false;
        }
    },
    
    changePage(page) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; },
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('vi-VN');
      } catch (e) { return dateString; }
    },
    getStatusClass(status) {
       switch (status) {
        case 'chờ duyệt': return 'bg-warning-subtle text-warning-emphasis border-warning-subtle';
        case 'đã duyệt': return 'bg-primary-subtle text-primary border-primary-subtle';
        case 'đang mượn': return 'bg-info-subtle text-info border-info-subtle';
        case 'đã trả': return 'bg-success-subtle text-success border-success-subtle';
        case 'từ chối': return 'bg-secondary-subtle text-secondary border-secondary-subtle';
        case 'trễ hạn': return 'bg-danger-subtle text-danger border-danger-subtle';
        default: return 'bg-light text-dark border';
      }
    },
    onImgError(e) {
      e.target.src = this.defaultBookImage;
    },
    openFinePaymentModal(item) {
      this.itemToUpdate = item;
      this.newStatus = 'đã trả'; // Chuyển sang trạng thái đã trả sau khi xác nhận nộp phạt
      this.isFinePayment = true; // Flag để biết đây là modal xác nhận nộp phạt
      // Đóng modal chi tiết trước khi mở modal xác nhận
      this.detailModalInstance.hide();
      // Tạo modal mới không có backdrop cho chức năng xác nhận nộp phạt
      this.updateModalInstance = new Modal(document.getElementById("confirmUpdateModal"), {
        backdrop: false
      });
      this.updateModalInstance.show();
    },
    showToast(msg, isError = false) {
        this.toastMessage = msg;
        this.isToastError = isError;
        setTimeout(() => { this.toastMessage = "" }, 3000);
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
    this.fetchData();
    this.updateModalInstance = new Modal(document.getElementById("confirmUpdateModal"));
    this.detailModalInstance = new Modal(document.getElementById("detailModal"));
    this.rejectionModalInstance = new Modal(document.getElementById("rejectionReasonModal"));
  },
};
</script>

<style scoped>
.bg-light-gray {
    background-color: #f3f6f9;
}

/* Stats Cards */
.card-stat {
    transition: transform 0.3s ease;
}
.card-stat:hover {
    transform: translateY(-5px);
}
.ls-1 {
    letter-spacing: 1px;
}
.icon-shape {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Tabs */
.btn-tab {
    color: #6c757d;
    white-space: nowrap;
    transition: all 0.2s;
}
.btn-tab:hover {
    color: #0d6efd;
    background-color: #f8f9fa;
}
.btn-tab.active {
    color: #0d6efd;
    background-color: transparent;
}
.tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #0d6efd;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

/* Search Input */
.input-group-text {
    background-color: #fff;
}
.form-control:focus {
    border-color: #86b7fe;
    box-shadow: none;
}

/* Table */
.text-xs {
    font-size: 0.75rem !important;
}
.text-sm {
    font-size: 0.875rem !important;
}
.btn-icon-only {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Pagination */
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

.btn-white {
    background-color: #fff;
    color: #0d6efd;
    transition: all 0.2s;
}
.btn-white:hover {
    background-color: #f1faff;
}

/* Custom Scrollbar for Tabs */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #aaa; 
}

/* Book Thumb in Table */
.book-thumb {
    width: 40px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

/* Toast Overlay */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Styles from old modal to support "status-badge" class in legacy modal code */
.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
</style>