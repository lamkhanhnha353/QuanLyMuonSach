<template>
  <div class="borrow-page bg-light min-vh-100">
    <div class="container py-4">
      
      <div class="row align-items-center mb-4">
        <div class="col-md-5">
          <h4 class="fw-bold text-dark m-0">
            <i class="fas fa-clipboard-list text-primary me-2"></i>Lịch sử mượn sách
          </h4>
          <p class="text-muted small m-0 mt-1">Theo dõi trạng thái các yêu cầu mượn của bạn.</p>
        </div>
        
        <div class="col-md-7 mt-3 mt-md-0">
          <div class="bg-white p-2 rounded-3 shadow-sm d-flex gap-2 border">
            <select v-model="filterStatus" class="form-select form-select-sm border-0 bg-light fw-500" style="width: 170px; flex-shrink: 0;">
              <option value="">-- Trạng thái --</option>
              <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light border-0"><i class="fas fa-search text-muted"></i></span>
              <input v-model="q" class="form-control form-control-sm bg-light border-0 shadow-none" placeholder="Tìm tên sách..." />
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-if="!loading && filteredRequests.length === 0" class="text-center py-5">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="Empty" width="80" class="opacity-50 mb-3">
        <p class="text-muted">Không tìm thấy phiếu mượn nào.</p>
      </div>

      <div v-else class="d-flex flex-column gap-3">
        <div v-for="r in filteredRequests" :key="r._id" class="card request-card border-0 shadow-sm">
          <div class="card-body p-3">
            <div class="d-flex align-items-start align-items-md-center">
              
              <div class="book-cover-container me-4">
                <img :src="r.sachCover || defaultCover" alt="Cover" class="book-cover-img" />
              </div>

              <div class="flex-grow-1 min-w-0">
                <div class="mb-2">
                  <span :class="['status-badge', getStatusBadgeClass(r.displayTrangThai || r.trangThai)]">
                    <i class="fas fa-circle small me-1" style="font-size: 6px; vertical-align: middle;"></i>
                    {{ statusLabel(r.displayTrangThai || r.trangThai) }}
                  </span>
                </div>

                <h5 class="book-title text-primary fw-bold mb-1 text-truncate">{{ r.TENSACH }}</h5>
                <p class="text-muted small mb-3"><i class="fas fa-pen-nib me-1"></i>{{ r.TACGIA }}</p>

                <div class="d-flex gap-4 small text-muted">
                  <div>
                    <span class="d-block text-uppercase fw-bold" style="font-size: 0.65rem; color: #9ca3af;">Ngày mượn</span>
                    <strong class="text-dark"><i class="far fa-calendar-alt me-1"></i>{{ formatDate(r.ngayMuon || r.NGAYMUON) }}</strong>
                  </div>
                  <div class="border-start ps-4">
                    <span class="d-block text-uppercase fw-bold" style="font-size: 0.65rem; color: #9ca3af;">Hạn trả</span>
                    <strong :class="(r.displayTrangThai === 'trễ hạn') ? 'text-danger' : 'text-dark'">
                      <i class="far fa-calendar-check me-1"></i>{{ formatDate(r.ngayTra || r.NGAYTRADK) }}
                    </strong>
                  </div>
                </div>
              </div>

              <div class="action-section ms-3 d-flex flex-column gap-2 justify-content-center">
                <button class="btn btn-light btn-sm fw-bold text-primary action-btn" @click="showDetail(r)">
                  <i class="fas fa-info-circle"></i> Chi tiết
                </button>
                <button v-if="canCancel(r)" class="btn btn-danger btn-sm fw-bold action-btn" @click="cancelRequest(r)">
                  <i class="fas fa-times"></i> Hủy
                </button>
                <button v-if="canReturn(r)" class="btn btn-success btn-sm fw-bold action-btn" @click="returnRequest(r)">
                  <i class="fas fa-undo"></i> Trả sách
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-if="detailVisible" class="modal-overlay" @click="closeDetail">
        <div class="modal-dialog-centered" @click.stop>
          <div class="modal-content border-0 shadow-lg rounded-3 overflow-hidden" style="max-width: 800px; width: 95%;">
            
            <div class="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style="background-color: #4f46e5; color: white;">
              <h5 class="modal-title fw-bold m-0 text-white">Chi tiết Phiếu Mượn</h5>
              <button type="button" class="btn-close btn-close-white" @click="closeDetail" style="font-size: 0.8rem; opacity: 0.8;"></button>
            </div>

            <div class="modal-body p-4 bg-white">
              <div v-if="selectedRequest" class="row gx-5">
                
                <div class="col-md-4 mb-4 mb-md-0">
                  <div class="user-avatar-container mb-3">
                    <img :src="userAvatar || selectedRequest.sachCover || defaultCover" class="img-fluid rounded-3 shadow-sm w-100 border" alt="Avatar" style="object-fit: cover; aspect-ratio: 3/4;" />
                  </div>
                  
                  <div class="book-summary p-3 rounded-3" style="background-color: #f8f9fa; border: 1px solid #e9ecef;">
                    <h6 class="text-uppercase fw-bold text-primary mb-2" style="font-size: 0.85rem;">Thông tin sách</h6>
                    <p class="mb-1 text-dark fw-medium small text-truncate">Tên: <span class="text-muted fw-normal">{{ selectedRequest.TENSACH }}</span></p>
                    <p class="mb-1 text-dark fw-medium small text-truncate">TG: <span class="text-muted fw-normal">{{ selectedRequest.TACGIA }}</span></p>
                    <p class="mb-0 text-dark fw-medium small">NXB: <span class="text-muted fw-normal">{{ selectedRequest.NXB || '---' }}</span></p>
                  </div>
                </div>

                <div class="col-md-8">
                  
                  <div class="mb-4">
                    <h6 class="section-title text-uppercase fw-bold mb-3 text-primary">Thông tin độc giả</h6>
                    <div class="info-grid ps-3 border-start border-2 border-light"> <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">Họ tên:</div>
                        <div class="col-8 text-dark small fw-bold">{{ userInfo.HOLOT }} {{ userInfo.TEN }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">Username:</div>
                        <div class="col-8 text-dark small">{{ userInfo.username }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">SĐT:</div>
                        <div class="col-8 text-dark small">{{ userInfo.DIENTHOAI }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h6 class="section-title text-uppercase fw-bold mb-3 text-primary">Thông tin phiếu mượn</h6>
                    <div class="info-grid ps-3 border-start border-2 border-light">
                      <div class="row mb-2 align-items-center">
                        <div class="col-4 text-muted fw-medium small">Trạng thái:</div>
                        <div class="col-8">
                          <span :class="['badge rounded-pill fw-normal px-3 py-1', getStatusBadgeClass(selectedRequest.displayTrangThai || selectedRequest.trangThai)]" style="font-size: 0.75rem;">
                            {{ statusLabel(selectedRequest.displayTrangThai || selectedRequest.trangThai) }}
                          </span>
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">Ngày mượn:</div>
                        <div class="col-8 text-dark small">{{ formatDate(selectedRequest.ngayMuon || selectedRequest.NGAYMUON) }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">Hạn trả:</div>
                        <div class="col-8 text-dark small">{{ formatDate(selectedRequest.ngayTra || selectedRequest.NGAYTRADK) }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-4 text-muted fw-medium small">Trả thực tế:</div>
                        <div class="col-8 text-dark small fw-bold">{{ formatDate(selectedRequest.ngayTraThucTe || selectedRequest.NGAYTRUCTE) || 'Chưa trả' }}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 class="section-title text-uppercase fw-bold mb-3 text-primary">Nhân viên xử lý</h6>
                    <div class="ps-3 border-start border-2 border-light">
                       <p class="text-muted small fst-italic mb-0 bg-light p-2 rounded d-inline-block border">
                         <i class="fas fa-user-shield me-1"></i> {{ selectedRequest.nhanVienName || 'Chưa có nhân viên xử lý' }}
                       </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="modal-footer px-4 py-3 border-top d-flex justify-content-end gap-2" style="background-color: #f8f9fa;">
              <button v-if="canCancel(selectedRequest)" class="btn btn-danger btn-sm px-4 fw-bold" @click="cancelRequest(selectedRequest)">Hủy yêu cầu</button>
              <button v-if="canReturn(selectedRequest)" class="btn btn-success btn-sm px-4 fw-bold" @click="returnRequest(selectedRequest)">Trả sách</button>
              <button class="btn btn-white border btn-sm px-4 fw-bold text-secondary" @click="closeDetail">Đóng</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// (Giữ nguyên phần script như cũ vì không thay đổi logic)
import MuonSachService from '@/services/muonsach.service';
import SachService from '@/services/sach.service';
import AuthService from '@/services/auth.service';
import DocGiaService from '@/services/docgia.service';
import NhaXuatBanService from '@/services/nhaxuatban.service';
import NhanVienService from '@/services/nhanvien.service';

export default {
  name: 'DocGiaBorrowRequests',
  data() {
    return {
      loading: false,
      requests: [],
      q: '',
      filterStatus: '',
      statuses: [
        { value: 'chờ duyệt', label: 'Chờ duyệt' },
        { value: 'đã duyệt', label: 'Đã duyệt' },
        { value: 'đang mượn', label: 'Đang mượn' },
        { value: 'đã trả', label: 'Đã trả' },
        { value: 'từ chối', label: 'Từ chối' },
        { value: 'trễ hạn', label: 'Trễ hạn' }
      ],
      defaultCover: 'https://via.placeholder.com/120x170?text=No+Cover',
      detailVisible: false,
      selectedRequest: null,
      userInfo: {},
      userAvatar: null
    }
  },
  computed: {
    filteredRequests() {
      let list = this.requests || [];
      if (this.filterStatus) {
        list = list.filter(r => ((r.displayTrangThai || r.trangThai) || '').toLowerCase() === this.filterStatus.toLowerCase());
      }
      if (this.q) {
        const q = this.q.toLowerCase();
        list = list.filter(r => (r.TENSACH || '').toLowerCase().includes(q));
      }
      return list;
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user._id) return;
        
        const userResp = await DocGiaService.get(user._id);
        this.userInfo = userResp.data;
        this.userAvatar = this.userInfo.AVATAR;

        const resp = await MuonSachService.getForDocGia(user._id);
        const records = resp.data || [];

        const today = new Date();
        const populated = await Promise.all(records.map(async (rec) => {
          const out = { ...rec };
          try {
            const r = await SachService.get(rec.sachId);
            out.TENSACH = r.data.TENSACH || 'Không xác định';
            out.TACGIA = r.data.TACGIA || '';
            out.NAMXB = r.data.NAMXB || '';

            const imgField = r.data.HinhAnh;
            if (imgField) {
              out.sachCover = String(imgField).startsWith('http') ? imgField : `http://localhost:8080/uploads/${imgField}`;
            } else {
              out.sachCover = null;
            }
          } catch (e) {
            out.TENSACH = 'Không xác định';
          }

          const due = out.ngayTra || out.NGAYTRADK;
          const returned = out.ngayTraThucTe;

          if (!out.displayTrangThai) out.displayTrangThai = out.trangThai;

          if (!returned && due) {
            const dd = new Date(due);
            if (!isNaN(dd) && dd < today && out.displayTrangThai !== 'đã trả' && out.displayTrangThai !== 'từ chối') {
              out.displayTrangThai = 'trễ hạn';
            }
          }
          return out;
        }));

        this.requests = populated.sort((a, b) => new Date(b.ngayMuon || b.NGAYMUON) - new Date(a.ngayMuon || a.NGAYMUON));
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(d) {
      if (!d) return '--/--/----';
      return new Date(d).toLocaleDateString('vi-VN');
    },
    statusLabel(s) {
      const map = { 'chờ duyệt': 'Chờ duyệt', 'đã duyệt': 'Đã duyệt', 'đang mượn': 'Đang mượn', 'đã trả': 'Đã trả', 'từ chối': 'Bị từ chối', 'trễ hạn': 'Quá hạn' };
      return map[(s||'').toLowerCase()] || s;
    },
    getStatusBadgeClass(s) {
      const st = (s||'').toLowerCase();
      if (st === 'chờ duyệt') return 'bg-warning-soft text-warning';
      if (st === 'đã duyệt') return 'bg-info-soft text-info';
      if (st === 'đang mượn') return 'bg-primary-soft text-primary';
      if (st === 'đã trả') return 'bg-success-soft text-success';
      if (st === 'từ chối') return 'bg-danger-soft text-danger';
      if (st === 'trễ hạn') return 'bg-danger-soft text-danger border-danger';
      return 'bg-secondary-soft text-secondary';
    },
    canCancel(r) {
      return ((r.displayTrangThai || r.trangThai) || '').toLowerCase() === 'chờ duyệt';
    },
    canReturn(r) {
      return ((r.displayTrangThai || r.trangThai) || '').toLowerCase() === 'đang mượn';
    },
    showDetail(r) {
      this.selectedRequest = r;
      this.detailVisible = true;
    },
    closeDetail() {
      this.detailVisible = false;
      this.selectedRequest = null;
    },
    async cancelRequest(r) {
      if (confirm('Hủy yêu cầu này?')) {
        try { await MuonSachService.delete(r._id); await this.fetch(); this.closeDetail(); }
        catch (e) { alert('Lỗi hủy.'); }
      }
    },
    async returnRequest(r) {
      if (confirm('Bạn có chắc chắn muốn trả sách này?')) {
        try {
          await MuonSachService.returnBook(r._id);
          alert('Trả sách thành công!');
          await this.fetch();
          this.closeDetail();
        } catch (e) {
          alert('Lỗi trả sách: ' + (e.response?.data?.message || e.message));
        }
      }
    }
  },
  mounted() {
    this.fetch();
  }
}
</script>

<style scoped>
/* BACKGROUND */
.bg-light { background-color: #f9fafb !important; }

/* CARD STYLING */
.request-card { border-radius: 12px; background: white; transition: transform 0.2s, box-shadow 0.2s; } .request-card:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important; }

/* BOOK COVER */
.book-cover-container {
  width: 110px; height: 160px; flex-shrink: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background-color: #eee;
}
.book-cover-img { width: 100%; height: 100%; object-fit: cover; }

/* TEXT & BADGES */
.book-title { font-size: 1.1rem; line-height: 1.4; }
.status-badge { padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; display: inline-block; }

/* SOFT COLORS */
.bg-warning-soft { background-color: #fffbeb; color: #d97706; }
.bg-success-soft { background-color: #ecfdf5; color: #059669; }
.bg-danger-soft { background-color: #fef2f2; color: #dc2626; }
.bg-info-soft { background-color: #eff6ff; color: #2563eb; }
.bg-primary-soft { background-color: #eef2ff; color: #4f46e5; }
.bg-secondary-soft { background-color: #f3f4f6; color: #4b5563; }

/* ACTION BUTTONS */
.action-section { min-width: 120px; }
.action-btn { white-space: nowrap; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .book-cover-container { width: 80px; height: 120px; margin-right: 1rem !important; }
  .book-title { font-size: 1rem; }
  .action-section { width: 100%; flex-direction: row !important; margin-left: 0 !important; margin-top: 1rem; }
  .d-flex.align-items-start { flex-wrap: wrap; }
}

/* --- MODAL STYLES (UPDATED) --- */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1050; backdrop-filter: blur(2px);
}
.modal-dialog-centered {
  display: flex; align-items: center; justify-content: center; min-height: calc(100% - 1rem); width: 100%;
}
/* CSS cho nút đóng màu trắng */
.btn-close-white { filter: invert(1) grayscale(100%) brightness(200%); }
.btn-close-white:hover { opacity: 1; }

.section-title { font-size: 0.85rem; letter-spacing: 0.05em; }
.text-primary { color: #4f46e5 !important; } /* Ghi đè màu primary thành tím */
</style>