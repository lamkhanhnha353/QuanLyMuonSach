<template>
  <div class="dashboard-admin">
    <!-- Header Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="welcome-header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="fw-bold text-white mb-1">Quản Trị Viên Admin</h2>
              <p class="text-white-50 mb-0">Tổng quan hệ thống thư viện</p>
            </div>
            <div class="text-white text-end">
              <div class="h5 mb-0">{{ currentTime }}</div>
              <small class="text-white-75">Hệ thống hoạt động</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row mb-4" v-if="layoutPreferences.showQuickActions">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0 text-primary">
              <i class="fas fa-bolt me-2"></i>Hoạt động Nhanh
            </h5>
            <button v-if="isAdmin" class="btn btn-outline-primary btn-sm" @click="openCustomizeModal">
              <i class="fas fa-cog me-1"></i>Tuỳ chỉnh
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <router-link to="/admin/nhanvien/add" class="action-card text-decoration-none">
                  <div class="action-icon bg-primary text-white">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Thêm Nhân Viên</h6>
                    <small class="text-muted">Đăng ký nhân viên mới</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <router-link to="/admin/sach/add" class="action-card text-decoration-none">
                  <div class="action-icon bg-success text-white">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Thêm Sách</h6>
                    <small class="text-muted">Thêm sách mới vào kho</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <router-link to="/admin/nhanvien" class="action-card text-decoration-none">
                  <div class="action-icon bg-info text-white">
                    <i class="fas fa-users-cog"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Quản Lý Nhân Viên</h6>
                    <small class="text-muted">Xem và chỉnh sửa nhân viên</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <div class="action-card text-decoration-none" @click="showDevelopmentAlert" style="cursor: pointer;">
                  <div class="action-icon bg-warning text-white">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Báo Cáo</h6>
                    <small class="text-muted">Xem báo cáo thống kê</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4" v-if="layoutPreferences.showStatistics">
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalReaders }}</h3>
            <p class="stat-label">Độc Giả</p>
            <small class="stat-change text-success">
              <i class="fas fa-arrow-up me-1"></i>+{{ stats.newReadersThisMonth }} độc giả mới
            </small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalBooks }}</h3>
            <p class="stat-label">Đầu Sách</p>
            <small class="stat-change text-success">
              <i class="fas fa-arrow-up me-1"></i>+{{ stats.newBooksThisMonth }} sách mới
            </small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-receipt"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.activeBorrows }}</h3>
            <p class="stat-label">Đang Mượn</p>
            <small class="stat-change text-info">
              <i class="fas fa-clock me-1"></i>{{ stats.availableBooks }} cuốn còn lại
            </small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-danger">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.overdueBooks }}</h3>
            <p class="stat-label">Quá Hạn</p>
            <small class="stat-change text-danger">
              <i class="fas fa-arrow-up me-1"></i>Cần xử lý ngay
            </small>
          </div>
        </div>
      </div>
    </div>




    <!-- Customize Layout Modal -->
    <div v-if="showCustomizeModal" class="modal-overlay" @click="closeCustomizeModal">
      <div class="modal-content-custom" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Tuỳ Chỉnh Dashboard Admin</h5>
          <button type="button" class="btn-close" @click="closeCustomizeModal"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-3">Chọn các phần bạn muốn hiển thị trên dashboard:</p>
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" v-model="layoutPreferences.showQuickActions" id="showQuickActions">
            <label class="form-check-label" for="showQuickActions">
              Hoạt động Nhanh
            </label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" v-model="layoutPreferences.showStatistics" id="showStatistics">
            <label class="form-check-label" for="showStatistics">
              Thống kê Tổng Quan
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeCustomizeModal">Hủy</button>
          <button type="button" class="btn btn-primary" @click="applyLayoutChanges">Áp dụng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "Dashboard",
  data() {
    return {
      currentUser: null,
      currentTime: '',
      showCustomizeModal: false,
      layoutPreferences: {
        showQuickActions: true,
        showStatistics: true,
        showSystemOverview: true,
        showRecentActivities: true,
        showCharts: true
      },
      stats: {
        totalReaders: 120,
        newReadersThisMonth: 8,
        totalBooks: 450,
        newBooksThisMonth: 15,
        activeBorrows: 85,
        availableBooks: 365,
        overdueBooks: 12
      },
      todaysMetrics: {
        visits: 245,
        borrows: 23,
        returns: 18
      },
      recentActivities: [
        { id: 1, user: 'Admin', action: 'đã thêm nhân viên', target: 'Nguyễn Văn A', type: 'admin', time: '10:30', details: 'Nhân viên mới' },
        { id: 2, user: 'Lê Thị B', action: 'đã mượn sách', target: 'Đắc Nhân Tâm', type: 'borrow', time: '09:15', details: 'Mượn 1 cuốn' },
        { id: 3, user: 'Admin', action: 'đã thêm sách', target: 'Dune - Xứ Cát', type: 'admin', time: '14:20', details: 'Sách mới' },
        { id: 4, user: 'Trần Văn C', action: 'đã trả sách', target: 'Nhà Giả Kim', type: 'return', time: '11:45', details: 'Trả đúng hạn' },
        { id: 5, user: 'Admin', action: 'đã cập nhật', target: 'Cơ sở dữ liệu', type: 'admin', time: '16:00', details: 'Backup thành công' }
      ]
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser && this.currentUser.ChucVu === 'Admin';
    }
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser();
    this.loadLayoutPreferences();
    this.updateTime();
    setInterval(this.updateTime, 1000); // Update time every second
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    loadLayoutPreferences() {
      const userId = this.currentUser?._id || 'default';
      const saved = localStorage.getItem(`adminLayoutPreferences_${userId}`);
      if (saved) {
        this.layoutPreferences = { ...this.layoutPreferences, ...JSON.parse(saved) };
      }
    },
    saveLayoutPreferences() {
      const userId = this.currentUser?._id || 'default';
      localStorage.setItem(`adminLayoutPreferences_${userId}`, JSON.stringify(this.layoutPreferences));
    },
    openCustomizeModal() {
      this.showCustomizeModal = true;
    },
    closeCustomizeModal() {
      this.showCustomizeModal = false;
    },
    applyLayoutChanges() {
      this.saveLayoutPreferences();
      this.closeCustomizeModal();
    },
    getActivityIcon(type) {
      switch (type) {
        case 'borrow':
          return 'fas fa-plus-circle';
        case 'return':
          return 'fas fa-undo';
        case 'admin':
          return 'fas fa-cog';
        default:
          return 'fas fa-info-circle';
      }
    },
    showDevelopmentAlert() {
      alert('Tính năng đang trong giai đoạn phát triển');
    }
  },
};
</script>

<style scoped>
.dashboard-admin {
  padding: 20px;
}

.welcome-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid #e9ecef;
}

.stat-card-primary {
  border-left: 4px solid #007bff;
}

.stat-card-success {
  border-left: 4px solid #28a745;
}

.stat-card-warning {
  border-left: 4px solid #ffc107;
}

.stat-card-danger {
  border-left: 4px solid #dc3545;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 15px;
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: white;
}

.stat-card-danger .stat-icon {
  background: linear-gradient(135deg, #dc3545, #bd2130);
  color: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 0.8rem;
}

.action-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
}

.action-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.1);
  text-decoration: none !important;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 12px;
}

.action-content h6 {
  margin-bottom: 2px;
  color: #333;
}

.activity-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
}

.activity-item {
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.fw-500 {
  font-weight: 500;
}

.chart-placeholder {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.system-status .badge {
  font-size: 0.75rem;
}

.metric-item {
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.metric-item:last-child {
  border-bottom: none;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content-custom {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-outline-primary {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline-primary:hover {
  background: #007bff;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-admin {
    padding: 10px;
  }

  .welcome-header {
    padding: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .action-card {
    padding: 12px;
  }
}
</style>
