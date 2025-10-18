<template>
  <div class="row">
    <q-btn label="click me" @click="click_me"></q-btn>
    <q-btn label="move" @click="move"></q-btn>
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
          @drop="handle_drop"
          @dragover.prevent
        ></div>
      </template>
    </template>

    <ChessPiece
      v-for="[pos, piece] in board"
      :key="pos[0] + pos[1]"
      :piece="piece"
      :style="{
        'grid-row-start': pos[0],
        'grid-row-end': pos[0] + 1,
        'grid-column-start': pos[1],
        'grid-column-end': pos[1] + 1,
      }"
      :board_pos="pos"
      @dragstart="onDragStart"
    />
  </div>
</template>

<script setup lang="ts">
import ChessPiece from 'components/ChessPiece.vue';
import { ref } from 'vue';
import type { Position } from 'src/logic/chess/chess';
import type { Piece } from 'src/logic/chess/chess';

const board = ref<[Position, Piece][]>([]);

const get_color = (row: number, col: number): boolean => {
  const uneven_row = row % 2;
  const is_black = Boolean((col + uneven_row) % 2);
  return is_black;
};

const click_me = () => {
  const new_piece: Piece = { type: 'k', color: 'b' };
  board.value.push([[4, 3], new_piece]);
};

const move = () => {
  const pos = board.value[0];
  console.log(pos);
  if (!pos) return;

  pos[0] = [2, 2];
};

const onDragStart = (event: DragEvent) => {
  console.log(event);
  const target = event.currentTarget as HTMLElement;
  const draggedId = target.id;
  const boardPos = target.getAttribute('board_pos') ?? '';

  event.dataTransfer?.setData('text/plain', boardPos);
  console.log('Dragged element ID:', draggedId);
};

const handle_drop = (event: DragEvent) => {
  console.log('enter handle drop');
  console.log(event);

  const value = event.dataTransfer?.getData('text/plain');
  if (!value) return;

  const source_pos = eval('[' + value + ']');
  if (value) {
    console.log('source_pos: ', value);
    console.log('source_pos: ', source_pos);
  }

  const target = event.currentTarget as HTMLElement;
  const x = Number(target.style.getPropertyValue('grid-row-start')) - 1;
  const y = Number(target.style.getPropertyValue('grid-column-start')) - 1;

  const entries = board.value.entries();
  for (const [i, v] of entries) {
    if (v[0][0] == source_pos[0] && v[0][1] == source_pos[1]) {
      console.log('found it!');
      board.value[i] = [[x + 1, y + 1], v[1]];
      break;
    }
  }

  //const _ = [x, y];
  console.log(x, y);
};
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
