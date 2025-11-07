<template>
  <div id="public-layout">
    <AppHeader />
    
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
  name: "PublicLayout",
  components: {
    AppHeader,
  },
};
</script>

<style scoped>
/* DI CHUYỂN TOÀN BỘ CSS NỀN ẢNH TỪ APP.VUE CŨ SANG ĐÂY
*/
#public-layout {
  background-image: url("~@/assets/background.jpg");
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  min-height: 100vh;
  color: #f8f9fa; /* Chữ trắng mặc định */
  position: relative;
  z-index: 1;
}

/* Lớp phủ tối mờ */
#public-layout::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

.main-content {
  padding-top: 20px;
}
</style>