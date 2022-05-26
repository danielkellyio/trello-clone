<script setup lang="ts">
import TaskCard from "@/components/TaskCard.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useBoardStore } from "../../stores/BoardStore";
import TaskCreator from "../../components/TaskCreator.vue";
const props = defineProps<{
  id: string;
}>();
const route = useRoute();
const router = useRouter();
const board = useBoardStore();
board.init(props.id);
board.columns;
const boardTitle = ref(null);

onMounted(focusTitle);
watch(board.loaded, focusTitle);

function focusTitle() {
  route.query.new && boardTitle.value && boardTitle.value.focus();
}
async function handleDelete() {
  const yes = confirm(`Are you sure you want to delete ${board.title}`);
  if (!yes) return;
  await board.deleteBoard();
  router.push("/");
}
</script>
<template>
  <div v-if="board.loaded">
    <div class="mt-10 p-5">
      <input
        ref="boardTitle"
        type="text"
        class="text-3xl"
        :value="board.title"
        @keydown.enter="board.renameBoard(($event.target as HTMLInputElement).value); ($event.target as HTMLInputElement).blur()"
        @blur="board.renameBoard(($event.target as HTMLInputElement).value); ($event.target as HTMLInputElement).blur()"
      />
      <br />
      <RouterLink to="/" class="text-blue-500">←Back</RouterLink>
      |
      <button class="text-red-500" @click="handleDelete">Delete</button>
    </div>

    <div class="flex py-12 items-start">
      <draggable
        :list="board.columns"
        group="columns"
        item-key="id"
        class="flex overflow-x-scroll flex-grow-0 flex-shrink-0"
      >
        <template #item="{ element: column }">
          <div
            class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 rounded mr-4 w-[300px]"
          >
            <div>
              <p
                class="text-gray-700 font-semibold font-sans tracking-wide text-sm cursor-move"
              >
                <input
                  type="text"
                  class="bg-transparent font-bold ouline-none border-none"
                  @blur="
                  board.renameColumn({
                        uid: column.uid,
                        title: ($event.target as HTMLInputElement).value,
                      });
                      ($event.target as HTMLInputElement).blur()
                  "
                  @keypress.enter="
                      board.renameColumn({
                        uid: column.uid,
                        title: ($event.target as HTMLInputElement).value,
                      });
                      ($event.target as HTMLInputElement).blur()
                    "
                  :value="column.title"
                />
              </p>
              <draggable
                :list="column.tasks"
                group="tasks"
                item-key="uid"
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
                  columnUid: column.uid,
                  title: $event,
                })
              "
            />
          </div>
        </template>
      </draggable>
      <button class="text-gray-500" @click="board.createColumn">
        New Column +
      </button>
    </div>
  </div>
  <div v-if="!board.loaded">Loading...</div>
</template>
