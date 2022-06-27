<script setup lang="ts">
import {
  Card as KCard,
  CardImage as KCardImage,
  CardTitle as KCardTitle,
} from "@progress/kendo-vue-layout";
import { toTwicPicURL, toTwicPicBlurryImageUrl } from "@/helpers";
import type { Board } from "@/types";
defineProps<{
  board: Board;
}>();
const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
</script>
<template>
  <router-link :to="`/boards/${board.id}`" class="block w-96">
    <KCard class="m-5">
      <KCardImage
        v-if="board.image"
        :style="{
          backgroundImage: `url(${(toTwicPicBlurryImageUrl(board.image?.downloadUrl) as string)})`
        }"
        width="384"
        :data-twic-src="(toTwicPicURL(board.image?.downloadUrl) as string)"
        class="aspect-video w-full"
      />

      <div
        v-else
        class="aspect-video w-full"
        :style="{ backgroundColor: randomColor }"
      ></div>
      <KCardTitle class="p-2">
        {{ board.title }}
      </KCardTitle>
    </KCard>
  </router-link>
</template>
