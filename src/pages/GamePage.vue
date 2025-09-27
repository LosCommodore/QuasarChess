<template>
  <q-page padding>
    <div class="row">
      <div class="my-grid">
        <div v-for="n in 64" :key="n" :class="{ 'bg-black': get_color(n - 1) }"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const get_color = (cell: number): boolean => {
  const col = cell % 8;
  const row = Math.floor(cell / 8);
  const uneven_row = row % 2;
  const is_black = Boolean((col + uneven_row) % 2);
  return is_black;
};
//
</script>

<style scoped>
.my-grid {
  display: grid;
  grid-template-columns: repeat(8, 80px);
  grid-template-rows: repeat(8, 80px);
  gap: 0px;
  border: 2px solid;
}
</style>
