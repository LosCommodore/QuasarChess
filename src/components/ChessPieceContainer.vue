<template>
  <q-list>
    <q-item v-for="piece in black_pieces" :key="piece.id">
      <ChessPiece :piece class="bg-grey"></ChessPiece>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import ChessPiece from 'components/ChessPiece.vue';
import { pieces } from 'src/logic/chess/chess';

const black_pieces = Object.values(pieces).filter((x) => x.color == 'b');
</script>
