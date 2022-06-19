<script setup lang="ts">
import Badge from "./Badge.vue";
import { computed } from "vue";
import { useDateFormat } from "@vueuse/core";
import type { Task } from "@/types";
const props = defineProps<{
  task: Task;
}>();
const date = useDateFormat(props.task?.date, "MM/DD/YY");
const badgeColor = computed(() => {
  const mappings = {
    Design: "purple",
    "Feature Request": "teal",
    Backend: "blue",
    QA: "green",
    default: "teal",
  };
  return mappings[props.task.type] || mappings.default;
});
</script>
<template>
  <div
    class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white relative"
  >
    <span
      class="absolute bottom-0 right-1 cursor-pointer"
      @click="$emit('delete')"
      >x</span
    >
    <div class="flex justify-between">
      <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
        {{ task.title }}
      </p>

      <img
        class="w-6 h-6 rounded-full ml-3"
        src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
        alt="Avatar"
      />
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{ date }}</span>
      <badge v-if="task.type" :color="badgeColor">{{
        task.type === "default" ? "" : task.type
      }}</badge>
    </div>
  </div>
</template>
