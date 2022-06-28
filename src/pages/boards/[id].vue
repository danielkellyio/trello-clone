<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useAlerts } from "@/stores/Alerts";
import { useRouter } from "vue-router";
import useStorage from "@/composables/useStorage";

import {
  getBoard,
  updateBoardQuery,
  createTaskOnBoardQuery,
  deleteTaskQuery,
  deleteBoardQuery,
  ATTACH_IMAGE_TO_BOARD_MUTATION,
} from "@/graphql/boards";
import type { Board, Task, Uid } from "@/types";

const alerts = useAlerts();
const router = useRouter();
useStorage();

// Define Props
const props = defineProps<{
  id: string;
}>();
const { id: boardId } = toRefs(props);

// Init page data (board with tasks)
const {
  result: boardData,
  loading: loadingBoard,
  onError: onBoardError,
} = useQuery(getBoard, { id: boardId.value });

onBoardError(() => alerts.error("Error loading board"));

const board = computed((): Board | null => boardData.value?.board || null);

//****************************** */
// Board CRUD
//****************************** */

// handle board updates
const { mutate: updateBoard } = useMutation(updateBoardQuery);

//handle delete board
const { mutate: deleteBoard, onError: onErrorDeletingBoard } =
  useMutation(deleteBoardQuery);
onErrorDeletingBoard(() => alerts.error("Error deleting board"));
async function deleteBoardIfConfirmed() {
  const title = board.value?.title;
  const yes = confirm("Are you sure you want to delete this board?");
  if (yes) {
    await deleteBoard({ id: boardId.value });
    router.push("/");
    alerts.success(`${title} successfully deleted`);
  }
}

//****************************** */
// Board Image
//****************************** */
const {
  mutate: attachImageToBoard,
  onError: errorAttachingImage,
  onDone: onImageAttached,
  loading: imageLoading,
} = useMutation(ATTACH_IMAGE_TO_BOARD_MUTATION);
errorAttachingImage(() => {
  alerts.error("Error setting board image");
});
onImageAttached(() => {
  alerts.success("Board image successfully set");
});

//****************************** */
// Tasks CRUD
//****************************** */
const tasks = computed(() => board.value.tasks.items);

// handle create task
const {
  mutate: createTaskOnBoard,
  onError: onErrorCreatingTask,
  onDone: onDoneCreatingTask,
} = useMutation(createTaskOnBoardQuery);
let taskResolve = (task: Task) => {};
let taskReject = (message: Error) => {};
function addTask(task: Task) {
  return new Promise((resolve, reject) => {
    taskResolve = resolve;
    taskReject = reject;
    createTaskOnBoard({
      boardId: boardId.value,
      ...task,
    });
  });
}
onErrorCreatingTask((error) => {
  taskReject(error);
  alerts.error("Error creating task");
});
onDoneCreatingTask((res) => {
  taskResolve(res.data.boardUpdate.tasks.items[0]);
  alerts.success("New task created!");
});

// hanlde delete task
const { mutate: deleteTask, onError: onDeleteTaskError } =
  useMutation(deleteTaskQuery);
onDeleteTaskError(() => alerts.error("Error deleting task"));
function removeTask(taskId: Uid) {
  deleteTask({ id: taskId });
}
</script>
<template>
  <div>
    <AppLoader v-if="loadingBoard" :overlay="true" />
    <template v-if="board">
      <div class="flex">
        <AppPageHeading
          class="mb-0"
          :value="board?.title"
          :editable="true"
          @update="updateBoard({ ...board, title: $event })"
        >
        </AppPageHeading>
        <BoardMenu
          :board="board"
          :imageLoading="imageLoading"
          @deleteBoard="deleteBoardIfConfirmed"
          @uploadImage="
            attachImageToBoard({
              id: boardId,
              imageId: $event.id,
            })
          "
        />
      </div>

      <BoardComponent
        :board="board"
        :tasks="tasks"
        :addTask="addTask"
        @removeTask="removeTask($event.id)"
        @update="updateBoard($event)"
      />

      <RouterView />
    </template>
  </div>
</template>
