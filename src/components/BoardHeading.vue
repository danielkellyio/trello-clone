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
  <input
    ref="boardTitle"
    type="text"
    class="text-3xl w-full"
    :value="board.title"
    @keydown.enter="handleUpdate"
    @blur="handleUpdate"
  />
</template>
