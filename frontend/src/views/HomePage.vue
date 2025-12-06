<template>
  <div class="home-page">
    
    <section class="hero-section position-relative overflow-hidden">
      <div class="container position-relative z-2">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6 text-white">
            <span class="badge bg-white text-primary mb-3 rounded-pill px-3 py-2 shadow-sm fw-bold animate-fade-in-down" style="animation-delay: 0.2s;">
              <i class="fas fa-star me-2 text-warning"></i>Thư viện số hàng đầu
            </span>
            <h1 class="display-3 fw-bolder mb-3 lh-sm animate-slide-in-left">
              Khám Phá <br>
              <span class="text-warning">Tri Thức</span> Vô Tận
            </h1>
            <p class="lead mb-4 opacity-90 animate-slide-in-right" style="animation-delay: 0.4s;">
              Hệ thống thư viện hiện đại, giúp bạn tiếp cận hàng ngàn đầu sách chất lượng mọi lúc, mọi nơi. Đọc sách chưa bao giờ dễ dàng đến thế.
            </p>
            <div class="d-flex gap-3 animate-fade-in-up" style="animation-delay: 0.6s;">
              <router-link to="/books" class="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow-lg hover-lift">
                <i class="fas fa-book-open me-2 text-primary"></i> Tìm Sách Ngay
              </router-link>
              <router-link to="/login" class="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold hover-lift">
                Đăng Nhập
              </router-link>
            </div>
          </div>
          
          <div class="col-lg-6 mt-5 mt-lg-0 text-center position-relative">
            <div class="blob-bg"></div>
            <div class="hero-image-container animate-zoom-in" style="animation-delay: 0.8s;">
               <i class="fas fa-book-reader text-white" style="font-size: 15rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));"></i>
               <div class="floating-card card-1 bg-white p-3 rounded-3 shadow text-dark">
                  <i class="fas fa-check-circle text-success me-2"></i> 10k+ Sách
               </div>
               <div class="floating-card card-2 bg-white p-3 rounded-3 shadow text-dark">
                  <i class="fas fa-user-friends text-primary me-2"></i> 5k+ Độc giả
               </div>
            </div>
          </div>
        </div>
      </div>
      <div class="custom-shape-divider-bottom-1680000000">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
      </div>
    </section>

    <section class="categories-section py-5 bg-light-gray">
      <div class="container">
        <div class="text-center mb-5 scroll-animate fade-in-up">
           <small class="text-primary fw-bold text-uppercase ls-2">Danh Mục</small>
           <h2 class="section-title fw-bold mt-2">Chủ Đề Phổ Biến</h2>
        </div>
        
        <div class="row g-4">
           <div class="col-6 col-md-3 scroll-animate fade-in-up" v-for="(cat, index) in categories" :key="index" :style="{ transitionDelay: `${index * 100}ms` }">
              <div class="category-card bg-white p-4 rounded-4 text-center shadow-hover cursor-pointer h-100">
                  <div class="cat-icon mb-3" :class="cat.colorClass">
                      <i :class="cat.icon"></i>
                  </div>
                  <h6 class="fw-bold text-dark">{{ cat.name }}</h6>
                  <small class="text-muted">{{ cat.count }} cuốn</small>
              </div>
           </div>
        </div>
      </div>
    </section>

    <section class="featured-section py-5 bg-white">
      <div class="container">
         <div class="d-flex justify-content-between align-items-end mb-5 scroll-animate slide-in-left">
            <div>
               <h2 class="fw-bold text-dark mb-1">Sách Mới Cập Nhật</h2>
               <p class="text-muted mb-0">Những cuốn sách vừa được thêm vào kho</p>
            </div>
            <router-link to="/books" class="btn btn-outline-primary rounded-pill fw-bold px-4">Xem Tất Cả</router-link>
         </div>

         <div v-if="loading" class="text-center py-5">
             <div class="spinner-border text-primary" role="status"></div>
         </div>

         <div v-else class="row g-4">
            <div class="col-md-3 col-sm-6" v-for="(book, i) in featuredBooks" :key="book._id">
               <div class="book-card h-100 scroll-animate fade-in-up" :style="{ transitionDelay: `${i * 100}ms` }">
                  <div class="book-cover-wrapper rounded-3 overflow-hidden position-relative mb-3">
                     <img :src="book.HinhAnh || placeholderImage" class="w-100 h-100 object-fit-cover transition-transform" :alt="book.TENSACH">
                     <div class="book-overlay d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-light btn-icon rounded-circle text-primary shadow" title="Xem chi tiết">
                           <i class="fas fa-eye"></i>
                        </button>
                     </div>
                  </div>
                  <div class="book-info">
                     <span class="badge bg-light text-primary border border-primary-subtle mb-2">{{ book.THELOAI || 'Tổng hợp' }}</span>
                     <h6 class="fw-bold text-dark text-truncate mb-1" :title="book.TENSACH">{{ book.TENSACH }}</h6>
                     <p class="text-muted small mb-0">{{ book.TACGIA }}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>

    <section class="process-section py-5 bg-light position-relative overflow-hidden">
       <div class="container position-relative z-2">
          <div class="text-center mb-5 scroll-animate fade-in-up">
             <h2 class="fw-bold text-dark">Quy Trình Mượn Sách</h2>
             <p class="text-muted">Đơn giản, nhanh chóng chỉ với 3 bước</p>
          </div>

          <div class="row g-4 justify-content-center text-center">
             <div class="col-md-4 scroll-animate slide-in-left">
                <div class="step-card">
                   <div class="step-number">1</div>
                   <div class="step-icon bg-primary text-white mb-4 shadow-lg">
                      <i class="fas fa-search"></i>
                   </div>
                   <h5 class="fw-bold">Tìm Kiếm & Đăng Ký</h5>
                   <p class="text-muted">Tìm cuốn sách bạn yêu thích và đăng ký mượn trực tuyến.</p>
                </div>
             </div>
             <div class="col-md-4 scroll-animate fade-in-up">
                <div class="step-card">
                   <div class="step-number">2</div>
                   <div class="step-icon bg-info text-white mb-4 shadow-lg">
                      <i class="fas fa-user-check"></i>
                   </div>
                   <h5 class="fw-bold">Chờ Duyệt & Nhận Sách</h5>
                   <p class="text-muted">Nhân viên sẽ duyệt yêu cầu. Bạn đến thư viện để nhận sách.</p>
                </div>
             </div>
             <div class="col-md-4 scroll-animate slide-in-right">
                <div class="step-card">
                   <div class="step-number">3</div>
                   <div class="step-icon bg-success text-white mb-4 shadow-lg">
                      <i class="fas fa-book-reader"></i>
                   </div>
                   <h5 class="fw-bold">Đọc & Trả Đúng Hạn</h5>
                   <p class="text-muted">Thưởng thức cuốn sách và trả lại đúng hạn để tích điểm uy tín.</p>
                </div>
             </div>
          </div>
       </div>
    </section>

    <section class="stats-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row g-4 text-center">
           <div class="col-6 col-md-3 scroll-animate zoom-in">
              <div class="stat-item">
                 <h2 class="fw-bolder display-4 mb-0">10k+</h2>
                 <p class="opacity-75 text-uppercase ls-1 small">Đầu Sách</p>
              </div>
           </div>
           <div class="col-6 col-md-3 scroll-animate zoom-in" style="transition-delay: 100ms;">
              <div class="stat-item">
                 <h2 class="fw-bolder display-4 mb-0">5k+</h2>
                 <p class="opacity-75 text-uppercase ls-1 small">Thành Viên</p>
              </div>
           </div>
           <div class="col-6 col-md-3 scroll-animate zoom-in" style="transition-delay: 200ms;">
              <div class="stat-item">
                 <h2 class="fw-bolder display-4 mb-0">24/7</h2>
                 <p class="opacity-75 text-uppercase ls-1 small">Hỗ Trợ</p>
              </div>
           </div>
           <div class="col-6 col-md-3 scroll-animate zoom-in" style="transition-delay: 300ms;">
              <div class="stat-item">
                 <h2 class="fw-bolder display-4 mb-0">100%</h2>
                 <p class="opacity-75 text-uppercase ls-1 small">Miễn Phí</p>
              </div>
           </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-white">
       <div class="container">
          <div class="row g-5">
             <div class="col-lg-6 scroll-animate slide-in-left">
                <h4 class="fw-bold mb-4 border-start border-4 border-primary ps-3">Cảm Nhận Độc Giả</h4>
                <div class="card border-0 bg-light p-4 rounded-4 mb-3 position-relative">
                   <i class="fas fa-quote-right position-absolute top-0 end-0 m-3 text-primary opacity-25 fs-1"></i>
                   <p class="fst-italic text-secondary mb-3">"Thư viện có không gian rất tuyệt vời và nguồn sách phong phú. Website giúp tôi tra cứu sách rất nhanh chóng."</p>
                   <div class="d-flex align-items-center">
                      <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style="width: 40px; height: 40px;">A</div>
                      <div>
                         <h6 class="fw-bold mb-0">Nguyễn Văn A</h6>
                         <small class="text-muted">Sinh viên ĐH Cần Thơ</small>
                      </div>
                   </div>
                </div>
                <div class="card border-0 bg-light p-4 rounded-4">
                   <p class="fst-italic text-secondary mb-3">"Quy trình mượn trả rất chuyên nghiệp. Nhân viên thân thiện và hỗ trợ nhiệt tình."</p>
                   <div class="d-flex align-items-center">
                      <div class="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style="width: 40px; height: 40px;">L</div>
                      <div>
                         <h6 class="fw-bold mb-0">Lê Thị Lan</h6>
                         <small class="text-muted">Sinh viên FPT</small>
                      </div>
                   </div>
                </div>
             </div>

             <div class="col-lg-6 scroll-animate slide-in-right">
                <h4 class="fw-bold mb-4 border-start border-4 border-warning ps-3">Tin Tức Mới</h4>
                <div class="list-group list-group-flush">
                   <a href="#" class="list-group-item list-group-item-action border-0 ps-0 py-3 d-flex">
                      <div class="news-date bg-light rounded text-center p-2 me-3" style="width: 60px;">
                         <span class="d-block fw-bold text-primary h5 mb-0">24</span>
                         <small class="text-muted text-uppercase" style="font-size: 10px;">Th12</small>
                      </div>
                      <div>
                         <h6 class="fw-bold mb-1">Thông báo lịch nghỉ Tết Dương Lịch 2025</h6>
                         <p class="text-muted small mb-0 text-truncate-2">Thư viện xin thông báo lịch nghỉ tết dương lịch đến toàn thể độc giả...</p>
                      </div>
                   </a>
                   <a href="#" class="list-group-item list-group-item-action border-0 ps-0 py-3 d-flex">
                      <div class="news-date bg-light rounded text-center p-2 me-3" style="width: 60px;">
                         <span class="d-block fw-bold text-primary h5 mb-0">15</span>
                         <small class="text-muted text-uppercase" style="font-size: 10px;">Th12</small>
                      </div>
                      <div>
                         <h6 class="fw-bold mb-1">Hội sách mùa đông - Giảm giá 50%</h6>
                         <p class="text-muted small mb-0 text-truncate-2">Cơ hội sở hữu những cuốn sách hay với giá ưu đãi chưa từng có...</p>
                      </div>
                   </a>
                   <a href="#" class="list-group-item list-group-item-action border-0 ps-0 py-3 d-flex">
                      <div class="news-date bg-light rounded text-center p-2 me-3" style="width: 60px;">
                         <span class="d-block fw-bold text-primary h5 mb-0">01</span>
                         <small class="text-muted text-uppercase" style="font-size: 10px;">Th12</small>
                      </div>
                      <div>
                         <h6 class="fw-bold mb-1">Về lô sách mới chuyên ngành CNTT</h6>
                         <p class="text-muted small mb-0 text-truncate-2">Cập nhật hơn 100 đầu sách mới về AI, Blockchain và Web Development...</p>
                      </div>
                   </a>
                </div>
             </div>
          </div>
       </div>
    </section>

    <section class="newsletter-section py-5">
       <div class="container">
          <div class="newsletter-box p-5 rounded-4 text-white shadow-lg scroll-animate zoom-in position-relative overflow-hidden">
             <div class="row align-items-center position-relative z-2">
                <div class="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
                   <span class="badge bg-warning text-dark mb-2 rounded-pill px-3 fw-bold">
                      <i class="fas fa-bell me-2"></i>Thông báo mới
                   </span>
                   <h2 class="fw-bold mb-2">Đăng Ký Nhận Tin Tức</h2>
                   <p class="mb-0 opacity-90">Đừng bỏ lỡ những cuốn sách mới nhất và các sự kiện văn hóa đọc hấp dẫn tại thư viện.</p>
                </div>
                <div class="col-lg-6">
                   <form class="input-group input-group-lg shadow-sm" @submit.prevent>
                      <input type="email" class="form-control border-0 ps-4 rounded-start-pill" placeholder="Nhập email của bạn..." required>
                      <button class="btn btn-dark px-4 fw-bold rounded-end-pill" type="submit">
                         Đăng Ký <i class="fas fa-paper-plane ms-2"></i>
                      </button>
                   </form>
                   <div class="text-center text-lg-end mt-2">
                      <small class="opacity-75"><i class="fas fa-shield-alt me-1"></i> Thông tin của bạn được bảo mật 100%</small>
                   </div>
                </div>
             </div>
             
             <div class="deco-circle circle-1"></div>
             <div class="deco-circle circle-2"></div>
          </div>
       </div>
    </section>

    <footer class="bg-dark text-white py-5 border-top border-secondary">
       <div class="container">
          <div class="row gy-4 justify-content-between align-items-center">
             
             <div class="col-md-5 text-center text-md-start">
                <h5 class="fw-bold text-primary mb-2"><i class="fas fa-book-reader me-2"></i>LibManager</h5>
                <p class="text-white-50 small mb-3">Nền tảng quản lý thư viện số hiện đại.</p>
                <div class="d-flex gap-3 justify-content-center justify-content-md-start">
                   <a href="#" class="text-white-50 hover-white"><i class="fab fa-facebook fa-lg"></i></a>
                   <a href="#" class="text-white-50 hover-white"><i class="fab fa-twitter fa-lg"></i></a>
                   <a href="#" class="text-white-50 hover-white"><i class="fab fa-instagram fa-lg"></i></a>
                </div>
             </div>

             <div class="col-md-6 d-flex justify-content-center justify-content-md-end">
                <div class="p-3 border border-secondary rounded-3 bg-secondary bg-opacity-10 text-start" style="min-width: 320px;">
                    <h6 class="text-uppercase fw-bold text-warning mb-3 border-bottom border-secondary pb-2">
                        <i class="fas fa-user-graduate me-2"></i>Thông Tin Sinh Viên
                    </h6>
                    <ul class="list-unstyled text-white mb-0">
                       <li class="mb-2">
                          <span class="text-white-50 me-2">Họ và Tên:</span> 
                          <span class="fw-bold">Lâm Khánh Nhả</span>
                       </li>
                       <li class="mb-2">
                          <span class="text-white-50 me-2">MSSV:</span> 
                          <span>B2303836</span>
                       </li>
                       <li>
                          <span class="text-white-50 me-2">Chuyên ngành:</span> 
                          <span>Kĩ thuật phần mềm K49</span>
                       </li>
                    </ul>
                </div>
             </div>
          </div>

          <hr class="border-secondary opacity-25 my-4">
          
          <div class="text-center">
             <p class="small text-white-50 mb-0">&copy; 2025 LibManager - Student Project.</p>
          </div>
       </div>
    </footer>

  </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
  name: "HomePage",
  data() {
    return {
      featuredBooks: [],
      loading: true,
      placeholderImage: "https://via.placeholder.com/200x300?text=No+Image",
      categories: [
         { name: "Văn Học", count: 120, icon: "fas fa-feather-alt", colorClass: "text-danger bg-danger-subtle" },
         { name: "Kinh Tế", count: 85, icon: "fas fa-chart-line", colorClass: "text-success bg-success-subtle" },
         { name: "Công Nghệ", count: 64, icon: "fas fa-laptop-code", colorClass: "text-primary bg-primary-subtle" },
         { name: "Thiếu Nhi", count: 90, icon: "fas fa-child", colorClass: "text-warning bg-warning-subtle" },
      ]
    };
  },
  methods: {
    async fetchFeaturedBooks() {
       this.loading = true;
       try {
          const res = await SachService.getAll();
          this.featuredBooks = res.data.slice(0, 4); 
       } catch (error) {
          console.error(error);
       } finally {
          this.loading = false;
       }
    },
    setupIntersectionObserver() {
       const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
             if (entry.isIntersecting) {
                entry.target.classList.add('show');
             }
          });
       }, { threshold: 0.1 });

       const elements = document.querySelectorAll('.scroll-animate');
       elements.forEach(el => observer.observe(el));
    }
  },
  mounted() {
     this.fetchFeaturedBooks();
     setTimeout(() => {
        this.setupIntersectionObserver();
     }, 100);
  }
};
</script>

<style scoped>
/* CSS giữ nguyên như cũ */
.home-page {
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
}

/* --- 1. HERO SECTION --- */
.hero-section {
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

.custom-shape-divider-bottom-1680000000 {
    position: absolute;
    bottom: 0; left: 0; width: 100%;
    overflow: hidden;
    line-height: 0;
}
.custom-shape-divider-bottom-1680000000 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 80px;
}
.custom-shape-divider-bottom-1680000000 .shape-fill {
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

/* --- 2. ANIMATION CLASSES --- */
.scroll-animate {
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.scroll-animate.show {
    opacity: 1;
}

/* Slide In Left */
.slide-in-left { transform: translateX(-50px); }
.slide-in-left.show { transform: translateX(0); }

/* Slide In Right */
.slide-in-right { transform: translateX(50px); }
.slide-in-right.show { transform: translateX(0); }

/* Fade In Up */
.fade-in-up { transform: translateY(50px); }
.fade-in-up.show { transform: translateY(0); }

/* Zoom In */
.zoom-in { transform: scale(0.8); }
.zoom-in.show { transform: scale(1); }

/* Initial Load Animations */
.animate-slide-in-left { animation: slideInLeft 1s forwards; opacity: 0; }
.animate-slide-in-right { animation: slideInRight 1s forwards; opacity: 0; }
.animate-fade-in-up { animation: fadeInUp 1s forwards; opacity: 0; }
.animate-fade-in-down { animation: fadeInDown 1s forwards; opacity: 0; }
.animate-zoom-in { animation: zoomIn 1s forwards; opacity: 0; }

@keyframes slideInLeft { from { opacity: 0; transform: translateX(-100px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }

/* --- 3. COMPONENTS --- */
.bg-light-gray { background-color: #f3f6f9; }
.ls-2 { letter-spacing: 2px; }

.category-card { transition: transform 0.3s; border: 1px solid rgba(0,0,0,0.05); }
.category-card:hover { transform: translateY(-10px); }
.cat-icon {
    width: 60px; height: 60px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; font-size: 1.5rem;
}

.book-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #eef2f6;
    padding: 12px;
    transition: all 0.3s;
}
.book-card:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.08); transform: translateY(-5px); }
.book-cover-wrapper { height: 300px; position: relative; }
.book-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    opacity: 0; transition: opacity 0.3s;
}
.book-card:hover .book-overlay { opacity: 1; }
.btn-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
.btn-icon:hover { transform: scale(1.1); }

.step-card {
    background: white; padding: 40px 20px; border-radius: 16px;
    position: relative; border: 1px solid #eef2f6; transition: transform 0.3s;
}
.step-card:hover { transform: translateY(-10px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.step-number {
    position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
    width: 40px; height: 40px; background: #1e293b; color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-weight: bold; border: 4px solid #f8f9fa;
}
.step-icon {
    width: 70px; height: 70px; margin: 0 auto; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
}

/* Newsletter Box */
.newsletter-box {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
}

.deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
}
.circle-1 {
    width: 300px; height: 300px;
    top: -100px; right: -50px;
}
.circle-2 {
    width: 200px; height: 200px;
    bottom: -50px; left: -50px;
}

.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
.hover-scale:hover { transform: scale(1.05); }
.hover-white:hover { color: white !important; }
</style>