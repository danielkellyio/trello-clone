import type { Uid, Board, PartialBoard, Task, PartialTask } from "@/types";
import { v4 as uuidv4 } from "uuid";

const BOARDS_KEY = "app_boards";
const TASK_KEY = "app_tasks";
export default {
  async getBoards(): Promise<Board[]> {
    const boards = window.localStorage.getItem(BOARDS_KEY);
    if (boards) return JSON.parse(boards);
    return [];
  },
  async getBoard(uid: Uid) {
    const boards = await this.getBoards();
    return boards.find((board: Board) => board.uid === uid);
  },
  async updateBoard(Uid: Uid, payload: PartialBoard) {
    const boards = await this.getBoards();
    const index = boards.findIndex((board) => board.uid === Uid);
    boards[index] = {
      ...boards[index],
      ...payload,
    };
    window.localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  },
  async createBoard(payload: PartialBoard): Promise<Board> {
    const boards = await this.getBoards();
    const newBoard = {
      uid: uuidv4(),
      title: "",
      order: [],
      ...payload,
    };
    boards.push(newBoard);
    window.localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
    return newBoard;
  },
  async deleteBoard(Uid: Uid) {
    const boards = await this.getBoards();
    const index = boards.findIndex((board) => board.uid === Uid);
    boards.splice(index, 1);
    window.localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  },
  async getTasks(boardUid?: Uid): Promise<Task[]> {
    const data = window.localStorage.getItem(TASK_KEY);
    if (data) {
      const tasks = JSON.parse(data) as Task[];
      return boardUid
        ? tasks.filter((task: Task) => task.boardUid === boardUid)
        : tasks;
    }
    return [];
  },
  async getTask(Uid: Uid) {
    const tasks = await this.getTasks();
    return tasks.find((task: Task) => task.uid === Uid);
  },
  async createTask(payload: PartialTask): Promise<Task> {
    if (!payload.boardUid)
      throw new Error("Must provide boardUid when creating new task");
    if (!payload.title)
      throw new Error("Must provide title when creating a new task");
    const tasks = await this.getTasks();
    const newTask = {
      uid: uuidv4(),
      type: "default",
      date: new Date(),
      ...payload,
    } as Task;
    tasks.push(newTask);
    window.localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    return newTask;
  },
  async updateTask(Uid: Uid, payload: PartialTask) {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((task) => task.uid === Uid);
    tasks[index] = {
      ...tasks[index],
      ...payload,
    };
    window.localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  },
  async deleteTask(Uid: Uid) {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((task) => task.uid === Uid);
    tasks.splice(index, 1);
    window.localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  },
};
