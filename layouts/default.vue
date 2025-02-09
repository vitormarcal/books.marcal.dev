<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'pt-BR',
    class: 'book-tracker'
  },
  bodyAttrs: {
    class: 'book-tracker',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})
</script>

<template>
<main>
  <header-site />
  <slot />
</main>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

body.book-tracker {
  --blockquote-border-color: var(--dominant-color);
  --blockquote-padding-left: 0;


  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f3e9;
  color: #333;

  header {
    background-color: var(--dominant-color);
    color: #fff;
    padding: 40px 10px;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }

  header {
    background-color: var(--dominant-color);
    color: #fff;
    padding: 40px 10px;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }
  header h1 {
    animation: fadeIn 4s ease-in-out;
  }
  header .quote {
    margin-top: 20px;
    font-size: 1.2rem;
    font-style: italic;
    animation: fadeIn 4s ease-in-out;
  }
  header .floating-book {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 60px;
    animation: bounce 4s infinite;
  }

  .book-tracker-container {
    max-width: 800px;
    margin: 30px auto;
    background: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

}
</style>