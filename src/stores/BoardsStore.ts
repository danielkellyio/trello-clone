import { defineStore } from "pinia";
import dataDriver from "@/dataDrivers/dataDriver";
import type { Board } from "@/types";

export const useBoardsStore = defineStore({
  id: "boardsStore",
  state: (): {
    boards: Board[];
  } => ({
    boards: [],
  }),
  actions: {
    async initBoards() {
      this.boards = await dataDriver.getBoards();
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
