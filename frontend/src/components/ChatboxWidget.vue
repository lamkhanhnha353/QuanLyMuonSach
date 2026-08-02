<template>
  <div class="chatbot-widget">
    <button
      class="chatbot-toggle-btn"
      :class="{ 'active': isOpen }"
      @click="toggleChat"
      :title="isOpen ? 'Đóng chat' : 'Mở chat hỗ trợ'"
    >
      <i v-if="!isOpen" class="fas fa-comment-dots"></i>
      <i v-else class="fas fa-times"></i>
    </button>

    <transition name="chat-slide">
      <div v-if="isOpen" class="chatbox-panel">
        <!-- HEADER -->
        <div class="chatbox-header">
          <div class="header-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="header-info">
            <h5 class="header-title">Trợ lý Thư viện</h5>
            <p class="header-status">
              <span class="status-dot"></span>
              {{ isLoggedIn ? 'Sẵn sàng hỗ trợ' : 'Hỗ trợ tra cứu sách' }}
            </p>
          </div>
          <button class="btn-close-chat" @click="closeChat" title="Thu gọn">
            <i class="fas fa-minus"></i>
          </button>
          <button class="btn-clear-chat" @click="clearChat" title="Xóa hội thoại">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>

        <!-- MESSAGES -->
        <div class="chatbox-messages" ref="messagesContainer">
          <!-- Welcome message -->
          <div class="message bot-message">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
          <div class="message-bubble">
              <p>Xin chào! Tôi là trợ lý thư viện. Tôi có thể giúp bạn:</p>
              <ul class="help-list">
                <li>Tra cứu sách (vd: "Sách Dế Mèn còn không?", "Nội dung Truyện Kiều")</li>
                <li>Kiểm tra sách đang mượn (vd: "Tôi đang mượn gì?")</li>
                <li>Xem tiền phạt (vd: "Tôi còn nợ phạt không?")</li>
                <li>Quy định mượn sách (vd: "Mượn tối đa bao nhiêu quyển?")</li>
              </ul>
            </div>
          </div>

          <!-- Chat messages -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="msg.role === 'user' ? 'user-message' : 'bot-message'"
          >
            <div v-if="msg.role === 'bot'" class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble" v-html="formatMessage(msg.content)"></div>
          </div>

          <!-- Typing indicator -->
          <div v-if="loading" class="message bot-message">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- INPUT -->
        <div class="chatbox-input">
          <div class="input-wrapper">
            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              placeholder="Nhập câu hỏi của bạn..."
              :disabled="loading"
              class="chat-input"
              ref="chatInput"
            />
            <button
              class="btn-send"
              @click="sendMessage"
              :disabled="!inputMessage.trim() || loading"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <p v-if="!isLoggedIn" class="login-hint">
            <router-link to="/login">Đăng nhập</router-link> để tra cứu mượn trả và tiền phạt
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ChatbotService from "@/services/chatbot.service";
import AuthService from "@/services/auth.service";
import eventBus from "@/services/eventBus";

function getConversationKey() {
  const user = AuthService.getCurrentUser();
  if (user && user._id) {
    return `chatbot_conv_${user._id}`;
  }
  return "chatbot_conv_guest";
}

export default {
  name: "ChatboxWidget",
  data() {
    return {
      isOpen: false,
      inputMessage: "",
      messages: [],
      loading: false,
      currentUser: AuthService.getCurrentUser(),
      conversationId: localStorage.getItem(getConversationKey()) || null,
      historyLoaded: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.currentUser && !this.currentUser.ChucVu;
    },
  },
  watch: {
    isOpen(val) {
      if (val && this.isLoggedIn && !this.historyLoaded) {
        this.loadHistory();
      }
    },
  },
  created() {
    // Lắng nghe sự kiện đăng nhập / đăng xuất từ toàn app
    eventBus.on("auth-change", this.handleAuthChange);
  },
  beforeUnmount() {
    eventBus.off("auth-change", this.handleAuthChange);
  },
  methods: {
    handleAuthChange() {
      // Cập nhật user mới (reactive) sau khi đăng nhập/đăng xuất
      this.currentUser = AuthService.getCurrentUser();
      this.historyLoaded = false;
      this.messages = [];
      // Khôi phục conversationId mới cho user hiện tại
      this.conversationId = localStorage.getItem(getConversationKey()) || null;
      // Nếu chat đang mở và đã đăng nhập -> tải lịch sử ngay lập tức
      if (this.isOpen && this.isLoggedIn) {
        this.loadHistory();
      }
    },
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom();
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus();
          }
        });
      }
    },
    closeChat() {
      this.isOpen = false;
    },
    clearChat() {
      this.messages = [];
      this.conversationId = null;
      this.historyLoaded = false;
      localStorage.removeItem(getConversationKey());
    },
    async loadHistory() {
      if (!this.isLoggedIn || !this.currentUser?._id) return;
      try {
        const response = await ChatbotService.getHistory(this.currentUser._id);
        const data = response.data;
        if (data.success && data.data && data.data.length > 0) {
          // Convert server messages to local message format
          const serverMessages = data.data.map(function(msg) {
            return {
              role: msg.role === "user" ? "user" : "bot",
              content: msg.message || msg.content || ""
            };
          });

          // Merge with existing messages (avoid duplicates)
          const existingContents = new Set(this.messages.map(function(m) {
            return m.role + "|" + m.content;
          }));
          const newMessages = serverMessages.filter(function(m) {
            return !existingContents.has(m.role + "|" + m.content);
          });

          if (newMessages.length > 0) {
            this.messages = newMessages;
          }

          // Restore the last conversationId from server data
          const lastMsg = data.data[data.data.length - 1];
          if (lastMsg.conversationId) {
            this.conversationId = lastMsg.conversationId;
            localStorage.setItem(getConversationKey(), lastMsg.conversationId);
          }
        }
        this.historyLoaded = true;
        this.$nextTick(() => this.scrollToBottom());
      } catch (error) {
        console.error("Load history error:", error);
        this.historyLoaded = true;
      }
    },
    async sendMessage() {
      const message = this.inputMessage.trim();
      if (!message || this.loading) return;

      this.messages.push({ role: "user", content: message });
      this.inputMessage = "";
      this.loading = true;

      try {
        this.$nextTick(() => this.scrollToBottom());

        const docGiaId = this.currentUser?._id || null;
        const response = await ChatbotService.sendMessage(
          message,
          docGiaId,
          this.conversationId
        );

        const data = response.data;
        const reply = data?.reply || "Xin lỗi, tôi chưa thể xử lý yêu cầu này.";

        if (data?.conversationId) {
          this.conversationId = data.conversationId;
          localStorage.setItem(getConversationKey(), data.conversationId);
        }

        this.messages.push({ role: "bot", content: reply });
      } catch (error) {
        console.error("Chatbot error:", error);
        let errorMsg = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";

        if (error.response) {
          if (error.response.status === 400) {
            errorMsg = "Vui lòng nhập nội dung câu hỏi.";
          } else if (error.response.status === 429) {
            errorMsg = "Bạn đã gửi quá nhiều câu hỏi. Vui lòng đợi một lát.";
          } else if (error.response.status >= 500) {
            errorMsg = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
          }
        } else if (error.code === "ERR_NETWORK") {
          errorMsg = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
        }

        this.messages.push({ role: "bot", content: errorMsg });
      } finally {
        this.loading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    formatMessage(text) {
      if (!text) return "";
      const clean = text
        .replace(/\*\*/g, "")
        .replace(/\*{1}(?!\*)/g, "")
        .replace(/`{1,3}/g, "")
        .replace(/#{1,6}\s/g, "")
        .replace(/>\s/g, "")
        .trim();
      return clean.replace(/\n/g, "<br>");
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    },
  },
};
</script>

<style scoped>
.chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.chatbot-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.chatbot-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}
.chatbot-toggle-btn.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 20px rgba(245, 87, 108, 0.4);
}
.chatbot-toggle-btn:not(.active)::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
.chatbox-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 380px;
  height: 560px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-slide-enter-active {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-slide-leave-active {
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.chatbox-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.header-info {
  flex: 1;
}
.header-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.header-status {
  margin: 2px 0 0;
  font-size: 11px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  display: inline-block;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.btn-close-chat, .btn-clear-chat {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s;
  padding: 4px;
}
.btn-close-chat:hover, .btn-clear-chat:hover { opacity: 1; }
.chatbox-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chatbox-messages::-webkit-scrollbar { width: 4px; }
.chatbox-messages::-webkit-scrollbar-track { background: transparent; }
.chatbox-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
.message {
  display: flex;
  gap: 8px;
  max-width: 85%;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.bot-message { align-self: flex-start; }
.user-message { align-self: flex-end; flex-direction: row-reverse; }
.message-avatar {
  width: 28px;
  height: 28px;
  background: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #5654d4;
  flex-shrink: 0;
}
.user-message .message-avatar { background: #dbeafe; color: #2563eb; }
.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13.5px;
  line-height: 1.5;
  word-wrap: break-word;
}
.bot-message .message-bubble {
  background: white;
  color: #1f2937;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-top-right-radius: 4px;
}
.help-list { margin: 6px 0 0; padding-left: 16px; font-size: 12.5px; }
.help-list li { margin-bottom: 4px; color: #4b5563; }
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px !important;
  align-items: center;
}
.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}
.chatbox-input {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}
.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #f3f4f6;
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  transition: box-shadow 0.2s;
}
.input-wrapper:focus-within { box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3); }
.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13.5px;
  padding: 8px 0;
  color: #1f2937;
}
.chat-input::placeholder { color: #9ca3af; }
.btn-send {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}
.btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
.login-hint {
  margin: 8px 0 0;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
}
.login-hint a { color: #667eea; text-decoration: none; font-weight: 600; }
.login-hint a:hover { text-decoration: underline; }
@media (max-width: 480px) {
  .chatbox-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .chatbot-toggle-btn { width: 48px; height: 48px; font-size: 20px; }
}
</style>
