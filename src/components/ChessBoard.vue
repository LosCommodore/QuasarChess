<template>
  <div class="row">
    <q-btn label="click me" @click="click_me"></q-btn>
  </div>
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

        <ChessPiece
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
</template>

<script setup lang="ts">
import ChessPiece from 'components/ChessPiece.vue';
import type { Piece } from 'src/logic/chess/chess';
const get_color = (row: number, col: number): boolean => {
  const uneven_row = row % 2;
  const is_black = Boolean((col + uneven_row) % 2);
  return is_black;
};

const click_me = () => {
  const row = board.value.board[5];
  if (!row) {
    return;
  }
  row[5] = 'r';
};

const get_piece = (row: number, col: number): Piece => {
  const value = board.value?.board[row]?.[col];
  return value ?? '';
};

import { ref } from 'vue';
import { Board } from 'src/logic/chess/chess';

const board = ref<Board>(new Board());

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
