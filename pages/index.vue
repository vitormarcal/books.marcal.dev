<script setup lang="ts">
const posts = await queryContent()
    .where({tags: {$contains: 'livros'}, _partial: false})
    .sort({created_at: -1})
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

const currentlyReadingPosts = computed(() => {
  return posts.filter(post => {
    return post.reading_status[0] == 'reading';
  });
});

const groupedByYear = computed(() => {
  return posts
      .filter(post => post.reading_status[0] !== 'reading')
      .reduce((groups, post) => {
        const year = new Date(post.date_read || post.updated_at || post.created_at).getFullYear();
        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(post);
        return groups;
      }, {} as Record<number, typeof posts>);
});

const groupedYearsArray = computed(() => {
  return Object.entries(groupedByYear.value)
      .sort((a, b) => Number(b[0]) - Number(a[0]));
});

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

    <div v-if="currentlyReadingPosts.length" class="reading-now-section">
      <h2>📖 Lendo agora ({{ currentlyReadingPosts.length }})</h2>
      <div class="year-separator">
        <span class="separator-icon">🔖</span>
      </div>
      <ul class="book-list">
        <li v-for="book in currentlyReadingPosts" :key="book._path" class="book-item">
          <div class="image-container">
            <div v-if="!imageLoaded(book._path)" class="image-placeholder"></div>
            <img
                :data-src="book.image"
                alt="Capa do livro"
                class="lazy-image"
                @load="markImageLoaded(book._path)"
            />
          </div>
          <div class="book-info">
            <h2 class="book-title">{{ book.title }}</h2>
            <p class="book-author">Autor(es): <span>{{ book.book_author.join(", ") }}</span></p>
            <a :href="book._path" class="details-link">Ver detalhes</a>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="groupedYearsArray.length" class="year-group">
      <h2>📚 Livros Lidos ({{ posts.length }})</h2>

      <div class="year-separator">
        <span class="separator-icon">🏆</span>
      </div>
      <div v-for="([year, books], index) in groupedYearsArray" :key="year" class="year-section">
        <h2 class="year-title">{{ year }} ({{ books.length }})</h2>
        <ul class="book-list">
          <li v-for="book in books" :key="book._path" class="book-item">
            <div class="image-container">
              <div v-if="!imageLoaded(book._path)" class="image-placeholder"></div>
              <img
                  :data-src="book.image"
                  alt="Capa do livro"
                  class="lazy-image"
                  @load="markImageLoaded(book._path)"
              />
            </div>
            <div class="book-info">
              <h2 class="book-title">{{ book.title }}</h2>
              <p class="book-author">Autor(es): <span>{{ book.book_author.join(", ") }}</span></p>
              <a :href="book._path" class="details-link">Ver detalhes</a>
            </div>
          </li>
        </ul>
        <!-- Ícone separador entre anos -->
        <div v-if="index < groupedYearsArray.length - 1" class="year-separator">
          <span class="separator-icon">🏆</span>
        </div>
      </div>
    </div>
    <div v-else class="no-books">
      Nenhum livro encontrado.
    </div>
  </div>
</template>


<style scoped>
.book-tracker-container {
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
    color: var(--link_color);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .details-link:hover {
    color: var(--link_color_hover);
    text-decoration: underline;
  }

  .details-link:visited {
    color: #374f87;
    text-decoration: underline;
  }

  .no-books {
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #666;
  }

  .year-title {
    font-size: 1.5em;
    color: #444;
    text-align: left;
    margin: 20px 0 10px;
    position: relative;
  }

  .year-title::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, var(--link_color), var(--link_color_hover));
    border-radius: 5px;
  }

  .year-title::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 55px;
    width: calc(100% - 55px);
    height: 1px;
    background: #ddd;
  }

  .year-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }

  .separator-icon {
    font-size: 2em;
    color: var(--link_color);
    background: #fff;
    border: 2px solid var(--link_color);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .reading-now-section {
    margin-bottom: 40px;
  }

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
