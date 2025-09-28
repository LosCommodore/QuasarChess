<template>
  <q-img :src="figure_mapping[props.figure]" style="width: 80px; height: 80px; z-index: 1" />
</template>

<script setup lang="ts">
const props = defineProps({
  figure: { type: String, required: true },
});

const figure_mapping: Record<string, string> = {
  k: '/figures/king.svg',
  q: '/figures/queen.svg',
  r: '/figures/rook.svg',
  b: '/figures/bishop.svg',
  n: '/figures/knight.svg',
  p: '/figures/pawn.svg',
};
</script>
