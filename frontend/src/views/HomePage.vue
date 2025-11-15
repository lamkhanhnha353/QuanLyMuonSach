<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1 class="hero-title mb-3">Khám Phá Thế Giới Sách</h1>
            <p class="hero-subtitle mb-4">Mượn sách trực tuyến, mở rộng tầm hiểu biết của bạn. Thư viện số với hàng ngàn đầu sách hay chờ bạn khám phá.</p>
            
            <router-link to="/books" class="btn btn-primary btn-lg">
              <i class="fas fa-book me-2"></i> Khám Phá Sách Ngay
            </router-link>
          </div>

          <div class="col-lg-5 text-center mt-5 mt-lg-0">
            <div class="book-illustration">
              <i class="fas fa-book-open" style="font-size: 6rem; color: #667eea;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="features-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-search feature-icon"></i>
              <h5 class="mt-3 mb-2">Tìm Kiếm Dễ Dàng</h5>
              <p class="text-muted small">Tìm kiếm sách theo tên, tác giả, hoặc thể loại</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-hand-holding-heart feature-icon"></i>
              <h5 class="mt-3 mb-2">Mượn Tiện Lợi</h5>
              <p class="text-muted small">Quản lý phiếu mượn sách một cách dễ dàng</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-star feature-icon"></i>
              <h5 class="mt-3 mb-2">Sách Hay</h5>
              <p class="text-muted small">Luôn cập nhật với sách mới nhất</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {};
  },
};
</script>

<style scoped>
.home-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.6;
}

.btn-primary {
  background-color: #fff;
  color: #667eea;
  border: none;
  padding: 12px 32px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #f0f0f0;
  color: #764ba2;
  transform: translateY(-2px);
}

.book-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.features-section {
  background-color: white;
}

.feature-card {
  padding: 30px 20px;
  border-radius: 10px;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #667eea;
}

.feature-card h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .book-illustration {
    min-height: 200px;
  }

  .book-illustration i {
    font-size: 4rem !important;
  }
}
</style>
