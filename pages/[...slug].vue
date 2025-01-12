<script setup lang="ts">
const route = useRoute()

const {data} = await useAsyncData(route.path, () => queryContent()
    .where({
      _path: route.path,
    })
    .findOne())

</script>

<template>
  <book-review :data="data"/>
</template>

<style scoped>

</style>