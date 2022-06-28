<script setup lang="ts">
import { Dialog as KDialog } from "@progress/kendo-vue-dialogs";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Editor as KEditor } from "@progress/kendo-vue-editor";
import { TextArea as KTextArea } from "@progress/kendo-vue-inputs";
import { ref, toRefs, computed } from "vue";
import {
  GET_TASK_QUERY,
  CREATE_COMMENT_ON_TASKS_MUTATION,
  UPDATE_TASK_MUTATION,
  ATTACH_LABEL_TO_TASK_MUTATION,
  REMOVE_LABEL_FROM_TASK_MUTATION,
} from "@/graphql/tasks";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useAlerts } from "@/stores/Alerts";
import type { Label, Task } from "@/types";

const props = defineProps<{
  taskId: string;
}>();
const { taskId } = toRefs(props);
const alerts = useAlerts();

// Init page data (board with tasks)
const {
  result: taskData,
  loading: loadingTask,
  onError: onTaskError,
  onResult: onTaskLoad,
  refetch: refetchTask,
} = useQuery(GET_TASK_QUERY, { id: taskId.value });
onTaskError(() => alerts.error("Error loading task"));
onTaskLoad(() => {
  taskCopy.value = JSON.parse(JSON.stringify(taskData.value?.task));
});
const task = computed(() => taskData.value?.task || null);
const taskCopy = ref<Partial<Task>>({});

// Task Updates
const { mutate: updateTask, loading: taskUpdating } =
  useMutation(UPDATE_TASK_MUTATION);

// Attaching labels
const { mutate: attachLabel } = useMutation(ATTACH_LABEL_TO_TASK_MUTATION);
async function handleAttachLabel(label: Label) {
  await attachLabel({
    id: taskId.value,
    labelId: label.id,
  });
  refetchTask();
}

// Detaching labels
const { mutate: removeLabel } = useMutation(REMOVE_LABEL_FROM_TASK_MUTATION);
async function handleRemoveLabel(label: Label) {
  await removeLabel({
    id: taskId.value,
    labelId: label.id,
  });
  refetchTask();
}

// Comments
const newComment = ref("");
const {
  mutate: addComment,
  onDone: onComment,
  onError: onCommentError,
  loading: loadingComment,
} = useMutation(CREATE_COMMENT_ON_TASKS_MUTATION);

onComment(() => refetchTask());
onCommentError(() => alerts.error("Error commenting on task"));

const tools = [
  ["Bold", "Italic", "Underline", "Strikethrough"],
  ["AlignLeft", "AlignCenter", "AlignRight", "AlignJustify"],
  ["Indent", "Outdent"],
  ["OrderedList", "UnorderedList"],
  "FontSize",
  "FormatBlock",
  ["Undo", "Redo"],
  ["Link", "Unlink", "InsertImage", "ViewHtml"],
];

// Loading
const loading = computed(() => {
  return loadingTask.value || loadingComment.value || taskUpdating.value;
});
</script>

<template>
  <div>
    <KDialog :title="task?.title" @close="$router.back()">
      <AppLoader v-if="loading" :overlay="true" />
      <div v-if="task" class="flex">
        <main>
          <div class="form-group">
            <label for="description" class="font-bold text-xl">
              <span class="k-icon k-i-align-left"></span>
              Description
            </label>
            <SaveableInput
              v-slot="{ show, hide }"
              @save="
                updateTask({
                  ...taskCopy,
                  id: taskId,
                })
              "
            >
              <KTextArea
                id="description"
                v-model="taskCopy.description"
                @focus="show"
                @blur="hide"
              />
            </SaveableInput>
          </div>

          <div class="form-group mt-10">
            <label for="comments" class="font-bold text-xl">
              <span class="k-icon k-i-comment"></span>
              Comments
            </label>
            <SaveableInput
              v-slot="{ show, hide }"
              @save="
                addComment({
                  id: taskId,
                  message: newComment,
                })
              "
            >
              <KEditor
                id="comments"
                @blur="hide()"
                @focus="show()"
                :tools="tools"
                @change="newComment = $event.html"
                :content-style="{
                  height: '200px',
                }"
              />
            </SaveableInput>
          </div>

          <TaskComments :comments="task.comments.items" />
        </main>
        <aside style="width: 200px" class="pl-5">
          <strong class="text-sm">Add to Card</strong>
          <ul>
            <li class="my-3">
              <TaskLabels
                :labels="task.labels.items"
                :boardId="$route.params.id"
                @select="handleAttachLabel"
                @deselect="handleRemoveLabel"
              />
            </li>
            <li class="my-3">
              <KButton
                class="w-full"
                icon="calendar-date"
                :fill-mode="'outline'"
                >Dates</KButton
              >
            </li>
          </ul>
        </aside>
      </div>
    </KDialog>
  </div>
</template>
