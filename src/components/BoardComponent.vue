<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { reactive, watch, toRaw } from "vue";
import type { Board, Column, Task, Uid } from "@/types";
import { v4 as uuidv4 } from "uuid";

// props
const props = defineProps<{
  board: Board;
  tasks: Task[];
  addTask(task: Partial<Task>): Promise<Task>;
}>();

// events
const emit = defineEmits<{
  (e: "update", payload: Partial<Board>): void;
  (e: "removeTask", payload: { id: Uid }): void;
}>();

// local data
const tasks = reactive(cloneDeep(props.tasks));
const board = reactive(cloneDeep(props.board));
const columns = reactive<Column[]>(JSON.parse(board.order as string));

// methods
function addColumn() {
  columns.push({
    uid: uuidv4(),
    title: "New Column",
    taskUids: [],
  });
}
async function addTask({ column, title }: { column: Column; title: string }) {
  const newTask = {
    title,
    type: "default",
  };
  try {
    const savedTask = await props.addTask(newTask);
    console.log("adding task");
    tasks.push({ ...savedTask });
    column.taskUids.push(savedTask.id);
  } catch (error) {}
}
function removeTask({ column, task }: { column: Column; task: Task }) {
  const index = column.taskUids.findIndex((id) => id === task.id);
  column.taskUids.splice(index, 1);

  const taskIndex = tasks.findIndex((t) => t.id === task.id);
  tasks.splice(taskIndex, 1);
  emit("removeTask", { id: task.id });
}
function emitUpdateEvent(b: Partial<Board>) {
  emit("update", cloneDeep({ ...props.board, ...b }));
}

watch(columns, () => {
  emitUpdateEvent({ order: JSON.stringify(toRaw(columns)) });
});
</script>

<template>
  <div class="flex py-12 items-start">
    <draggable
      :list="columns"
      group="columns"
      item-key="id"
      class="flex overflow-x-scroll flex-grow-0 flex-shrink-0"
    >
      <template #item="{ element: column }">
        <div
          class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 rounded mr-4 w-[300px]"
        >
          <div>
            <BoardColumnHeading
              :title="column.title"
              @update="column.title = $event.title"
            />
            <draggable
              :list="column.taskUids"
              group="tasks"
              item-key="uid"
              :animation="200"
              ghost-class="ghost-card"
              class="min-h-[400px]"
            >
              <template #item="{ element: taskId }">
                <TaskCard
                  v-if="tasks.find((t: Task) => t.id === taskId)"
                  :task="tasks.find((t: Task) => t.id === taskId)"
                  class="mt-3 cursor-move"
                  @delete="
                    removeTask({
                      column,
                      task: tasks.find((t: Task) => t.id === taskId) as Task,
                    })
                  "
                />
              </template>
            </draggable>
          </div>
          <TaskCreator @create="addTask({ column, title: $event })" />
        </div>
      </template>
    </draggable>
    <button class="text-gray-500" @click="addColumn">New Column +</button>
  </div>
</template>
