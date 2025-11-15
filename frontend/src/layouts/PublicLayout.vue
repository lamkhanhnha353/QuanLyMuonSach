<template>
  <div id="public-layout">
    <AppHeader />
    
    <main class="main-content">
      <router-view />
    </main>
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
#public-layout {
  background-color: #f8fafc;
  min-height: 100vh;
  color: #212529;
}

.main-content {
  padding-top: 0;
}
</style>
