<template>
  <div id="public-layout">
    <AppHeader />
    
    <main class="main-content">
      <router-view />
    </main>

    <!-- Chatbox hỗ trợ cho độc giả -->
    <ChatboxWidget />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ChatboxWidget from "@/components/ChatboxWidget.vue";
export default {
  name: "PublicLayout",
  components: {
    AppHeader,
    ChatboxWidget,
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
