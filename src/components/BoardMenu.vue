<script setup lang="ts">
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
const show = ref(false);
const menu = ref(null);
onClickOutside(menu, () => (show.value = false));
defineEmits<{
  (e: "deleteBoard", payload: null): void;
}>();
</script>
<template>
  <div ref="menu">
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
      <div class="p-5">
        <ul>
          <li class="text-red-500 whitespace-nowrap">
            <button @click="$emit('deleteBoard', null)">
              <span class="k-icon k-i-delete"></span>
              Delete Board
            </button>
          </li>
        </ul>
      </div>
    </KPopup>
  </div>
</template>
