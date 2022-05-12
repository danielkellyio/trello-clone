import { defineStore } from "pinia";
import { useDeskree } from "@/composables/useDeskree";

const { getBoards } = useDeskree();
export const useBoardsStore = defineStore({
  id: "boardsStore",
  state: () => ({
    boards: [],
  }),
  actions: {
    async initBoards() {
      const res = await getBoards();
      this.boards = res.data;
    },
  },
});
