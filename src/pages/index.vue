<script setup lang="ts">
import { ref } from "vue";
import { useBoardsStore } from "@/stores/BoardsStore";
const boardStore = useBoardsStore();
boardStore.initBoards();
</script>

<template>
  <div>
    <router-link
      v-for="board in boardStore.boards"
      :key="board.uid"
      :to="`/better/${board.uid}`"
      class="text-lg"
    >
      {{ board.attributes.name }}
    </router-link>
  </div>
</template>

<style scoped></style>
