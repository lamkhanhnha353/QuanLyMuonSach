<template>
  <div class="staff-overview">
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm border-0 welcome-card">
          <div class="card-body p-4">
            <h3 class="fw-bold">Chào mừng, {{ currentUser?.HoTenNV || 'Nhân viên' }}!</h3>
            <p class="text-muted mb-0">Chúc bạn một ngày làm việc hiệu quả.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm border-0 text-center">
          <div class="card-body p-4">
            <i class="fas fa-book fa-3x text-primary mb-3"></i>
            <h2 class="fw-bold mb-1">1,200</h2>
            <p class="text-muted mb-0">Tổng số Sách</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm border-0 text-center">
          <div class="card-body p-4">
            <i class="fas fa-users fa-3x text-success mb-3"></i>
            <h2 class="fw-bold mb-1">350</h2>
            <p class="text-muted mb-0">Tổng số Độc giả</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm border-0 text-center">
          <div class="card-body p-4">
            <i class="fas fa-receipt fa-3x text-warning mb-3"></i>
            <h2 class="fw-bold mb-1">150</h2>
            <p class="text-muted mb-0">Sách đang được mượn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-7 mb-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-0 pt-3">
            <h5 class="fw-bold mb-0">Hoạt động Gần đây</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li v-for="item in recentActivities" :key="item.id" class="list-group-item d-flex align-items-center px-0">
                <div class="activity-icon me-3" :class="item.type === 'muon' ? 'bg-light-primary text-primary' : 'bg-light-success text-success'">
                  <i :class="item.type === 'muon' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                </div>
                <div class="flex-grow-1">
                  <span class="fw-500">{{ item.user }}</span> {{ item.action }} <span class="fw-500">{{ item.book }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-5 mb-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-0 pt-3">
            <h5 class="fw-bold mb-0">Sách Cần Chú Ý (Quá hạn)</h5>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li v-for="book in overdueBooks" :key="book.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span class="d-block fw-500">{{ book.title }}</span>
                  <small class="text-muted">{{ book.user }}</small>
                </div>
                <span class="badge" :class="book.isOverdue ? 'bg-danger' : 'bg-warning text-dark'">
                  {{ book.status }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "StaffOverview",
  data() {
    return {
      currentUser: null,
      // Dữ liệu giả - ĐÃ XÓA `time`
      recentActivities: [
        { id: 1, user: 'Nguyễn Văn A', action: 'vừa mượn sách', book: 'Đắc Nhân Tâm', type: 'muon' },
        { id: 2, user: 'Trần Thị B', action: 'vừa trả sách', book: 'Nhà Giả Kim', type: 'tra' },
        { id: 3, user: 'Lê Văn C', action: 'vừa mượn sách', book: 'Dune - Xứ Cát', type: 'muon' },
        { id: 4, user: 'Phạm Thị D', action: 'vừa trả sách', book: 'Bố Già', type: 'tra' },
      ],
      // Dữ liệu giả - Giữ nguyên
      overdueBooks: [
        { id: 1, title: 'Lược Sử Loài Người', user: 'Phạm Văn D', status: 'Quá 3 ngày', isOverdue: true },
        { id: 2, title: 'Cây Cam Ngọt Của Tôi', user: 'Võ Thị E', status: 'Quá 1 ngày', isOverdue: true },
        { id: 3, title: 'Bố Già', user: 'Hoàng Văn F', status: 'Hạn chót hôm nay', isOverdue: false },
        { id: 4, title: 'Rừng Na Uy', user: 'Đặng Thị G', status: 'Còn 1 ngày', isOverdue: false },
      ]
    };
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
  },
  methods: {
    // Không cần hàm gì đặc biệt
  },
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
.welcome-card {
  background: linear-gradient(to right, #f4f7fc, #eef7ff);
}
.fa-3x {
    font-size: 3em;
}
.text-primary { color: #303f9f !important; }
.text-success { color: #198754 !important; }
.text-warning { color: #ffc107 !important; }
.fw-500 {
  font-weight: 500;
}

/* Style cho Hoạt động gần đây */
.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.bg-light-primary {
  background-color: #eef7ff;
}
.bg-light-success {
  background-color: #e6f7f1;
}
.list-group-item {
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #eee;
}
.list-group-item:last-child {
  border-bottom: 0;
}

/* Style cho Sách quá hạn */
.list-group-flush:last-child .list-group-item:last-child {
  border-bottom: 0;
  border-radius: 0 0 12px 12px;
}
.list-group-item {
  padding: 1rem;
}
.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.7em;
}
</style>