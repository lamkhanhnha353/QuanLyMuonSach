<template>
  <div class="container hero-container d-flex align-items-center justify-content-center">
    <div class="text-center">
      
      <h1 class="display-1 fw-bold welcome-text">
        Welcome
      </h1>
      
    </div>
  </div>
</template>

<style scoped>
.hero-container {
    min-height: 70vh; 
  }

.welcome-text {
  color: #58a6ff; /* Màu xanh dương sáng */
  font-weight: 700;
  /* Tăng text-shadow để chữ nổi bật hơn trên nền ảnh */
  text-shadow: 0px 0px 15px rgba(88, 166, 255, 0.4), /* Bóng mờ chính */
               0px 0px 30px rgba(88, 166, 255, 0.2); /* Thêm bóng xa hơn */
}
</style>