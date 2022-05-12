import { defineStore, acceptHMRUpdate } from "pinia";
import { useDeskree } from "@/composables/useDeskree";
import { ref, computed, watch } from "vue";
import { watchDebounced } from "@vueuse/core";

interface Task {
  title: string;
  uid: string;
}
interface Column {
  id: string | number;
  title: string;
  tasks: Task[];
  taskIds: string[];
}

const {
  getBoard,
  createIssue: deskreeCreateIssue,
  createColumn,
  getColumnsByBoard,
  getIssuesByBoard,
  deleteIssue: deskreeDeleteTask,
  updateBoard,
  deleteColumn: deskreeDeleteColumn,
} = useDeskree();
export const useBoardStore = defineStore("BoardStore", () => {
  const columns = ref<Column[]>([]);
  const uid = ref<string | null>(null);
  const loaded = ref(false);

  const order = computed(() => {
    return columns.value.map((c) => [c.id, c.tasks?.map((t) => t.uid)]);
  });

  // watchDebounced(
  //   order,
  //   (newVal, oldVal) => {
  //     if (!loaded.value) return;
  //     if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

  //     updateBoard(uid.value, {
  //       order: columns.value.map((column, index) => {
  //         const taskIds = column.tasks.map((t) => t.uid);
  //         columns.value[index] = { ...column, taskIds };
  //         return { title: column.title, id: column.id, taskIds };
  //       }),
  //     });
  //   },
  //   { debounce: 500 }
  // );

  async function init(id: string) {
    loaded.value = false;
    uid.value = id;
    await initBoard();
    await initTasks();
    loaded.value = true;
  }

  async function initBoard() {
    if (!uid.value) throw new Error("BoardStore uid is not defined");
    const board = await getBoard(uid.value);
    columns.value = JSON.parse(board.order);
  }

  async function initTasks() {
    if (!uid.value) throw new Error("BoardStore uid is not defined");
    const res = await getIssuesByBoard(uid.value);
    columns.value.map((col) => {
      col.tasks = col.taskIds.map((taskId) => {
        const issue = res.data.find((i) => i.uid === taskId);
        if (issue) {
          return { uid: issue.uid, ...issue.attributes };
        }
      });
    });
  }

  function getColumn(id: string) {
    return columns.value.find((c) => c.id === id);
  }

  async function deleteTask(uid: string) {
    const column = columns.value.find((c) => c.taskIds.includes(uid));
    column.tasks = column?.tasks.filter((t) => t.uid !== uid);
    column.taskIds = column?.taskIds.filter((t) => t !== uid);
    deskreeDeleteTask(uid);
  }

  async function createIssue({
    title,
    columnId,
  }: {
    title: string;
    columnId: string;
  }) {
    const i = await deskreeCreateIssue({
      boardId: uid.value,
      title,
      createdBy: "0yLdHPMeBUSpwGlQtXr3",
    });
    const column = getColumn(columnId);
    column.taskIds.push(i.uid);
    column.tasks.push(i);
  }

  return {
    uid,
    columns,
    loaded,
    init,
    createIssue,
    deleteTask,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
