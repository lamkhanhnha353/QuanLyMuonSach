<template>
  <div class="container py-5">
    <h2 class="mb-4">Chi tiết Phiếu Mượn</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <div v-if="!loading && request" class="row">
      <div class="col-md-4 text-center">
        <img :src="request.sachCover || defaultCover" class="img-fluid rounded mb-3" alt="cover" />
        <h6 class="mb-1">Thông tin sách</h6>
        <p class="small mb-0"><strong>Tên sách:</strong> {{ request.TENSACH }}</p>
        <p class="small mb-0"><strong>Tác giả:</strong> {{ request.TACGIA }}</p>
        <p class="small mb-0"><strong>NXB:</strong> {{ request.NXB || 'N/A' }}</p>
        <p class="small mb-0"><strong>Năm XB:</strong> {{ request.NAMXB || 'N/A' }}</p>
      </div>
      <div class="col-md-8">
        <h6>Thông tin phiếu mượn</h6>
        <dl class="row">
          <dt class="col-sm-4">Trạng thái:</dt>
          <dd class="col-sm-8"> <span :class="['badge', statusClass(request.displayTrangThai || request.trangThai)]">{{ statusLabel(request.displayTrangThai || request.trangThai) }}</span></dd>

          <dt class="col-sm-4">Ngày mượn (dự kiến):</dt>
          <dd class="col-sm-8">{{ formatDate(request.ngayMuon || request.NGAYMUON) }}</dd>

          <dt class="col-sm-4">Ngày trả (dự kiến):</dt>
          <dd class="col-sm-8">{{ formatDate(request.ngayTra || request.NGAYTRADK) }}</dd>

          <dt class="col-sm-4">Ngày trả (thực tế):</dt>
          <dd class="col-sm-8">{{ formatDate(request.ngayTraThucTe || request.NGAYTRUCTE) || 'Chưa trả' }}</dd>

          <dt class="col-sm-4">Nhân viên xử lý:</dt>
          <dd class="col-sm-8">{{ request.nhanVienName || 'Chưa có' }}</dd>
        </dl>
        <div class="mt-3">
          <button v-if="canCancel(request)" class="btn btn-danger" @click="cancelRequest(request)">Hủy yêu cầu</button>
          <button class="btn btn-secondary ms-2" @click="$router.back()">Quay lại</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !request" class="text-center py-5 text-muted">
      Không tìm thấy phiếu mượn.
    </div>
  </div>
</template>

<script>
import MuonSachService from '@/services/muonsach.service';
import SachService from '@/services/sach.service';
import AuthService from '@/services/auth.service';

export default {
  name: 'DocGiaBorrowRequestDetail',
  data() {
    return {
      loading: false,
      request: null,
      defaultCover: 'https://via.placeholder.com/120x160?text=No+Cover'
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const resp = await MuonSachService.get(id);
        const rec = resp.data;
        if (!rec) {
          this.request = null;
          return;
        }

        const out = { ...rec };
        try {
          const r = await SachService.get(rec.sachId);
          out.TENSACH = r.data.TENSACH || r.data.tensach || 'Không xác định';
          out.TACGIA = r.data.TACGIA || r.data.tacgia || '';
          const imgField = r.data.HinhAnh || r.data.HINHANH || r.data.hinhanh || null;
          if (imgField) {
            out.sachCover = String(imgField).startsWith('http') ? imgField : `http://localhost:8080/uploads/${imgField}`;
          } else {
            out.sachCover = null;
          }
          out.NXB = r.data.NXB || r.data.nxb || '';
          out.NAMXB = r.data.NAMXB || r.data.namXB || '';
        } catch (e) {
          out.TENSACH = out.TENSACH || 'Không xác định';
          out.TACGIA = out.TACGIA || '';
        }

        // compute overdue
        const today = new Date();
        const due = out.ngayTra || out.NGAYTRADK || out.ngayTraDuKien || null;
        const returned = out.ngayTraThucTe || out.NGAYTRUCTE || out.NGAYTRUCTE || null;
        if (!out.displayTrangThai) out.displayTrangThai = out.trangThai;
        if (!returned && due) {
          const dd = new Date(due);
          if (!isNaN(dd) && dd < today) {
            out.displayTrangThai = 'trễ hạn';
          }
        }

        this.request = out;
      } catch (error) {
        console.error('Lỗi lấy chi tiết phiếu mượn:', error);
        this.request = null;
      } finally {
        this.loading = false;
      }
    },
    formatDate(d) {
      if (!d) return '';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return dt.toLocaleDateString('vi-VN');
    },
    statusLabel(s) {
      if (!s) return 'Không xác định';
      const map = {
        'chờ duyệt': 'Chờ duyệt',
        'đã duyệt': 'Đã duyệt',
        'đang mượn': 'Đang mượn',
        'đã trả': 'Đã trả',
        'từ chối': 'Từ chối',
        'trễ hạn': 'Trễ hạn'
      };
      return map[(s||'').toLowerCase()] || s;
    },
    statusClass(s) {
      const st = (s||'').toLowerCase();
      if (st === 'chờ duyệt') return 'bg-warning text-dark';
      if (st === 'đã duyệt' || st === 'đang mượn') return 'bg-success text-white';
      if (st === 'đã trả') return 'bg-secondary text-white';
      if (st === 'từ chối' || st === 'trễ hạn') return 'bg-danger text-white';
      return 'bg-light text-dark';
    },
    canCancel(r) {
      const st = ((r.displayTrangThai || r.trangThai) || '').toLowerCase();
      return st === 'chờ duyệt';
    },
    async cancelRequest(r) {
      if (!confirm('Bạn có chắc muốn hủy yêu cầu này?')) return;
      try {
        await MuonSachService.delete(r._id);
        alert('Hủy yêu cầu thành công');
        this.$router.push({ name: 'docgia.requests' });
      } catch (error) {
        console.error('Lỗi hủy yêu cầu:', error);
        alert('Không thể hủy yêu cầu.');
      }
    }
  },
  mounted() {
    this.fetch();
  }
}
</script>

<style scoped>
.badge { font-weight: 600; padding: 0.45rem 0.7rem; border-radius: 999px; }
.badge-warning { background-color: #fff3cd; color: #856404; }
.badge-success { background-color: #d1fae5; color: #047857; }
.badge-secondary { background-color: #e2e8f0; color: #111827; }
.badge-danger { background-color: #fee2e2; color: #991b1b; }
.btn-danger { background: #ef4444; border-color: #ef4444; }
</style>
