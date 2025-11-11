<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-md-4">
        <div class="card bg-dark border-primary">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-book text-primary me-2"></i>Tổng Số Sách
            </h5>
            <h2 class="text-primary">{{ totalSach }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-dark border-success">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-receipt text-success me-2"></i>Phiếu Mượn
            </h5>
            <h2 class="text-success">{{ totalMuonSach }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-dark border-warning">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-users text-warning me-2"></i>Độc Giả Hoạt Động
            </h5>
            <h2 class="text-warning">{{ totalDocGia }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card bg-dark">
          <div class="card-header border-bottom">
            <h5 class="mb-0">Phiếu Mượn Gần Đây</h5>
          </div>
          <div class="card-body">
            <table class="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Mã Phiếu</th>
                  <th>Độc Giả</th>
                  <th>Sách</th>
                  <th>Ngày Mượn</th>
                  <th>Ngày Trả</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentMuonSach.length === 0">
                  <td colspan="6" class="text-center">Không có dữ liệu</td>
                </tr>
                <tr v-for="item in recentMuonSach.slice(0, 5)" :key="item.MaPhieu">
                  <td>{{ item.MaPhieu }}</td>
                  <td>{{ item.HoTenDG }}</td>
                  <td>{{ item.TenSach }}</td>
                  <td>{{ formatDate(item.NgayMuon) }}</td>
                  <td>{{ formatDate(item.NgayTra) }}</td>
                  <td>
                    <span 
                      class="badge"
                      :class="{
                        'bg-warning': item.TrangThai === 'Đang mượn',
                        'bg-success': item.TrangThai === 'Đã trả',
                        'bg-danger': item.TrangThai === 'Quá hạn'
                      }"
                    >
                      {{ item.TrangThai }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";

export default {
  name: "StaffDashboard",
  data() {
    return {
      totalSach: 0,
      totalMuonSach: 0,
      totalDocGia: 0,
      recentMuonSach: [],
    };
  },
  mounted() {
    this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      try {
        const sachData = await SachService.getAll();
        this.totalSach = sachData.data ? sachData.data.length : 0;

        const muonSachData = await MuonSachService.getAll();
        this.totalMuonSach = muonSachData.data ? muonSachData.data.length : 0;
        this.recentMuonSach = muonSachData.data || [];

        const docGiaData = await DocGiaService.getAll();
        this.totalDocGia = docGiaData.data ? docGiaData.data.length : 0;
      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard:", error);
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
.dashboard {
  color: white;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 15px;
}

h2 {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.table {
  margin-bottom: 0;
}

.table th {
  color: #aaa;
  border-color: #444;
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
</style>
