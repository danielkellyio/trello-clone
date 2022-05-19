<script setup lang="ts">
import { ref, nextTick } from "vue";
const active = ref(false);
const input = ref<HTMLInputElement>(null);
const value = ref("");
const emit = defineEmits<{
  (e: "create", payload: string): void;
  (e: "cancel"): void;
}>();

const handleActivate = () => {
  active.value = true;
  nextTick(() => input.value.focus());
};
const handleEnter = () => {
  emit("create", value.value);
  value.value = "";
  active.value = false;
};
const handleEsc = () => {
  value.value = "";
  emit("cancel");
  active.value = false;
};
</script>

<template>
  <div class="w-full">
    <input
      ref="input"
      class="w-full bg-transparent border-gray-200 border-[1px] rounded"
      type="text"
      v-if="active"
      v-model="value"
      @keypress.enter="handleEnter"
      @keypress.esc="handleEsc"
      @blur="handleEsc"
    />
    <div
      v-else
      @click="handleActivate()"
      class="hover:bg-gray-300 p-2 rounded text-gray-600 text-sm cursor-pointer"
    >
      + Create Task
    </div>
  </div>
</template>

<style scoped></style>
