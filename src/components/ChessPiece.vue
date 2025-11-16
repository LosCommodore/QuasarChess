<template>
  <img :src="figure_svg" style="width: 80px; height: 80px; z-index: 1" draggable />
</template>

<script setup lang="ts">
import type { Piece } from 'src/logic/chess/chess';
import { computed } from 'vue';
const props = defineProps<{
  piece: Piece;
}>();

const figure_svg = computed(() => {
  const map = props.piece.color == 'b' ? figure_mapping_black : figure_mapping_white;
  return map[props.piece.type] as string;
});

const figure_mapping_black: Record<string, string> = {
  k: '/figures/king.svg',
  q: '/figures/queen.svg',
  r: '/figures/rook.svg',
  b: '/figures/bishop.svg',
  n: '/figures/knight.svg',
  p: '/figures/pawn.svg',
};

const figure_mapping_white: Record<string, string> = {
  k: '/figures/king_white.svg',
  q: '/figures/queen_white.svg',
  r: '/figures/rook_white.svg',
  b: '/figures/bishop_white.svg',
  n: '/figures/knight_white.svg',
  p: '/figures/pawn_white.svg',
};
</script>
