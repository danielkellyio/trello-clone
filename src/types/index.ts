export type Uid = string | number;

export interface EmailAndPassword {
  email: string;
  password: string;
}

export interface File {
  downloadStorageUrl: string;
  downloadUrl: string;
  filename: string;
  id: string;
  meta: {
    path: string;
    size: number;
    mimetype: string;
    workspaceId: string;
  };
  previewUrl: string;
  provider: string;
  public: boolean;
  shareUrl: string;
  updatedAt: Date;
  uploadUrl: string;
  uploaded: boolean;
  createdAt: Date;
  deletedAt: Date;
}

export interface ResetPasswordPayload {
  oobCode: string;
  uid: Uid;
  newPassword: string;
}

type TaskColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink";

export interface Task {
  id: Uid;
  title: string;
  type: string;
  color: TaskColor;
  board?: Board;
  createdAt: Date;
  updatedAt: Date;
  dueAt: Date;
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
  image?: File;
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
