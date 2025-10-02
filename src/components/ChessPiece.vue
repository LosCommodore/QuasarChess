<template>
  <q-img
    :src="figure_mapping[props.piece.type]"
    style="width: 80px; height: 80px; z-index: 1"
    draggable
  />
</template>

<script setup lang="ts">
import type { Piece } from 'src/logic/chess/chess';

const props = defineProps<{
  piece: Piece;
}>();

const figure_mapping: Record<string, string> = {
  k: '/figures/king.svg',
  q: '/figures/queen.svg',
  r: '/figures/rook.svg',
  b: '/figures/bishop.svg',
  n: '/figures/knight.svg',
  p: '/figures/pawn.svg',
};
</script>
