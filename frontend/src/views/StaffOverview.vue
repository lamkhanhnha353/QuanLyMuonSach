	<template>
	  <div class="staff-overview">
		<!-- Header Section -->
		<div class="row mb-4">
		  <div class="col-12">
			<div class="welcome-header">
			  <div class="d-flex justify-content-between align-items-center">
				<div>
				  <h2 class="fw-bold text-white mb-1">Tổng quan Nhân viên</h2>
				  <p class="text-white-50 mb-0">Quản lý mượn trả sách hiệu quả</p>
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
		<div v-if="layoutPreferences.showQuickActions" class="row mb-4">
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
				  <div class="col-md-3">
					<button 
					  @click="openExportModal" 
					  class="action-card action-card-button text-decoration-none"
					>
					  <div class="action-icon bg-success text-white">
						<i class="fas fa-file-excel"></i>
					  </div>
					  <div class="action-content">
						<h6 class="mb-1">Export Excel</h6>
						<small class="text-muted">Xuất báo cáo</small>
					  </div>
					</button>
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
				<h3 class="stat-number">{{ stats.booksBorrowed }}</h3>
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
		  <div class="modal-dialog modal-lg">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title fw-bold">
				  <i class="fas fa-cog me-2"></i>Tuỳ chỉnh Tổng quan Nhân viên
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

		<!-- Export Modal -->
		<ExportModal 
		  :show="showExportModal" 
		  @close="closeExportModal"
		  @success="handleExportSuccess"
		  @error="handleExportError"
		/>

		<!-- Notification Toast -->
		<div v-if="notification" :class="['notification-toast', 'notification-' + notification.type]">
		  <div class="notification-content">
			<i :class="getNotificationIcon(notification.type)" class="me-2"></i>
			{{ notification.message }}
		  </div>
		  <button class="notification-close" @click="closeNotification">
			<i class="fas fa-times"></i>
		  </button>
		</div>
	  </div>
	</template>

	<script>
	import AuthService from "@/services/auth.service";
	import ExportModal from "@/components/ExportModal.vue";

	export default {
	  name: "StaffOverview",
	  components: {
		ExportModal
	  },
	  data() {
		return {
		  currentUser: null,
		  currentTime: '',
		  showCustomizeModal: false,
		  showExportModal: false,
		  notification: null,
		  layoutPreferences: {
			showQuickActions: true,
			showStatistics: true
		  },
		  stats: {
			totalReaders: 120,
			newReadersThisMonth: 8,
			totalBooks: 450,
			newBooksThisMonth: 15,
			activeBorrows: 85,
			availableBooks: 365,
			overdueBooks: 12
		  }
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
		},
		openExportModal() {
		  this.showExportModal = true;
		},
		closeExportModal() {
		  this.showExportModal = false;
		},
		handleExportSuccess(event) {
		  this.showNotification(event.message, 'success');
		},
		handleExportError(event) {
		  this.showNotification(event.message, 'error');
		},
		showNotification(message, type = 'info') {
		  this.notification = {
			message,
			type
		  };
		  
		  // Auto close sau 4 giây
		  setTimeout(() => {
			this.closeNotification();
		  }, 4000);
		},
		closeNotification() {
		  this.notification = null;
		},
		getNotificationIcon(type) {
		  const icons = {
			success: 'fas fa-check-circle',
			error: 'fas fa-exclamation-circle',
			info: 'fas fa-info-circle',
			warning: 'fas fa-exclamation-triangle'
		  };
		  return icons[type] || icons.info;
		}
	  },
	};
	</script>

	<style scoped>
	.staff-overview {
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

	.action-card-button {
	  background: white;
	  border: none;
	  padding: 15px;
	  cursor: pointer;
	}

	.action-card-button:hover {
	  border-color: #28a745;
	  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.1);
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

	.fw-500 {
	  font-weight: 500;
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

	.modal-content {
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
	  .staff-overview {
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

	/* Notification Toast */
	.notification-toast {
	  position: fixed;
	  bottom: 20px;
	  right: 20px;
	  padding: 16px 20px;
	  border-radius: 8px;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  gap: 12px;
	  min-width: 300px;
	  max-width: 450px;
	  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	  animation: slideInRight 0.3s ease-out;
	  z-index: 2000;
	}

	@keyframes slideInRight {
	  from {
		opacity: 0;
		transform: translateX(400px);
	  }
	  to {
		opacity: 1;
		transform: translateX(0);
	  }
	}

	.notification-success {
	  background: #d4edda;
	  color: #155724;
	  border-left: 4px solid #28a745;
	}

	.notification-error {
	  background: #f8d7da;
	  color: #721c24;
	  border-left: 4px solid #dc3545;
	}

	.notification-info {
	  background: #d1ecf1;
	  color: #0c5460;
	  border-left: 4px solid #17a2b8;
	}

	.notification-warning {
	  background: #fff3cd;
	  color: #856404;
	  border-left: 4px solid #ffc107;
	}

	.notification-content {
	  flex: 1;
	  display: flex;
	  align-items: center;
	  font-weight: 500;
	}

	.notification-close {
	  background: none;
	  border: none;
	  font-size: 1.2rem;
	  cursor: pointer;
	  padding: 0;
	  color: inherit;
	}

	.notification-close:hover {
	  opacity: 0.7;
	}
	</style>
