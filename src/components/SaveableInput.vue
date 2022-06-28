<script setup lang="ts">
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Slide as KSlide } from "@progress/kendo-vue-animation";
import { ref } from "vue";
const shown = ref(false);
function show() {
  shown.value = true;
}
function hide() {
  setTimeout(() => (shown.value = false), 200);
}
</script>
<template>
  <div class="mb-12 mt-2">
    <slot :show="show" :hide="hide"></slot>
    <div class="relative">
      <div class="absolute">
        <KSlide :appear="shown">
          <KButton @click="$emit('save')" :theme-color="'primary'"
            >Save</KButton
          >
          <KButton @click="$emit('cancel')">Cancel</KButton>
        </KSlide>
      </div>
    </div>
  </div>
</template>
