<template>
  <q-page padding>
    <div class="row">
      <q-btn label="click me" @click="click_me"></q-btn>
    </div>
    <div class="row">
      <div class="my-grid">
        <template v-for="y in 8">
          <template v-for="x in 8" :key="'cell' + x + y">
            <div
              :class="get_color(x, y) ? 'bg-blue' : 'bg-brown'"
              :style="{
                'grid-row-start': y,
                'grid-row-end': y + 1,
                'grid-column-start': x,
                'grid-column-end': x + 1,
              }"
            ></div>

            <FigureComponent
              figure="r"
              v-if="get_piece(y, x)"
              :style="{
                'grid-row-start': y,
                'grid-row-end': y + 1,
                'grid-column-start': x,
                'grid-column-end': x + 1,
              }"
            />
          </template>
        </template>
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

const click_me = () => {
  const row = board.value[5];
  if (!row) {
    return;
  }
  row[5] = 42;
};

const get_piece = (row: number, col: number): number => {
  const value = board.value[row]?.[col];
  return value ?? 0;
};

import FigureComponent from 'src/components/FigureComponent.vue';
import { ref } from 'vue';

const b = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0));
const board = ref<number[][]>(b);

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
