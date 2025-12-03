<template>
  <div class="staff-overview">
    <!-- Header Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="welcome-header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="fw-bold text-white mb-1">Chào mừng, {{ currentUser?.HoTenNV || 'Nhân viên' }}!</h2>
              <p class="text-white-50 mb-0">Hôm nay là {{ currentDate }}</p>
            </div>
            <div class="d-flex align-items-center">
              <div class="text-white text-end me-3">
                <div class="h5 mb-0">{{ currentTime }}</div>
                <small class="text-white-75">Thời gian làm việc</small>
              </div>
              <button v-if="isAdmin" @click="openCustomizeModal" class="btn btn-outline-light btn-sm">
                <i class="fas fa-cog me-1"></i>Tuỳ chỉnh Layout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="layoutPreferences.showQuickActions" class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="fw-bold mb-0 text-primary">
              <i class="fas fa-bolt me-2"></i>Hoạt động Nhanh
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <router-link to="/staff/muonsach" class="action-card text-decoration-none">
                  <div class="action-icon bg-primary text-white">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Mượn sách</h6>
                    <small class="text-muted">Tạo phiếu mượn mới</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <router-link to="/staff/muonsach" class="action-card text-decoration-none">
                  <div class="action-icon bg-success text-white">
                    <i class="fas fa-undo"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Trả sách</h6>
                    <small class="text-muted">Xử lý trả sách</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <router-link to="/staff/nguoidung/add" class="action-card text-decoration-none">
                  <div class="action-icon bg-info text-white">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Thêm độc giả</h6>
                    <small class="text-muted">Đăng ký độc giả mới</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3">
                <router-link to="/staff/sach" class="action-card text-decoration-none">
                  <div class="action-icon bg-warning text-white">
                    <i class="fas fa-search"></i>
                  </div>
                  <div class="action-content">
                    <h6 class="mb-1">Tra cứu sách</h6>
                    <small class="text-muted">Tìm kiếm và kiểm tra</small>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div v-if="layoutPreferences.showStatistics" class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalBooks }}</h3>
            <p class="stat-label">Tổng số sách</p>
            <small class="stat-change text-success">
              <i class="fas fa-arrow-up me-1"></i>+12 sách mới
            </small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalReaders }}</h3>
            <p class="stat-label">Độc giả đăng ký</p>
            <small class="stat-change text-success">
              <i class="fas fa-arrow-up me-1"></i>+5 độc giả mới
            </small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.booksBorrowed }}</h3>
            <p class="stat-label">Đang được mượn</p>
            <small class="stat-change text-warning">
              <i class="fas fa-minus me-1"></i>Còn {{ stats.availableBooks }} cuốn
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
            <p class="stat-label">Sách quá hạn</p>
            <small class="stat-change text-danger">
              <i class="fas fa-arrow-up me-1"></i>Cần xử lý ngay
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row">
      <!-- Today's Tasks -->
      <div v-if="layoutPreferences.showTodaysTasks" class="col-lg-6 mb-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0 text-primary">
              <i class="fas fa-tasks me-2"></i>Công việc Hôm nay
            </h5>
            <span class="badge bg-primary">{{ todaysTasks.length }}</span>
          </div>
          <div class="card-body">
            <div v-if="todaysTasks.length === 0" class="text-center py-4">
              <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h6 class="text-muted">Tất cả công việc đã hoàn thành!</h6>
            </div>
            <div v-else class="task-list">
              <div v-for="task in todaysTasks" :key="task.id" class="task-item d-flex align-items-center mb-3">
                <div class="task-checkbox me-3">
                  <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)" class="form-check-input">
                </div>
                <div class="task-content flex-grow-1">
                  <h6 class="mb-1" :class="{ 'text-decoration-line-through text-muted': task.completed }">
                    {{ task.title }}
                  </h6>
                  <small class="text-muted">{{ task.description }}</small>
                </div>
                <div class="task-priority">
                  <span class="badge" :class="getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Books Due Today & Overdue -->
      <div v-if="layoutPreferences.showBooksDue" class="col-lg-6 mb-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="fw-bold mb-0 text-danger">
              <i class="fas fa-calendar-times me-2"></i>Sách Đến Hạn
            </h5>
          </div>
          <div class="card-body">
            <!-- Due Today -->
            <div class="mb-4">
              <h6 class="text-warning mb-3">
                <i class="fas fa-clock me-2"></i>Hôm nay ({{ dueToday.length }} cuốn)
              </h6>
              <div v-if="dueToday.length === 0" class="text-muted small mb-3">
                Không có sách đến hạn hôm nay
              </div>
              <div v-else class="due-books-list">
                <div v-for="book in dueToday.slice(0, 3)" :key="book.id" class="due-book-item d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1">
                    <span class="fw-500 d-block">{{ book.title }}</span>
                    <small class="text-muted">{{ book.reader }}</small>
                  </div>
                  <span class="badge bg-warning text-dark">Hôm nay</span>
                </div>
              </div>
            </div>

            <!-- Overdue -->
            <div>
              <h6 class="text-danger mb-3">
                <i class="fas fa-exclamation-triangle me-2"></i>Quá hạn ({{ overdueBooks.length }} cuốn)
              </h6>
              <div v-if="overdueBooks.length === 0" class="text-muted small">
                Không có sách quá hạn
              </div>
              <div v-else class="overdue-books-list">
                <div v-for="book in overdueBooks.slice(0, 3)" :key="book.id" class="overdue-book-item d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1">
                    <span class="fw-500 d-block">{{ book.title }}</span>
                    <small class="text-muted">{{ book.reader }}</small>
                  </div>
                  <span class="badge bg-danger">{{ book.daysOverdue }} ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div v-if="layoutPreferences.showRecentActivities" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="fw-bold mb-0 text-info">
              <i class="fas fa-history me-2"></i>Hoạt động Gần đây
            </h5>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item d-flex mb-3">
                <div class="activity-dot me-3" :class="activity.type === 'borrow' ? 'bg-primary' : activity.type === 'return' ? 'bg-success' : 'bg-info'">
                  <i :class="getActivityIcon(activity.type)"></i>
                </div>
                <div class="activity-content flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <span class="fw-500">{{ activity.user }}</span>
                      <span class="text-muted"> {{ activity.action }}</span>
                      <span class="fw-500">{{ activity.book }}</span>
                    </div>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                  <small class="text-muted">{{ activity.details }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customize Layout Modal -->
    <div v-if="showCustomizeModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="fas fa-cog me-2"></i>Tuỳ chỉnh Layout Trang chủ
            </h5>
            <button type="button" class="btn-close" @click="closeCustomizeModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-4">Chọn các phần bạn muốn hiển thị trên trang tổng quan:</p>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="showQuickActions" v-model="layoutPreferences.showQuickActions">
                  <label class="form-check-label fw-500" for="showQuickActions">
                    <i class="fas fa-bolt text-primary me-2"></i>Hoạt động Nhanh
                  </label>
                  <small class="text-muted d-block ms-4">Các nút thao tác nhanh cho mượn/trả sách</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="showStatistics" v-model="layoutPreferences.showStatistics">
                  <label class="form-check-label fw-500" for="showStatistics">
                    <i class="fas fa-chart-bar text-success me-2"></i>Thống kê
                  </label>
                  <small class="text-muted d-block ms-4">Các thẻ thống kê tổng quan</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="showTodaysTasks" v-model="layoutPreferences.showTodaysTasks">
                  <label class="form-check-label fw-500" for="showTodaysTasks">
                    <i class="fas fa-tasks text-warning me-2"></i>Công việc Hôm nay
                  </label>
                  <small class="text-muted d-block ms-4">Danh sách nhiệm vụ cần thực hiện</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="showBooksDue" v-model="layoutPreferences.showBooksDue">
                  <label class="form-check-label fw-500" for="showBooksDue">
                    <i class="fas fa-calendar-times text-danger me-2"></i>Sách Đến Hạn
                  </label>
                  <small class="text-muted d-block ms-4">Danh sách sách đến hạn và quá hạn</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="showRecentActivities" v-model="layoutPreferences.showRecentActivities">
                  <label class="form-check-label fw-500" for="showRecentActivities">
                    <i class="fas fa-history text-info me-2"></i>Hoạt động Gần đây
                  </label>
                  <small class="text-muted d-block ms-4">Lịch sử hoạt động mượn/trả sách</small>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeCustomizeModal">
              <i class="fas fa-times me-1"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="applyLayoutChanges">
              <i class="fas fa-check me-1"></i>Áp dụng
            </button>
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
      currentDate: '',
      currentTime: '',
      showCustomizeModal: false,
      layoutPreferences: {
        showQuickActions: true,
        showStatistics: true,
        showTodaysTasks: true,
        showBooksDue: true,
        showRecentActivities: true
      },
      stats: {
        totalBooks: 150,
        totalReaders: 85,
        booksBorrowed: 23,
        availableBooks: 127,
        overdueBooks: 5
      },
      todaysTasks: [
        { id: 1, title: 'Kiểm tra sách trả', description: 'Xác nhận sách trả từ độc giả Nguyễn Văn A', priority: 'Cao', completed: false },
        { id: 2, title: 'Cập nhật kho sách', description: 'Thêm sách mới vào hệ thống', priority: 'Trung bình', completed: true },
        { id: 3, title: 'Liên hệ độc giả quá hạn', description: 'Nhắc nhở độc giả về sách quá hạn', priority: 'Cao', completed: false }
      ],
      dueToday: [
        { id: 1, title: 'Bố Già', reader: 'Hoàng Văn F' },
        { id: 2, title: 'Rừng Na Uy', reader: 'Đặng Thị G' }
      ],
      // Dữ liệu giả - ĐÃ XÓA `time`
      recentActivities: [
        { id: 1, user: 'Nguyễn Văn A', action: 'vừa mượn sách', book: 'Đắc Nhân Tâm', type: 'borrow', time: '10:30', details: 'Mượn 1 cuốn' },
        { id: 2, user: 'Trần Thị B', action: 'vừa trả sách', book: 'Nhà Giả Kim', type: 'return', time: '09:15', details: 'Trả đúng hạn' },
        { id: 3, user: 'Lê Văn C', action: 'vừa mượn sách', book: 'Dune - Xứ Cát', type: 'borrow', time: '14:20', details: 'Mượn 1 cuốn' },
        { id: 4, user: 'Phạm Thị D', action: 'vừa trả sách', book: 'Bố Già', type: 'return', time: '11:45', details: 'Trả đúng hạn' },
      ],
      // Dữ liệu giả - Giữ nguyên
      overdueBooks: [
        { id: 1, title: 'Lược Sử Loài Người', reader: 'Phạm Văn D', daysOverdue: 3 },
        { id: 2, title: 'Cây Cam Ngọt Của Tôi', reader: 'Võ Thị E', daysOverdue: 1 }
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
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000); // Update time every second
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.currentTime = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    toggleTask(taskId) {
      const task = this.todaysTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    getPriorityClass(priority) {
      switch (priority) {
        case 'Cao':
          return 'bg-danger';
        case 'Trung bình':
          return 'bg-warning text-dark';
        case 'Thấp':
          return 'bg-success';
        default:
          return 'bg-secondary';
      }
    },
    getActivityIcon(type) {
      switch (type) {
        case 'borrow':
          return 'fas fa-plus-circle';
        case 'return':
          return 'fas fa-undo';
        default:
          return 'fas fa-info-circle';
      }
    },
    loadLayoutPreferences() {
      const userId = this.currentUser?._id || 'default';
      const saved = localStorage.getItem(`staffLayoutPreferences_${userId}`);
      if (saved) {
        this.layoutPreferences = { ...this.layoutPreferences, ...JSON.parse(saved) };
      }
    },
    saveLayoutPreferences() {
      const userId = this.currentUser?._id || 'default';
      localStorage.setItem(`staffLayoutPreferences_${userId}`, JSON.stringify(this.layoutPreferences));
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
    }
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