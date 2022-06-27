<script setup lang="ts">
import {
  Card as KCard,
  CardImage as KCardImage,
  CardTitle as KCardTitle,
} from "@progress/kendo-vue-layout";
import type { Board } from "@/types";
defineProps<{
  board: Board;
}>();
</script>
<template>
  <router-link :to="`/boards/${board.id}`">
    <KCard class="m-5 p-5">
      <KCardTitle>
        {{ board.title }}
      </KCardTitle>
      <KCardImage :src="board.image?.downloadUrl" />
    </KCard>
  </router-link>
</template>
