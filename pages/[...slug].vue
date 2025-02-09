<script setup lang="ts">
const route = useRoute()
const bookStore = useBookStore();

const {data} = await useAsyncData(route.path, () => queryContent()
    .where({
      _path: route.path,
    })
    .findOne())

watchEffect(() => {
  if (data.value) {
    bookStore.dominantColor = data.value.dominant_color;
    bookStore.quote = data.value.quote;
  }
});

onMounted(() => {
  watchEffect(() => {
    document.documentElement.style.setProperty("--dominant-color", bookStore.dominantColor);
  });
});

</script>

<template>
  <book-review :data="data"/>
</template>

<style scoped>

</style>