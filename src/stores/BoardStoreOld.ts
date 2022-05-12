import { defineStore } from "pinia";
import { useDeskree } from "@/composables/useDeskree";

export interface Column {
  uid: string;
  title: string;
  issues?: Issue[];
}

interface Issue {
  title: string;
  uid?: string;
  columnId: string;
  boardId?: string;
  createdBy: string;
}

const {
  getBoard,
  createColumn,
  getColumnsByBoard,
  getIssuesByBoard,
  createIssue,
  deleteIssue,
  updateBoard,
  deleteColumn,
} = useDeskree();
export const useBoardStore = defineStore({
  id: "boardStore",
  state: (): {
    uid?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    tags: string[];
    teamId?: string | null;
    name: string;
    columns: Column[];
    issues: Issue[];
    order: any[];
    loaded: boolean;
  } => ({
    name: "Peronal Board",
    columns: [],
    issues: [],
    tags: [],
    updatedAt: null,
    createdAt: null,
    teamId: null,
    order: [],
    loaded: false,
  }),
  actions: {
    async init(uid: string) {
      this.uid = uid;
      await Promise.all([
        this.initBoard(),
        this.initIssues(),
        this.initColumns(),
      ]);
      this.loaded = true;
    },

    async initBoard() {
      if (!this.uid) throw new Error("BoardStore uid is not defined");
      const board = await getBoard(this.uid);
      const order = this.order;
      Object.keys(board).forEach((key) => (this[key] = board[key]));
      this.createdAt = new Date(board.createdAt);
      this.updatedAt = new Date(board.updatedAt);
      this.order = board.order ? JSON.parse(board.order) : order;
    },
    async initColumns() {
      if (!this.uid) throw new Error("BoardStore uid is not defined");
      const res = await getColumnsByBoard(this.uid);
      this.columns = res.data.map((c) => ({ uid: c.uid, ...c.attributes }));
    },

    async initIssues() {
      if (!this.uid) throw new Error("BoardStore uid is not defined");
      const res = await getIssuesByBoard(this.uid);
      this.issues = res.data.map((i) => ({ uid: i.uid, ...i.attributes }));
    },

    async createColumn(column: { title: string }) {
      if (!this.uid) {
        throw new Error("BoardStore uid is not defined");
      }
      const saved = await createColumn({
        ...column,
        boardId: this.uid,
      });
      this.columns.push(saved);
      return saved;
    },

    async createIssue(issue: Issue) {
      const i = await createIssue({
        boardId: this.uid,
        ...issue,
      });
      const columnIndex = this.order.findIndex(
        ([columnId, issueIds]) => columnId === issue.columnId
      );
      this.order[columnIndex][1].push(i.uid);
      this.issues.push(i);
    },

    async deleteIssue(issueId: string) {
      await deleteIssue(issueId);
      const index = this.order.findIndex(([columnId, issueIds]) =>
        issueIds.includes(issueId)
      );
      this.order[index][1] = this.order[index][1].filter(
        (id) => id !== issueId
      );
      this.issues = this.issues.filter((i) => i.uid !== issueId);
    },

    async deleteColumn(uid: string) {
      await deleteColumn(uid);
      const index = this.order.findIndex(
        ([columnId, issueIds]) => columnId === uid
      );
      const issues = this.order[index][1];
      issues.forEach((i) => this.deleteIssue(i.uid));
      this.order.splice(index, 1);
    },

    async updateOrder() {
      if (!this.uid) {
        throw new Error("BoardStore uid is not defined");
      }
      updateBoard(this.uid, { order: this.order });
    },

    async fetchIssues() {
      const res = await fetch(
        "https://dk-test-project-1231.api.deskree.com/api/v1/rest/collections/issues"
      );
      const data = await res.json();
      this.issues = data.data;
    },
    addNewColumn(name: string) {
      const id = Math.random();
      this.columns.push({
        id,
        name,
      });
    },
  },
});
