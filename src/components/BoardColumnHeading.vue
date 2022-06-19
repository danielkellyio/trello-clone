<script setup lang="ts">
defineProps<{
  title: string;
}>();
const emit = defineEmits<{
  (e: "update", payload: { title: string }): void;
}>();
function handleCommit(event: Event) {
  const input = event.target as HTMLInputElement;
  const title = input.value;
  emit("update", { title });
  input.blur();
}
</script>
<template>
  <p
    class="text-gray-700 font-semibold font-sans tracking-wide text-sm cursor-move"
  >
    <input
      type="text"
      class="bg-transparent font-bold ouline-none border-none"
      @blur="handleCommit"
      @keypress.enter="handleCommit"
      :value="title"
    />
  </p>
</template>
