<script setup lang="ts">
import { ref, toRefs, computed } from "vue";
import { GET_TASK_QUERY } from "@/graphql/tasks";
import { useQuery } from "@vue/apollo-composable";

const form = ref({});

const props = defineProps<{
  id: string;
}>();
const { id: taskId } = toRefs(props);

// Init page data (board with tasks)
const {
  result: taskData,
  loading: loadingTask,
  onError: onTaskError,
} = useQuery(GET_TASK_QUERY, { id: taskId.value });
const alert = useAlert();
onTaskError(() => alert.danger("Error loading task"));

const task = computed(() => taskData.value?.task || null);

const update = () => {
  console.log("thing");
};
</script>
<template>
  <pre>
  {{ task }}
</pre
  >

  <FormKit type="form" v-model="form" submit-label="Login" @submit="update">
    <FormKit label="Title" validation="required" name="title" />
    <FormKit label="Description" validation="required" name="description" />
    <FormKit label="Color" validation="required" name="color" />
    <FormKit label="AssignedTo" validation="required" name="assignedTo" />
  </FormKit>
</template>
