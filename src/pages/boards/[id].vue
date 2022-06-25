<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useAlerts } from "@/stores/Alerts";
import { useRouter } from "vue-router";

import {
  getBoard,
  updateBoardQuery,
  createTaskOnBoardQuery,
  deleteTaskQuery,
  deleteBoardQuery,
} from "@/graphql/boards";
import type { Task, Uid } from "@/types";
import BoardMenu from "../../components/BoardMenu.vue";

const alerts = useAlerts();
const router = useRouter();

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

const board = computed(() => boardData.value?.board || null);

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
  const title = board.value.title;
  const yes = confirm("Are you sure you want to delete this board?");
  if (yes) {
    await deleteBoard({ id: boardId.value });
    router.push("/");
    alerts.success(`${title} successfully deleted`);
  }
}

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
  <AppLoader v-if="loadingBoard" />
  <div class="flex">
    <AppPageHeading
      class="mb-0"
      :value="board?.title"
      :editable="true"
      @update="updateBoard({ ...board, title: $event })"
    >
    </AppPageHeading>
    <BoardMenu @deleteBoard="deleteBoardIfConfirmed" />
  </div>

  <BoardComponent
    v-if="board"
    :board="board"
    :tasks="tasks"
    :addTask="addTask"
    @removeTask="removeTask($event.id)"
    @update="updateBoard($event)"
  />
</template>
