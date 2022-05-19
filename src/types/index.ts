export type Uid = string | number;

export type TaskTypes =
  | "Design"
  | "Feature Request"
  | "Backend"
  | "QA"
  | "default";

export interface Task {
  uid: Uid;
  boardUid: Uid;
  title: string;
  type: string;
  date: Date;
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
  uid: Uid;
  order: Column[] | ColumnWithTasks[];
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
