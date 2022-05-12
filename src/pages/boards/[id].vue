<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { useBoardStore } from "@/stores/BoardStore";

const props = defineProps<{
  id: string;
}>();

// init data
const { createColumn, createIssue, deleteIssue, updateOrder, deleteColumn } =
  useBoardStore();
const board = useBoardStore();
board.init(props.id);

watch(
  () => board.order,
  () => !board.order || updateOrder(),
  { deep: true }
);

// Handle creating new columns
const newColumnName = ref("");
const newColumnMode = ref(false);
const handleNewColumn = async () => {
  const newColumn = await createColumn({ title: newColumnName.value });
  board.order.push([newColumn.uid, []]);
  newColumnName.value = "";
  newColumnMode.value = false;
};
const handleNewColumnCancel = () => {
  newColumnMode.value = false;
};
</script>
<template>
  <h1 style="padding: 20px; margin-bottom: 0">{{ board.name }}</h1>
  <span v-if="!board.loaded">Loading...</span>
  <div class="q-pa-md row items-start q-gutter-md no-wrap" v-if="board.loaded">
    <draggable
      :list="board.order"
      group="columns"
      itemKey="uid"
      class="columns"
      handle=".handle"
    >
      <template #item="{ element: [columnId, issueIds] }">
        <div style="padding: 20px">
          <h6 class="handle">
            {{ board.columns.find((c) => c.uid === columnId)?.title }}
            <span @click="deleteColumn(columnId)">x</span>
          </h6>
          <draggable
            class="list-group"
            :list="issueIds"
            group="issues"
            itemKey="uid"
          >
            <template #item="{ element: issueId }">
              <QCard dark bordered class="bg-grey-9 my-card">
                <QCardSection>
                  <div style="display: flex; justify-content: space-between">
                    <span>{{
                      board.issues.find((i) => i.uid === issueId)?.title
                    }}</span>
                    <span @click="deleteIssue(issueId)">x</span>
                  </div>
                </QCardSection>
              </QCard>
            </template>

            <template #header>
              <div v-if="!issueIds.length">empty</div>
            </template>

            <template #footer>
              <input
                type="text"
                placeholder="New Issue"
                @keypress.enter=" createIssue({ 
                  title:($event.target as HTMLInputElement).value, 
                  columnId, 
                  createdBy: '0yLdHPMeBUSpwGlQtXr3' 
                }); ($event.target as HTMLInputElement).value = ''"
              />
            </template>
          </draggable>
        </div>
      </template>
    </draggable>
    <div style="padding: 20px">
      <h6 class="ellipsis">
        <input
          v-if="newColumnMode"
          type="text"
          v-model="newColumnName"
          @keyup.enter="handleNewColumn"
          @keyup.esc="handleNewColumnCancel"
        />
        <div v-else @click="newColumnMode = true">+ Add New Column</div>
      </h6>
    </div>
  </div>
</template>

<style>
.columns {
  display: flex;
}
</style>
