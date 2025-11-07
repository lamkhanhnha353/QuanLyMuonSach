<template>
  <div class="container-fluid">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Quản lý Nhân Viên</h3>
      <router-link to="/admin/nhanvien/add" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i> Thêm Nhân Viên Mới
      </router-link>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-body">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Tìm kiếm theo Tên hoặc MSNV...">
          <button class="btn btn-info" type="button">
            <i class="fas fa-search"></i> Tìm
          </button>
        </div>
      </div>
    </div>

    <div class="card bg-dark text-white mb-4">
      <div class="card-header">
        <i class="fas fa-users-cog me-2"></i> Danh sách Nhân Viên
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-hover">
            <thead>
              <tr>
                <th>MSNV</th>
                <th>Họ Tên</th>
                <th>Chức Vụ</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in nhanviens" :key="nv._id">
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.HoTenNV }}</td>
                <td>
                  <span :class="nv.ChucVu === 'Admin' ? 'badge bg-success' : 'badge bg-info'">
                    {{ nv.ChucVu }}
                  </span>
                </td>
                <td>{{ nv.DiaChi }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button class="btn btn-info btn-sm me-2" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-warning btn-sm me-2" title="Sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="handleDelete(nv._id)" title="Xóa">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>

  </div>
</template>

<script>
// (KHÔNG CẦN Form, Field, ErrorMessage, yup nữa)
import NhanVienService from "@/services/nhanvien.service";

export default {
  name: "NhanVienManagement",
  components: {
    // (Đã xóa Form components)
  },
  data() {
    return {
      nhanviens: [],
      // (Đã xóa loading, message, registerSchema)
    };
  },
  methods: {
    // Lấy danh sách nhân viên
    async retrieveNhanViens() {
      try {
        const response = await NhanVienService.getAll();
        this.nhanviens = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    
    // (Hàm handleRegister đã bị XÓA)
    
    // Xử lý Xóa
    async handleDelete(id) {
        if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
            try {
                await NhanVienService.delete(id);
                this.retrieveNhanViens(); // Tải lại bảng
            } catch (error) {
                alert("Không thể xóa nhân viên.");
            }
        }
    }
  },
  // Chạy khi trang được tải
  mounted() {
    this.retrieveNhanViens();
  },
};
</script>

<style scoped>
/* Style cho Card, Form, Table... */
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.form-control, .form-select {
  background-color: #212529;
  color: #fff;
  border: 1px solid #495057;
}
.form-control:focus, .form-select:focus {
  background-color: #212529;
  color: #fff;
  border-color: #58a6ff;
  box-shadow: 0 0 0 0.25rem rgba(88, 166, 255, 0.25);
}
</style>