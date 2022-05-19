<script setup lang="ts">
import type { Board } from "@/types";
defineProps<{
  board: Board;
}>();
</script>
<template>
  <router-link
    :to="`/boards/${board.uid}`"
    class="bg-gray-100 shadow rounded p-5 border border-white relative block w-[200px] m-5"
  >
    <p class="text-gray-700 font-semibold font-sans tracking-wide text-lg">
      {{ board.title }}
    </p>
  </router-link>
</template>
