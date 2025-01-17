<script setup lang="ts">

import {formatDate} from "~/utils/date-utils";
import is from "@sindresorhus/is";
const props = defineProps(['data'])

const readingStatus = computed(() => {
  if (props.data) {
    if (props.data.reading_status == 'completed') return "Finalizada"
    if (props.data.reading_status == 'abandoned') return "Abandonada"
    return "Lendo"
  }
})

const dateRead = computed(() => {
  if (props.data) {
    const date =  props.data.date_read || props.data.updated_at || props.data.created_at
    return formatDate(date)
  }
})


const feedbackValue = computed<'gostei' | 'neutro' | 'não gostei' | ''>(() => props.data?.feedback[0] || '');
const feedback = computed(() => {
  const feedbackMap: Record<'gostei' | 'neutro' | 'não gostei', { feedbackClass: string, text: string }> = {
    'gostei': {feedbackClass: 'liked', text: "Gostei 😊"},
    'neutro': {feedbackClass: 'neutral', text: "Neutro 🤔"},
    'não gostei': {feedbackClass: 'not-liked', text: "Não gostei 😞"}
  };
  return feedbackMap[feedbackValue.value as 'gostei' | 'neutro' | 'não gostei'] || {
    feedbackClass: 'not-evaluated',
    text: "Não avaliado"
  };
});
</script>

<template>
  <main>

    <div v-if="data" class="book-tracker-container">

      <div class="book-header">
        <img :src="data.image" alt="Capa do livro">
        <div class="book-info">
          <h1>{{ data.title }}</h1>
          <p><strong>Autor(es):</strong> {{ data.book_author.join(", ") }}</p>
          <p><strong>Data de leitura:</strong> {{ dateRead }}</p>
          <p><strong>Status data leitura:</strong> {{ readingStatus }}</p>
          <p><strong>Avaliação:</strong> <span :class="feedback.feedbackClass">{{ feedback.text }}</span></p>
          <p><strong>ISBN:</strong> {{ data.isbn || '--' }}</p>
          <p><strong>Páginas:</strong> {{ data.page_number || '--' }}</p>
          <p><strong>Gêneros:</strong><br/>
            <span class="badge" v-for="genre in data.genre">{{ genre }}</span>
          </p>
        </div>
      </div>

      <div class="review-section">
        <h2>Minha Review</h2>
        <ContentRenderer :value="data"/>
      </div>

      <div class="author-section" v-if="false">
        <h2>Sobre o Autor</h2>
        <p>Buronson é um renomado escritor de mangás, conhecido por suas histórias cativantes e impactantes. Tetsuo Hara,
          co-autor, é um dos ilustradores mais icônicos do Japão, famoso por seu traço detalhado e expressivo.</p>
      </div>
      <div class="related-section" v-if="false">
        <h2>Outros Livros Relacionados</h2>
        <div class="related-books">
          <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 1">
          <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 2">
          <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 3">
        </div>
      </div>


      <NuxtLink to="/" class="back-link">Ver lista de livros lidos</NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.book-tracker-container {
  .book-header {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
  }

  .book-header img {
    width: 100%;
    max-width: 180px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
  }

  .book-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .book-info h1 {
    margin: 0 0 10px;
    font-size: 1.8rem;
    color: #6c4a4a;
    text-align: center;
  }

  .book-info p {
    margin: 5px 0;
    font-size: 1rem;
    line-height: 1.6;
  }


  .details-grid p {
    margin: 0;
    font-size: 1rem;
  }

  .badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
    margin: 2px;
    background-color: #f0e6d2;
    color: #6c4a4a;
  }

  .review-section {
    margin-top: 30px;
  }

  .review-section h2 {
    margin-bottom: 10px;
  }

  .review-section:deep() p {
    font-size: 1rem;
    line-height: 1.6;
    background-color: #f9f8f5;
    padding: 15px;
    margin: 1rem 0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .related-section,
  .author-section {
    margin-top: 30px;
  }

  .related-section h2,
  .author-section h2 {
    margin-bottom: 10px;
    color: #6c4a4a;
  }

  .related-books {
    display: flex;
    gap: 20px;
    overflow-x: auto;
  }

  .related-books img {
    width: 120px;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }

  .related-books img:hover {
    transform: scale(1.1);
  }

  .author-section p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .back-link {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    width: 100%;
  }

  .back-link:hover {
    text-decoration: underline;
  }
}

/* Media Query for smaller screens */
@media (max-width: 768px) {
  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .book-info {
    gap: 15px;
  }

  .book-info h1 {
    font-size: 1.5rem;
  }

  .book-info p {
    font-size: 0.9rem;
  }
}

/* to hide feature image from markdown files (when img is the first content) */
.review-section:deep() div p:first-of-type:has(img) {
  display: none;
}
</style>