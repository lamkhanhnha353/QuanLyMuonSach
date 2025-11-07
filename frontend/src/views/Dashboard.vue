<template>
  <div class="container-fluid">
    <h3 class="text-white mb-4">Tổng Quan (Dashboard)</h3>
    <div class="row">
      <div class="col-md-4">
        <div class="card bg-dark text-white p-3">
          <h4><i class="fas fa-users"></i> Độc Giả</h4>
          <p class="fs-1 text-info">120</p>
          <small>Tổng số độc giả đã đăng ký</small>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-dark text-white p-3">
          <h4><i class="fas fa-book"></i> Sách</h4>
          <p class="fs-1 text-success">450</p>
          <small>Tổng số đầu sách trong kho</small>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-dark text-white p-3">
          <h4><i class="fas fa-receipt"></i> Lượt Mượn</h4>
          <p class="fs-1 text-warning">85</p>
          <small>Số lượt đang mượn</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
</style>