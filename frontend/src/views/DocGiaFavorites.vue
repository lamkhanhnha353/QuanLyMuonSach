<template>
  <div class="favorites-page">
    <div class="container-fluid px-3">
      <div class="favorites-container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="page-title">Danh sách yêu thích</h1>
          <span class="badge bg-primary">{{ favorites.length }} sách</span>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="favorites.length === 0" class="text-center py-5">
          <i class="fas fa-heart-broken text-muted" style="font-size: 4rem;"></i>
          <h4 class="mt-3 text-muted">Chưa có sách yêu thích</h4>
          <p class="text-muted">Hãy khám phá và thêm sách vào danh sách yêu thích của bạn!</p>
          <router-link to="/books" class="btn btn-primary">
            <i class="fas fa-search me-2"></i> Khám phá sách
          </router-link>
        </div>

        <div v-else class="row g-4">
          <transition-group name="book-fade">
            <div v-for="book in favorites" :key="book._id" class="col-lg-3 col-md-4 col-sm-6">
              <div class="book-card">
                <div class="book-cover">
                  <img
                    :src="book.HinhAnh || placeholderImage"
                    :alt="book.TENSACH"
                    class="book-image"
                    @error="onImgError"
                  >
                  <div class="book-overlay">
                    <button
                      class="btn btn-danger btn-sm favorite-btn"
                      @click="removeFavorite(book._id)"
                      :disabled="removing === book._id"
                    >
                      <i class="fas fa-heart-broken me-1"></i>
                      {{ removing === book._id ? 'Đang xóa...' : 'Xóa yêu thích' }}
                    </button>
                  </div>
                </div>
                <div class="book-info">
                  <h6 class="book-title">{{ book.TENSACH }}</h6>
                  <p class="book-author">bởi {{ book.TACGIA || 'Không rõ' }}</p>
                  <p class="book-status" :class="book.SOQUYEN > 0 ? 'text-success' : 'text-danger'">
                    {{ book.SOQUYEN > 0 ? 'Còn sách' : 'Hết sách' }}
                  </p>
                  <router-link :to="`/books/${book._id}`" class="btn btn-outline-primary btn-sm w-100">
                    <i class="fas fa-eye me-1"></i> Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import DocGiaService from "@/services/docgia.service";
import AuthService from "@/services/auth.service";

export default {
  name: "DocGiaFavorites",
  data() {
    return {
      favorites: [],
      loading: true,
      removing: null,
      placeholderImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg==",
    };
  },
  methods: {
    async fetchFavorites() {
      try {
        this.loading = true;
        const user = AuthService.getCurrentUser();
        if (!user) {
          this.$router.push('/login');
          return;
        }

        const response = await DocGiaService.getFavorites(user._id);
        const favoriteIds = response.data || [];

        if (favoriteIds && Array.isArray(favoriteIds) && favoriteIds.length > 0) {
          // Filter out invalid IDs (empty strings, null, undefined)
          const validIds = favoriteIds.filter(id => id && typeof id === 'string' && id.trim() !== '');

          if (validIds.length > 0) {
            const bookPromises = validIds.map(id => SachService.get(id));
            const bookResults = await Promise.allSettled(bookPromises);

            // Only include successfully fetched books
            this.favorites = bookResults
              .filter(result => result.status === 'fulfilled')
              .map(result => result.value.data || result.value);
          } else {
            this.favorites = [];
          }
        } else {
          this.favorites = [];
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        this.favorites = [];
      } finally {
        this.loading = false;
      }
    },

    async removeFavorite(bookId) {
      if (this.removing) return;

      let success = false;
      let bookTitle = "sách";

      try {
        this.removing = bookId;
        const user = AuthService.getCurrentUser();
        if (!user) {
          this.$router.push('/login');
          return;
        }

        const bookToRemove = this.favorites.find(book => book._id === bookId);
        bookTitle = bookToRemove ? bookToRemove.TENSACH : "sách";

        const response = await DocGiaService.removeFavorite(user._id, bookId);

        if (response.status >= 200 && response.status < 300) {
          success = true;
          alert(`Đã xóa "${bookTitle}" khỏi danh sách yêu thích!`);
        } else {
          throw new Error(response.data?.message || "Không thể xóa sách");
        }
      } catch (error) {
        let errorMsg = "Không thể xóa sách. Vui lòng thử lại!";
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        alert(errorMsg);
      } finally {
        this.removing = null;
        // Always refresh the favorites list to ensure UI is up to date
        await this.fetchFavorites();
      }
    },

    onImgError(e) {
      e.target.src = this.placeholderImage;
    }
  },

  mounted() {
    this.fetchFavorites();
  }
};
</script>

<style scoped>
.favorites-page {
  background-color: #f5f6f7;
  min-height: 100vh;
}

.favorites-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0;
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.book-cover {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.favorite-btn {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.book-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.book-status {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.book-fade-enter-active,
.book-fade-leave-active {
  transition: all 0.5s ease;
}

.book-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.book-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(-50px);
}

.book-fade-move {
  transition: transform 0.5s ease;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .book-card {
    margin-bottom: 1rem;
  }
}
</style>
