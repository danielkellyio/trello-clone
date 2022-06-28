<script setup lang="ts">
import { ref } from "vue";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import type { Label } from "@/types";

defineProps<{
  boardId: string;
  labels: Label[];
}>();

defineEmits<{
  (e: "select", payload: Label): void;
  (e: "deselect", payload: Label): void;
}>();

const show = ref(false);
</script>
<template>
  <KButton
    class="w-full"
    icon="button"
    :fill-mode="'outline'"
    ref="button"
    @click="show = !show"
    >Label</KButton
  >
  <KPopup
    :anchor="'button'"
    :anchor-align="{
      vertical: 'bottom',
      horizontal: 'left',
    }"
    :show="show"
    :popup-class="'popup-content'"
  >
    <div class="p-5 w-60">
      <BoardLabels
        :boardId="boardId"
        :selected="labels"
        @select="$emit('select', $event)"
        @deselect="$emit('deselect', $event)"
      />
    </div>
  </KPopup>
</template>
