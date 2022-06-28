<script lang="ts" setup>
import type { Comment } from "@/types";
import { Card as KCard } from "@progress/kendo-vue-layout";
defineProps<{
  comments: Comment[];
}>();
</script>
<template>
  <div class="comments">
    <KCard v-for="comment in comments" :key="comment.id">
      <div v-html="comment.message"></div>
    </KCard>
  </div>
</template>
