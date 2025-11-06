<template>
  <div id="app">
    <AppHeader />

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
  name: "App",
  components: {
    AppHeader,
  },
};
</script>

<style>
#app {
  /* Dùng ảnh làm nền */
  background-image: url("~@/assets/background.jpg"); /* <-- Dùng đường dẫn này nếu bạn lưu ảnh vào src/assets */
  /* HOẶC nếu bạn lưu vào public/background-library.jpg thì dùng: */
  /* background-image: url("/background-library.jpg"); */
  background-size: cover; /* Đảm bảo ảnh phủ kín */
  background-position: center center; /* Căn giữa ảnh */
  background-attachment: fixed; /* Giữ ảnh cố định khi cuộn */
  min-height: 100vh; /* Đảm bảo nền full chiều cao */
  color: #f8f9fa; /* Đổi màu chữ mặc định thành trắng cho dễ nhìn trên nền tối */

  /* Thêm một lớp phủ tối mờ để chữ và các phần khác dễ đọc hơn */
  position: relative; /* Quan trọng cho pseudo-element */
  z-index: 1; /* Để nội dung nằm trên lớp phủ */
}

/* Lớp phủ tối mờ */
#app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Đổi độ trong suốt (0.6) nếu muốn sáng/tối hơn */
  z-index: -1; /* Đặt dưới nội dung */
}

.main-content {
  padding: 20px;
}
</style>