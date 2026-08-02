<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            <i class="fas fa-file-excel text-success me-2"></i>Export Excel - Chọn Báo Cáo
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        
        <div class="modal-body">
          <p class="text-muted mb-4">
            <i class="fas fa-info-circle me-2"></i>Chọn các báo cáo bạn muốn export:
          </p>

          <!-- Nút nhanh -->
          <div class="mb-4 d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="selectAll">
              <i class="fas fa-check-double me-1"></i>Chọn Tất Cả
            </button>
            <button class="btn btn-outline-secondary btn-sm" @click="deselectAll">
              <i class="fas fa-times me-1"></i>Bỏ Chọn Tất Cả
            </button>
          </div>

          <!-- Danh sách checkbox -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="overview" 
                  v-model="selectedSheets"
                  value="overview"
                >
                <label class="form-check-label" for="overview">
                  <i class="fas fa-chart-pie text-primary me-2"></i>
                  <strong>Tổng Quan</strong>
                  <small class="text-muted d-block ms-4">Thống kê chung của hệ thống</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="books" 
                  v-model="selectedSheets"
                  value="books"
                >
                <label class="form-check-label" for="books">
                  <i class="fas fa-book text-info me-2"></i>
                  <strong>Danh Sách Sách</strong>
                  <small class="text-muted d-block ms-4">Toàn bộ thông tin về sách</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="readers" 
                  v-model="selectedSheets"
                  value="readers"
                >
                <label class="form-check-label" for="readers">
                  <i class="fas fa-users text-success me-2"></i>
                  <strong>Danh Sách Độc Giả</strong>
                  <small class="text-muted d-block ms-4">Thông tin tất cả độc giả</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="borrows" 
                  v-model="selectedSheets"
                  value="borrows"
                >
                <label class="form-check-label" for="borrows">
                  <i class="fas fa-receipt text-warning me-2"></i>
                  <strong>Mượn Trả Sách</strong>
                  <small class="text-muted d-block ms-4">Toàn bộ phiếu mượn - trả sách</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="topBooks" 
                  v-model="selectedSheets"
                  value="topBooks"
                >
                <label class="form-check-label" for="topBooks">
                  <i class="fas fa-fire text-danger me-2"></i>
                  <strong>Sách Mượn Nhiều Nhất</strong>
                  <small class="text-muted d-block ms-4">Top 10 sách được mượn nhiều</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="topReaders" 
                  v-model="selectedSheets"
                  value="topReaders"
                >
                <label class="form-check-label" for="topReaders">
                  <i class="fas fa-star text-warning me-2"></i>
                  <strong>Độc Giả Mượn Nhiều Nhất</strong>
                  <small class="text-muted d-block ms-4">Top 10 độc giả mượn sách nhiều</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="outOfStock" 
                  v-model="selectedSheets"
                  value="outOfStock"
                >
                <label class="form-check-label" for="outOfStock">
                  <i class="fas fa-exclamation-circle text-danger me-2"></i>
                  <strong>Sách Hết Hàng</strong>
                  <small class="text-muted d-block ms-4">Danh sách sách không còn số lượng</small>
                </label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="overdue" 
                  v-model="selectedSheets"
                  value="overdue"
                >
                <label class="form-check-label" for="overdue">
                  <i class="fas fa-clock text-danger me-2"></i>
                  <strong>Phiếu Quá Hạn</strong>
                  <small class="text-muted d-block ms-4">Phiếu mượn sách đã quá ngày hết hạn</small>
                </label>
              </div>
            </div>
          </div>

          <!-- Cảnh báo -->
          <div class="alert alert-info mt-4 mb-0">
            <i class="fas fa-lightbulb me-2"></i>
            <strong>Mẹo:</strong> Chọn các báo cáo bạn cần để tạo file Excel với nhiều sheet riêng biệt, giúp quản lý và phân tích dữ liệu hiệu quả.
          </div>
        </div>

        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="closeModal"
            :disabled="isExporting"
          >
            <i class="fas fa-times me-1"></i>Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-success" 
            @click="handleExport"
            :disabled="isExporting || selectedSheets.length === 0"
          >
            <span v-if="!isExporting">
              <i class="fas fa-file-excel me-1"></i>Export Excel
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin me-1"></i>Đang export...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExportService from '@/services/export.service';

export default {
  name: 'ExportModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedSheets: [],
      isExporting: false
    };
  },
  methods: {
    selectAll() {
      this.selectedSheets = [
        'overview', 
        'books', 
        'readers', 
        'borrows', 
        'topBooks', 
        'topReaders', 
        'outOfStock', 
        'overdue'
      ];
    },
    deselectAll() {
      this.selectedSheets = [];
    },
    closeModal() {
      this.$emit('close');
      this.selectedSheets = [];
    },
    async handleExport() {
      if (this.selectedSheets.length === 0) {
        alert('Vui lòng chọn ít nhất một báo cáo!');
        return;
      }

      try {
        this.isExporting = true;
        await ExportService.exportToExcel(this.selectedSheets);
        
        this.$emit('success', {
          message: 'Export Excel thành công!',
          type: 'success'
        });
        
        this.closeModal();
      } catch (error) {
        console.error('Lỗi export:', error);
        this.$emit('error', {
          message: 'Lỗi khi export Excel: ' + (error.message || 'Vui lòng thử lại'),
          type: 'error'
        });
      } finally {
        this.isExporting = false;
      }
    }
  }
};
</script>

<style scoped>
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
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
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
  padding: 0;
}

.modal-body {
  padding: 25px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #f8f9fa;
}

.form-check {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.form-check:hover {
  background-color: #f0f0f0;
  border-color: #dee2e6;
}

.form-check-input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.form-check-label {
  cursor: pointer;
  margin-bottom: 0;
  user-select: none;
}

.form-check-label small {
  font-size: 0.85rem;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-outline-primary {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline-primary:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.btn-outline-secondary {
  background: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
}

.btn-outline-secondary:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.alert {
  border-radius: 8px;
  border: none;
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 15px;
  }

  .row {
    margin: 0 -6px;
  }

  .col-md-6 {
    flex: 0 0 100%;
    padding: 6px;
  }
}
</style>
