<script setup lang="ts">
import { ref, toRefs, computed } from "vue";
import { GET_TASK_QUERY } from "@/graphql/tasks";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useAlerts } from "@/stores/Alerts";
import { useStorage } from "@/composables/useStorage";
import { FILE_CREATE_MUTATION } from "@/graphql";

const alerts = useAlerts();
const { uploadAsset } = useStorage();

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
  onResult: onTaskLoaded,
} = useQuery(GET_TASK_QUERY, { id: taskId.value });
onTaskError(() => alerts.error("Error loading task"));
onTaskLoaded(() => (form.value = task.value));

const task = computed(() => taskData.value?.task || null);

const update = () => {
  console.log("updating thing");
};

// handle file uploads
const { mutate: createFileIn8base } = useMutation(FILE_CREATE_MUTATION);
async function handleFileUpload(e: Event) {
  const data = await uploadAsset(
    ((e.target as HTMLInputElement).files as FileList)[0] as File
  );

  return createFileIn8base({
    fileId: data.url.split("/").at(-1),
    filename: data.filename,
  });
}
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
    <FormKit label="Assigned To" validation="required" name="assignedTo" />
    <FormKit
      label="Images"
      type="file"
      multiple
      name="images"
      @change="handleFileUpload"
    />
  </FormKit>
</template>
