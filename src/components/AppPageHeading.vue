<script setup lang="ts">
defineProps<{
  editable?: boolean;
  value?: string;
}>();
const emit = defineEmits<{
  (e: "update", payload: string): void;
}>();

function handleUpdate(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  emit("update", value);
  input.blur();
}
</script>
<template>
  <input
    v-if="editable"
    type="text"
    class="text-3xl w-full mb-5"
    :value="value"
    @keydown.enter="handleUpdate"
    @blur="handleUpdate"
  />
  <h1 v-else class="text-3xl mb-5"><slot></slot></h1>
</template>
