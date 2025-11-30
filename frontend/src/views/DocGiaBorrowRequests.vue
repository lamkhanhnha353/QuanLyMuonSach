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
                  <i class="fas fa-info-circle"></i> Xem chi tiết
                </button>
                <button v-if="canCancel(r)" class="btn btn-danger btn-sm fw-bold action-btn" @click="cancelRequest(r)">
                  <i class="fas fa-times"></i> Hủy yêu cầu
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import MuonSachService from '@/services/muonsach.service';
import SachService from '@/services/sach.service';
import AuthService from '@/services/auth.service';

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
      defaultCover: 'https://via.placeholder.com/120x170?text=No+Cover'
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
        const resp = await MuonSachService.getForDocGia(user._id);
        const records = resp.data || [];

        const today = new Date();
        const populated = await Promise.all(records.map(async (rec) => {
          const out = { ...rec };
          try {
            const r = await SachService.get(rec.sachId);
            out.TENSACH = r.data.TENSACH || 'Không xác định';
            out.TACGIA = r.data.TACGIA || '';
            
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
          
          // Logic quá hạn
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
    showDetail(r) {
      this.$router.push({ name: 'docgia.requests.detail', params: { id: r._id } });
    },
    async cancelRequest(r) {
      if (confirm('Hủy yêu cầu này?')) {
        try { await MuonSachService.delete(r._id); await this.fetch(); } 
        catch (e) { alert('Lỗi hủy.'); }
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
.request-card {
  border-radius: 12px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}
.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important;
}

/* BOOK COVER - FIXED SIZE */
.book-cover-container {
  width: 110px; /* Chiều rộng cố định */
  height: 160px; /* Chiều cao cố định tỉ lệ 2:3 */
  flex-shrink: 0; /* Không bị co lại */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background-color: #eee;
}
.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Đảm bảo ảnh phủ kín khung */
}

/* TEXT & BADGES */
.book-title {
  font-size: 1.1rem;
  line-height: 1.4;
}
.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}

/* SOFT COLORS */
.bg-warning-soft { background-color: #fffbeb; color: #d97706; }
.bg-success-soft { background-color: #ecfdf5; color: #059669; }
.bg-danger-soft { background-color: #fef2f2; color: #dc2626; }
.bg-info-soft { background-color: #eff6ff; color: #2563eb; }
.bg-primary-soft { background-color: #eef2ff; color: #4f46e5; }
.bg-secondary-soft { background-color: #f3f4f6; color: #4b5563; }

/* ACTION BUTTONS */
.action-section {
  min-width: 120px; /* Đảm bảo nút không bị bóp quá nhỏ */
}
.action-btn {
  white-space: nowrap;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .book-cover-container {
    width: 80px;
    height: 120px;
    margin-right: 1rem !important;
  }
  .book-title { font-size: 1rem; }
  .action-section {
    width: 100%;
    flex-direction: row !important;
    margin-left: 0 !important;
    margin-top: 1rem;
  }
  .d-flex.align-items-start {
    flex-wrap: wrap;
  }
}
</style>