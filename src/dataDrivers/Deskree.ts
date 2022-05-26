import type {
  PartialBoard,
  PartialTask,
  Task,
  Uid,
  Board,
  EmailAndPassword,
  ResetPasswordPayload,
} from "@/types";

const baseURL = `https://dk-test-project-2.api.deskree.com/api/v1/rest/`;
export default {
  // Board CRUD
  async getBoards() {
    const res = await fetch(`${baseURL}collections/boards`);
    const boards = await res.json();
    return boards.data.map(
      (board): Board => ({
        uid: board.uid,
        ...board.attributes,
      })
    );
  },
  async getBoard(uid: Uid) {
    const res = await fetch(`${baseURL}collections/boards/${uid}`);
    const board = await res.json();
    board.order = JSON.parse(board.order);
    return board;
  },
  async updateBoard(uid: Uid, payload: PartialBoard) {
    const res = await patchDeskree(`collections/boards/${uid}`, {
      ...payload,
      order:
        typeof payload.order === "string"
          ? payload.order
          : JSON.stringify(payload.order),
    });

    return await res.json();
  },
  async createBoard(payload: PartialBoard) {
    const newBoard = {
      title: "My New Board",
      ...payload,
      order: payload.order ? JSON.stringify(payload.order) : JSON.stringify([]),
    };
    const res = await fetch(`${baseURL}collections/boards`, {
      method: "POST",
      body: JSON.stringify(newBoard),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  },
  async deleteBoard(uid: Uid) {
    await deleteFromDeskree(`collections/boards/${uid}`);
  },

  // Task CRUD
  async createTask(payload: PartialTask): Promise<Task> {
    if (!payload.boardUid)
      throw new Error("Must provide boardUid when creating new task");
    if (!payload.title)
      throw new Error("Must provide title when creating a new task");
    const newTask = {
      type: "default",
      ...payload,
    } as Task;
    const res = await postToDeskree("collections/tasks", newTask);
    return await res.json();
  },
  async getTasks(boardUid: Uid): Promise<Task[]> {
    const res = await fetch(
      `${baseURL}collections/tasks?where=[{"attribute":"boardUid", "operator": "=", "value":"${boardUid}"}]`
    );
    const data = await res.json();
    return data.data.map((task) => ({
      uid: task.uid,
      ...task.attributes,
    }));
  },
  getTask(id) {},
  updateTask(id) {},
  async deleteTask(uid: Uid) {
    await deleteFromDeskree(`collections/tasks/${uid}`);
  },

  // Auth User
  register({ email, password }: EmailAndPassword) {
    return fetch(
      "https://dk-test-project-2.api.deskree.com/api/v1/auth/accounts/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
  },
  login({ email, password }: EmailAndPassword) {
    fetch(
      "https://dk-test-project-2.api.deskree.com/api/v1/auth/accounts/sign-in/email",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
  },
  resetPassword({ oobCode, uid, newPassword }: ResetPasswordPayload) {
    return fetch(
      "https://dk-test-project-2.api.deskree.com/api/v1/auth/accounts/verify/password-reset",
      {
        method: "POST",
        body: JSON.stringify({ oobCode, uid, newPassword }),
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};

function deleteFromDeskree(endpoint: string) {
  return fetch(`${baseURL}${endpoint}`, {
    method: "DELETE",
  });
}

function postToDeskree(endpoint: string, data: any) {
  return fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

async function patchDeskree(endpoint: string, payload: any) {
  return fetch(`${baseURL}${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
