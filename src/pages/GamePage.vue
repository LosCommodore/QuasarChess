<template>
  <q-page padding>
    <div class="row">
      <div class="my-grid">
        <template v-for="y in 8">
          <div
            v-for="x in 8"
            :key="'cell' + x + y"
            :class="get_color(x, y) ? 'bg-blue' : 'bg-brown'"
            :style="{
              'grid-row-start': y,
              'grid-row-end': y + 1,
              'grid-column-start': x,
              'grid-column-end': x + 1,
            }"
          ></div>
        </template>

        <q-img
          src="/figures/king.svg"
          style="width: 80px; height: 80px; grid-area: 4/4/5/5; z-index: 1"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const get_color = (row: number, col: number): boolean => {
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
