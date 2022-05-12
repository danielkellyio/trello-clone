<script setup lang="ts">
import TaskCard from "@/components/TaskCard.vue";
import { ref } from "vue";
import { useBoardStore } from "../../stores/BoardStore";
import TaskCreator from "../../components/TaskCreator.vue";

const props = defineProps<{
  id: string;
}>();

const board = useBoardStore();
board.init(props.id);
board.columns;
</script>
<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <draggable
        :list="board.columns"
        group="columns"
        item-key="id"
        class="min-h-screen flex overflow-x-scroll py-12"
      >
        <template #item="{ element: column }">
          <div
            class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 column-width rounded mr-4 w-[400px]"
          >
            <div>
              <p
                class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
              >
                {{ column.title }}
              </p>
              <draggable
                :list="column.tasks"
                group="tasks"
                item-key="id"
                :animation="200"
                ghost-class="ghost-card"
                class="min-h-[400px]"
              >
                <template #item="{ element: task }">
                  <task-card
                    :task="task"
                    class="mt-3 cursor-move"
                    @delete="board.deleteTask(task.uid)"
                  ></task-card>
                </template>
              </draggable>
            </div>
            <TaskCreator
              @create="
                board.createIssue({
                  columnId: column.id,
                  title: $event,
                })
              "
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
