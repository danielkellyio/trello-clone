<script setup lang="ts">
import { useRouter } from "vue-router";
import { useBoardsStore } from "@/stores/BoardsStore";
import BoardCard from "@/components/BoardCard.vue";
const boardStore = useBoardsStore();
const router = useRouter();
boardStore.initBoards();

async function createNewBoard() {
  const board = await boardStore.createNew();
  router.push(`/boards/${board.uid}?new=1`);
}
</script>

<template>
  <div v-if="boardStore.loaded">
    <h1 class="text-3xl mt-10 p-5">Boards</h1>
    <div class="flex">
      <BoardCard
        v-for="board in boardStore.boards"
        :key="board.uid"
        :board="board"
      />

      <button class="text-gray-500" @click="createNewBoard">New Board +</button>
    </div>
  </div>
  <div v-if="!boardStore.loaded">Loading...</div>
</template>

<style scoped></style>
