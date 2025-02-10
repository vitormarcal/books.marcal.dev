<script setup lang="ts">

const book = useBookStore()
</script>

<template>
  <header>
    <h1>Leituras do Vítor</h1>
    <client-only>
      <p class="quote">{{book.quote}}</p>
    </client-only>
    <img v-if="false" src="https://via.placeholder.com/60x60" alt="Ícone de livro" class="floating-book">
  </header>
</template>

<style scoped>

</style>