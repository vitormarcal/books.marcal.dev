<script setup lang="ts">
const posts = await queryContent()
    .where({ tags: { $contains: 'livros' }, _partial: false })
    .sort({ created_at: -1 })
    .without(['body'])
    .find();


const loadedImages = ref<string[]>([]);

// Marca uma imagem como carregada
const markImageLoaded = (key: string) => {
  if (!loadedImages.value.includes(key)) {
    loadedImages.value.push(key);
  }
};

// Verifica se a imagem já foi carregada
const imageLoaded = (key: string) => loadedImages.value.includes(key);

onMounted(() => {
  // Configura o IntersectionObserver
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        observer.unobserve(img); // Para de observar a imagem após carregar
      }
    });
  });

  // Adiciona todas as imagens para observação
  const lazyImages = document.querySelectorAll('.lazy-image');
  lazyImages.forEach((img) => observer.observe(img));
});
</script>

<template>
  <div class="book-tracker-container">
    <h2>📚 Livros Lidos ({{ posts.length }})</h2>
    <ul v-if="posts.length" class="book-list">
      <li v-for="post in posts" :key="post._path" class="book-item">
        <div class="image-container">
          <!-- Placeholder enquanto a imagem não foi carregada -->
          <div v-if="!imageLoaded(post._path)" class="image-placeholder"></div>

          <!-- Imagem real -->
          <img
              :data-src="post.image"
              alt="Capa do livro"
              class="lazy-image"
              @load="markImageLoaded(post._path)"
          />
        </div>
        <div class="book-info">
          <h2 class="book-title">{{ post.title }}</h2>
          <p class="book-author">Autor(es): <span>{{ post.book_author.join(", ") }}</span></p>
          <a :href="post._path" class="details-link">Ver detalhes</a>
        </div>
      </li>
    </ul>
    <div v-else class="no-books">
      Nenhum livro encontrado.
    </div>
  </div>
</template>




<style scoped>
.book-tracker-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
}

.book-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 10px;
  border-bottom: 1px solid #ddd;
  transition: background 0.3s ease;
}

.book-item:hover {
  background: #f0f0f0;
  border-radius: 5px;
}

.image-container {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 90px; /* Proporção de capa */
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.lazy-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image[src] {
  opacity: 1;
}

.book-info {
  flex: 1;
}

.book-title {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.book-author {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #666;
}

.book-author span {
  color: #444;
}

.details-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.9em;
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.details-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.no-books {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
</style>
