<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <i class="fas fa-book me-2"></i>Quản Lý Sách
      </h1>
    </div>

    <div class="card bg-dark">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-8">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm sách..."
              v-model="searchQuery"
              @input="filterSach"
            >
          </div>
          <div class="col-md-4">
            <select class="form-control" v-model="filterCategory" @change="filterSach">
              <option value="">Tất cả Thể Loại</option>
              <option value="Khoa Học">Khoa Học</option>
              <option value="Văn Học">Văn Học</option>
              <option value="Lịch Sử">Lịch Sử</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="filteredSach.length === 0" class="alert alert-info">
          Không có sách nào
        </div>

        <table v-else class="table table-dark table-hover">
          <thead>
            <tr>
              <th>Mã Sách</th>
              <th>Tên Sách</th>
              <th>Tác Giả</th>
              <th>NXB</th>
              <th>Năm XB</th>
              <th>Số Lượng Tồn</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sach in filteredSach" :key="sach.MaSach">
              <td>{{ sach.MaSach }}</td>
              <td>{{ sach.TenSach }}</td>
              <td>{{ sach.TacGia }}</td>
              <td>{{ sach.TenNXB }}</td>
              <td>{{ sach.NamXB }}</td>
              <td>
                <span 
                  class="badge"
                  :class="sach.SoLuongTon > 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ sach.SoLuongTon }}
                </span>
              </td>
              <td>
                <span 
                  class="badge"
                  :class="sach.SoLuongTon > 0 ? 'bg-success' : 'bg-secondary'"
                >
                  {{ sach.SoLuongTon > 0 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
  name: "StaffSachManagement",
  data() {
    return {
      sachList: [],
      filteredSach: [],
      searchQuery: "",
      filterCategory: "",
      loading: false,
    };
  },
  mounted() {
    this.loadSach();
  },
  methods: {
    async loadSach() {
      this.loading = true;
      try {
        const response = await SachService.getAll();
        this.sachList = response.data || [];
        this.filteredSach = this.sachList;
      } catch (error) {
        console.error("Lỗi tải sách:", error);
      } finally {
        this.loading = false;
      }
    },
    filterSach() {
      this.filteredSach = this.sachList.filter((sach) => {
        const matchSearch =
          sach.TenSach.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          sach.TacGia.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchCategory =
          this.filterCategory === "" ||
          (sach.TheLoai && sach.TheLoai.includes(this.filterCategory));

        return matchSearch && matchCategory;
      });
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

h1 {
  color: white;
  font-size: 28px;
}

.form-control {
  background-color: #2a2a2a;
  color: white;
  border-color: #444;
}

.form-control:focus {
  background-color: #2a2a2a;
  color: white;
  border-color: #4299e1;
  box-shadow: 0 0 0 0.2rem rgba(66, 153, 225, 0.25);
}

.table {
  color: white;
}

.table th {
  color: #aaa;
  border-color: #444;
  font-weight: 600;
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
