export type Uid = string | number;

export interface EmailAndPassword {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  oobCode: string;
  uid: Uid;
  newPassword: string;
}

export type TaskTypes =
  | "Design"
  | "Feature Request"
  | "Backend"
  | "QA"
  | "default";

export interface Task {
  id: Uid;
  title: string;
  type: string;
  board?: Board;
}
export interface Column {
  uid: Uid;
  title: string;
  taskUids: Uid[];
}
export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export interface Board {
  title: string;
  id: Uid;
  order: string | Column[] | ColumnWithTasks[];
}

export interface PartialBoard {
  title?: string;
  uid?: Uid;
  order?: Column[] | ColumnWithTasks[];
}

export interface PartialTask {
  uid?: Uid;
  boardUid?: Uid;
  title?: string;
  type?: string;
  date?: Date;
}
