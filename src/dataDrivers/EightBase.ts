import type {
  PartialBoard,
  PartialTask,
  Task,
  Uid,
  Board,
  EmailAndPassword,
  ResetPasswordPayload,
} from "@/types";
import gql from "graphql-tag";
import {
  useMutation,
  provideApolloClient,
  useQuery,
} from "@vue/apollo-composable";
import client from "@/helpers/ApolloClient";
import { useAuthUserStore } from "@/stores/AuthUserStore";
const baseUrl = import.meta.env.VITE_APP_WORKSPACE_ENDPOINT;
provideApolloClient(client);

export default {
  // Board CRUD
  async getBoards() {
    const res = await client.query({
      query: gql`
        {
          boardsList {
            count
            items {
              title
              order
              id
            }
          }
        }
      `,
    });
    return [...res.data.boardsList.items].map((board) => ({
      uid: board.id,
      ...board,
    }));
  },
  async getBoard(uid: Uid): Promise<Board> {
    const { onResult, onError } = await useQuery(
      gql`
        query getBoard($id: ID) {
          board(id: $id) {
            id
            title
            order
          }
        }
      `,
      {
        id: uid,
      }
    );
    return new Promise((resolve, reject) => {
      onResult((result) => {
        console.log(result);
        resolve({
          ...result.data.board,
          order: JSON.parse(result.data.board.order),
          uid: result.data.board.id,
        });
      });
      onError(reject);
    });
    // ;
  },
  async updateBoard(uid: Uid, payload: PartialBoard) {
    const { onResult, onError } = await useQuery(
      gql`
        mutation updateBoard($id: ID, $order: JSON, $title: String!) {
          boardUpdate(data: { id: $id, title: $title, order: $order }) {
            id
            title
            order
          }
        }
      `,
      {
        ...payload,
        id: payload.uid || payload.id,
      }
    );
    return new Promise((resolve, reject) => {
      onResult((result) => {
        console.log(result);
        // resolve(
        //   result.data.tasksList.items.map((task) => ({
        //     uid: task.id,
        //     ...task,
        //   }))
        // );
      });
      onError(reject);
    });
  },
  async createBoard(payload: PartialBoard) {
    const { mutate } = useMutation(gql`
      mutation CreateBoard($title: String!, $order: JSON!) {
        boardCreate(data: { title: $title, order: $order }) {
          id
          title
          order
        }
      }
    `);
    const res = await mutate({
      title: "My new board",
      order:
        typeof payload.order === "string"
          ? payload.order
          : JSON.stringify(payload.order),
    });
    return {
      uid: res?.data.boardCreate.id,
      title: res?.data.boardCreate.id,
      order: res?.data.boardCreate.id,
    };
  },
  async deleteBoard(uid: Uid) {},

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
    const { onResult, onError } = await useQuery(
      gql`
        query getTasksForBoard($boardId: String!) {
          tasksList(filter: { boardUid: { equals: $boardId } }) {
            items {
              title
              type
            }
          }
        }
      `,
      {
        boardId: boardUid,
      }
    );
    return new Promise((resolve, reject) => {
      onResult((result) => {
        resolve(
          result.data.tasksList.items.map((task) => ({
            uid: task.id,
            ...task,
          }))
        );
      });
      onError(reject);
    });
  },
  getTask(id) {},
  updateTask(id) {},
  async deleteTask(uid: Uid) {
    await deleteFromDeskree(`collections/tasks/${uid}`);
  },

  // Auth User
  visitLogin() {
    window.location = import.meta.env.VITE_8BASE_AUTH_LOGIN_URL;
  },
  visitRegister() {
    window.location = import.meta.env.VITE_8BASE_AUTH_REGISTER_URL;
  },
  register({ email, password }: EmailAndPassword) {},
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
