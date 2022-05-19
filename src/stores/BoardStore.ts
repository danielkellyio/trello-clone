import dataDriver from "@/dataDrivers/dataDriver";
import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, computed } from "vue";
import { watchDebounced } from "@vueuse/core";
import type { Uid, ColumnWithTasks, Column } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useBoardStore = defineStore("BoardStore", () => {
  const columns = ref<ColumnWithTasks[] | Column[]>([]);
  const title = ref<string | null>(null);
  const uid = ref<Uid | null>(null);
  const loaded = ref(false);

  const order = computed(() => {
    return columns.value.map((c) => [c.uid, c.tasks?.map((t) => t.uid)]);
  });

  watchDebounced(
    order,
    (newVal, oldVal) => {
      if (!loaded.value) return;
      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
      updateBoardOrder();
    },
    { debounce: 500 }
  );

  async function updateBoardOrder() {
    dataDriver.updateBoard(uid.value as Uid, {
      order: columns.value.map((column, index) => {
        const taskUids = column.tasks.map((t) => t.uid);
        columns.value[index] = { ...column, taskUids };
        return { title: column.title, uid: column.uid, taskUids };
      }),
    });
  }

  async function init(id: string) {
    loaded.value = false;
    uid.value = id;
    await initBoard();
    await initTasks();
    loaded.value = true;
  }

  async function initBoard() {
    if (!uid.value) throw new Error("BoardStore uid is not defined");
    const board = await dataDriver.getBoard(uid.value);
    if (board) {
      columns.value = board.order;
      title.value = board.title;
    }
  }

  async function initTasks() {
    if (!uid.value) throw new Error("BoardStore uid is not defined");
    const res = await dataDriver.getTasks(uid.value);
    columns.value.map((col) => {
      col.tasks = col.taskUids.map((taskId) => {
        const task = res.find((i) => i.uid === taskId);
        return task;
      });
    });
  }

  function getColumn(uid: Uid): ColumnWithTasks | undefined {
    return columns.value.find((c) => c.uid === uid) as ColumnWithTasks;
  }

  async function deleteTask(uid: string) {
    const column = columns.value.find((c) =>
      c.taskUids.includes(uid)
    ) as ColumnWithTasks;
    column.tasks = column?.tasks.filter((t) => t.uid !== uid);
    column.taskUids = column?.taskUids.filter((t) => t !== uid);
    dataDriver.deleteTask(uid);
  }

  async function createIssue({
    title,
    columnUid,
  }: {
    title: string;
    columnUid: Uid;
  }) {
    const i = await dataDriver.createTask({
      boardUid: uid.value as Uid,
      title,
    });
    const column = getColumn(columnUid);
    if (!column) throw new Error("Column does not exist");
    column.taskUids.push(i.uid);
    column.tasks.push(i);
  }
  async function renameBoard(newTitle: string) {
    if (!uid.value) throw new Error("Board uid is null");
    const board = await dataDriver.updateBoard(uid.value, { title: newTitle });
    title.value = newTitle;
    return board;
  }

  async function deleteBoard() {
    if (!uid.value) throw new Error("Board uid is null");
    await dataDriver.deleteBoard(uid.value);
  }
  async function renameColumn({ uid, title }: { uid: Uid; title: string }) {
    const index = columns.value.findIndex((column) => column.uid === uid);
    if (typeof index === "undefined") throw new Error("Column does not exist");
    columns.value[index].title = title;
    updateBoardOrder();
  }
  async function createColumn() {
    columns.value.push({
      uid: uuidv4(),
      title: "New Column",
      taskUids: [],
      tasks: [],
    });
  }

  return {
    uid,
    columns,
    loaded,
    init,
    createIssue,
    deleteTask,
    createColumn,
    renameColumn,
    title,
    renameBoard,
    deleteBoard,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
