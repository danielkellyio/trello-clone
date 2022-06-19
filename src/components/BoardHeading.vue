<script setup lang="ts">
import type { Board, Uid } from "@/types";
defineProps<{
  board: Board;
}>();
const emit = defineEmits<{
  (e: "update", payload: { title: string }): void;
  (e: "delete", payload: { id: Uid }): void;
}>();

function handleUpdate(event: Event) {
  const input = event.target as HTMLInputElement;
  const title = input.value;
  emit("update", { title });
  input.blur();
}
</script>
<template>
  <div class="mt-10 p-5">
    <input
      ref="boardTitle"
      type="text"
      class="text-3xl w-full"
      :value="board.title"
      @keydown.enter="handleUpdate"
      @blur="handleUpdate"
    />
    <br />
    <RouterLink to="/" class="text-blue-500">←Back</RouterLink>
    |
    <button class="text-red-500" @click="emit('delete', { id: board.id })">
      Delete
    </button>
  </div>
</template>
