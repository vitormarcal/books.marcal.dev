<script setup lang="ts">
const route = useRoute()

const {data} = await useAsyncData(route.path, () => queryContent()
    .where({
      _path: route.path,
    })
    .findOne())

const bookStore = useBookStore()
onMounted(async () => {
  await bookStore.setHeaderQuote(data.value?.quote)
})

</script>

<template>
  <book-review :data="data"/>
</template>

<style scoped>

</style>