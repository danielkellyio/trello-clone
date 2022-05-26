import { defineStore } from "pinia";
import dataDriver from "@/dataDrivers/dataDriver";
import type { Board } from "@/types";

export const useBoardsStore = defineStore({
  id: "boardsStore",
  state: (): {
    boards: Board[];
    loaded: boolean;
  } => ({
    boards: [],
    loaded: false,
  }),
  actions: {
    async initBoards() {
      this.loaded = false;
      this.boards = await dataDriver.getBoards();
      this.loaded = true;
    },
    async createNew() {
      const newBoard = await dataDriver.createBoard({
        title: "My New Board",
        order: [
          {
            uid: "1",
            title: "Backlog",
            taskUids: [],
          },
        ],
      });
      this.boards.push(newBoard);
      return newBoard;
    },
  },
});
