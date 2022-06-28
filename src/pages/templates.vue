<script setup lang="ts">
import {
  Card as KCard,
  CardTitle as KCardTitle,
} from "@progress/kendo-vue-layout";

const templates = [
  {
    title: "Weekly Planner",
    order: [
      {
        title: "Monday",
      },
      {
        title: "Tuesday",
      },
      {
        title: "Wednesday",
      },
      {
        title: "Thursday",
      },
      {
        title: "Friday",
      },
      {
        title: "Done",
      },
    ],
  },
];
</script>
<template>
  <div class="flex">
    <KCard
      v-for="template in templates"
      :key="template.title"
      class="block w-96"
    >
      <KCardTitle class="p-2">
        <span class="text-gray-700 text-xl">{{ template.title }}</span>
      </KCardTitle>
    </KCard>
  </div>
</template>
