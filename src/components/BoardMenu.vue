<script setup lang="ts">
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import type { Board } from "@/types";

const props = defineProps<{
  board: Board;
}>();

const show = ref(false);
const menu = ref(null);
onClickOutside(menu, (e) => (show.value = false));
defineEmits<{
  (e: "deleteBoard", payload: null): void;
  (e: "uploadImage", payload: { id: string }): void;
}>();
</script>
<template>
  <div>
    <KButton
      icon="folder"
      theme-color="primary"
      fillMode="outline"
      @click="show = !show"
      ref="button"
      >Show Menu</KButton
    >
    <KPopup
      :anchor="'button'"
      :anchor-align="{
        vertical: 'bottom',
        horizontal: 'right',
      }"
      :popup-align="{
        horizontal: 'right',
        vertical: 'top',
      }"
      :show="show"
      :popup-class="'popup-content'"
    >
      <div class="p-5" ref="menu">
        <ul>
          <li class="text-red-500 whitespace-nowrap">
            <button @click="$emit('deleteBoard', null)">
              <span class="k-icon k-i-delete"></span>
              Delete Board
            </button>
          </li>
          <li>
            <strong>Board Image</strong>
            <AppImageDropzone
              @upload="$emit('uploadImage', $event)"
              class="aspect-video w-56"
              :image="board.image?.downloadUrl"
            />
          </li>
        </ul>
      </div>
    </KPopup>
  </div>
</template>
<style scoped>
ul li {
  @apply p-2;
  border-bottom: 1px solid #eee;
}
ul li:last-of-type {
  border-bottom: none;
}
</style>
