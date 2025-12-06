<template>
  <div class="not-found-page">
    <section class="error-section position-relative overflow-hidden">
      <div class="container position-relative z-2">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6 text-white">
            <div class="error-code mb-4">
              <h1 class="display-1 fw-bolder mb-0">404</h1>
              <span class="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm fw-bold">
                <i class="fas fa-exclamation-triangle me-2 text-warning"></i>Không Tìm Thấy
              </span>
            </div>
            <h2 class="display-5 fw-bolder mb-3 lh-sm">
              Trang Bạn Tìm Kiếm <br>
              <span class="text-warning">Không Tồn Tại</span>
            </h2>
            <p class="lead mb-4 opacity-90">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ hoặc liên hệ với chúng tôi nếu cần hỗ trợ.
            </p>
            <div class="d-flex gap-3">
              <router-link to="/" class="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow-lg hover-lift">
                <i class="fas fa-home me-2 text-primary"></i> Về Trang Chủ
              </router-link>
              <router-link to="/books" class="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold hover-lift">
                <i class="fas fa-book-open me-2"></i> Tìm Sách
              </router-link>
            </div>
          </div>

          <div class="col-lg-6 mt-5 mt-lg-0 text-center position-relative">
            <!-- Animated Blob Background -->
            <div class="blob-bg"></div>
            <div class="error-image-container">
              <i class="fas fa-search text-white" style="font-size: 15rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));"></i>
              <!-- Floating Elements -->
              <div class="floating-card card-1 bg-white p-3 rounded-3 shadow text-dark">
                <i class="fas fa-book text-primary me-2"></i> Thư Viện Số
              </div>
              <div class="floating-card card-2 bg-white p-3 rounded-3 shadow text-dark">
                <i class="fas fa-users text-success me-2"></i> Hỗ Trợ 24/7
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Wave Shape Divider -->
      <div class="custom-shape-divider-bottom">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
        </svg>
      </div>
    </section>

    <!-- Quick Links Section -->
    <section class="quick-links-section py-5 bg-light-gray">
      <div class="container">
        <div class="text-center mb-5">
          <small class="text-primary fw-bold text-uppercase ls-2">Khám Phá</small>
          <h2 class="section-title fw-bold mt-2">Các Trang Phổ Biến</h2>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-md-4 col-sm-6">
            <div class="link-card bg-white p-4 rounded-4 text-center shadow-hover cursor-pointer h-100">
              <div class="link-icon mb-3 text-primary">
                <i class="fas fa-book-open fa-3x"></i>
              </div>
              <h5 class="fw-bold text-dark">Khám Phá Sách</h5>
              <p class="text-muted small">Tìm kiếm và khám phá hàng ngàn đầu sách trong thư viện</p>
              <router-link to="/books" class="btn btn-primary rounded-pill">Xem Ngay</router-link>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="link-card bg-white p-4 rounded-4 text-center shadow-hover cursor-pointer h-100">
              <div class="link-icon mb-3 text-success">
                <i class="fas fa-user-plus fa-3x"></i>
              </div>
              <h5 class="fw-bold text-dark">Đăng Ký Tài Khoản</h5>
              <p class="text-muted small">Tạo tài khoản để mượn sách và theo dõi lịch sử đọc</p>
              <router-link to="/docgia/register" class="btn btn-success rounded-pill">Đăng Ký</router-link>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="link-card bg-white p-4 rounded-4 text-center shadow-hover cursor-pointer h-100">
              <div class="link-icon mb-3 text-info">
                <i class="fas fa-sign-in-alt fa-3x"></i>
              </div>
              <h5 class="fw-bold text-dark">Đăng Nhập</h5>
              <p class="text-muted small">Đăng nhập để truy cập tài khoản và quản lý mượn sách</p>
              <router-link to="/login" class="btn btn-info rounded-pill">Đăng Nhập</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section py-5 bg-primary text-white">
      <div class="container text-center">
        <h3 class="fw-bold mb-3">Cần Hỗ Trợ?</h3>
        <p class="mb-4 opacity-90">Liên hệ với đội ngũ hỗ trợ của chúng tôi để được giúp đỡ nhanh chóng</p>
        <div class="d-flex justify-content-center gap-4">
          <div class="contact-item">
            <i class="fas fa-envelope fa-2x mb-2"></i>
            <p class="mb-0">support@gmail.com</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone fa-2x mb-2"></i>
            <p class="mb-0">1900-10088</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-clock fa-2x mb-2"></i>
            <p class="mb-0">24/7</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found-page {
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* Error Section */
.error-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 6rem 0 8rem;
}

.blob-bg {
  position: absolute;
  top: 50%; left: 50%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0) 70%);
  transform: translate(-50%, -50%);
  z-index: -1;
  filter: blur(60px);
  animation: pulse 5s infinite alternate;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

.custom-shape-divider-bottom {
  position: absolute;
  bottom: 0; left: 0; width: 100%;
  overflow: hidden;
  line-height: 0;
}
.custom-shape-divider-bottom svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 80px;
}
.custom-shape-divider-bottom .shape-fill {
  fill: #f3f6f9;
}

/* Floating Cards Animation */
.floating-card {
  position: absolute;
  width: 160px;
  font-weight: 600;
  font-size: 0.9rem;
  animation: float 4s ease-in-out infinite;
}
.card-1 { top: 20%; left: 0; animation-delay: 0s; }
.card-2 { bottom: 20%; right: 0; animation-delay: 2s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Quick Links */
.bg-light-gray { background-color: #f3f6f9; }
.ls-2 { letter-spacing: 2px; }

.link-card {
  transition: transform 0.3s;
  border: 1px solid rgba(0,0,0,0.05);
}
.link-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.link-icon {
  transition: transform 0.3s;
}
.link-card:hover .link-icon {
  transform: scale(1.1);
}

/* Contact Section */
.contact-item {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s;
}
.contact-item:hover {
  transform: translateY(-5px);
}

/* Utilities */
.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
</style>
