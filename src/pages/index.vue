<script setup lang="ts">
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import BoardCard from "@/components/BoardCard.vue";
import { getAllBoards, boardCreate } from "@/graphql/boards";
import { computed } from "vue";
import useAlert from "@/composables/useAlert";
const alert = useAlert();
const router = useRouter();

// Boards List
const { result, loading, onError } = useQuery(getAllBoards);
onError(() => alert.danger("Error loading boards"));
const boards = computed(() => result.value?.boardsList?.items || []);

// Board Create
const {
  mutate: createBoard,
  onDone: onBoardCreated,
  onError: onBoardError,
  loading: creatingBoard,
} = useMutation(boardCreate);
onBoardCreated((res) => {
  router.push(`/boards/${res.data.boardCreate.id}?new=1`);
});
onBoardError(() => alert.danger("Error creating board"));
const newBoardTemplate = {
  title: "My New Board",
  order: JSON.stringify([
    {
      uid: "1",
      title: "Backlog",
      taskUids: [],
    },
  ]),
};
</script>

<template>
  <div v-if="!loading">
    <h1 class="text-3xl mt-10 p-5">Boards</h1>
    <div class="flex">
      <BoardCard v-for="board in boards" :key="board.id" :board="board" />

      <button class="text-gray-500" @click="createBoard(newBoardTemplate)">
        <span v-if="creatingBoard">Creating...</span>
        <span v-else>New Board +</span>
      </button>
    </div>
  </div>
  <AppLoader v-if="loading" />
</template>
