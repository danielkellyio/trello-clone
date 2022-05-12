import { ref } from "vue";

const baseURL = `https://dk-test-project-2.api.deskree.com/api/v1/rest/`;

export function useDeskree() {
  const getBoard = async (uid: string) => {
    const res = await fetch(`${baseURL}collections/boards/${uid}`);
    return await res.json();
  };

  const updateBoard = async (uid: string, board: any) => {
    const res = await fetch(`${baseURL}collections/boards/${uid}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...board,
        order:
          typeof board.order === "string"
            ? board.order
            : JSON.stringify(board.order),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };

  const getBoards = async () => {
    const res = await fetch(`${baseURL}collections/boards`);
    return await res.json();
  };

  const getColumnsByBoard = async (boardUid: string) => {
    const res = await fetch(
      `${baseURL}collections/columns?where=[{"attribute":"boardId", "operator": "=", "value":"${boardUid}"}]`
    );
    return await res.json();
  };

  const getIssuesByBoard = async (boardUid: string) => {
    const res = await fetch(
      `${baseURL}collections/issues?where=[{"attribute":"boardId", "operator": "=", "value":"${boardUid}"}]`
    );
    return await res.json();
  };

  const createColumn = async (column: { title: string; boardId: string }) => {
    const res = await fetch(`${baseURL}collections/columns`, {
      method: "POST",
      body: JSON.stringify(column),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };

  const createIssue = async (issue: {
    title: string;
    boardId: string;
    columnId: string;
    createdBy: string;
    tags?: [];
  }) => {
    const res = await fetch(`${baseURL}collections/issues`, {
      method: "POST",
      body: JSON.stringify({ ...issue, tags: issue.tags || [] }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };
  const deleteIssue = async (uid) => {
    const res = await fetch(`${baseURL}collections/issues/${uid}`, {
      method: "DELETE",
    });
    return await res.json();
  };
  const deleteColumn = async (uid) => {
    const res = await fetch(`${baseURL}collections/columns/${uid}`, {
      method: "DELETE",
    });
    return await res.json();
  };

  return {
    getBoards,
    getBoard,
    createColumn,
    getColumnsByBoard,
    getIssuesByBoard,
    createIssue,
    deleteIssue,
    updateBoard,
    deleteColumn,
  };
}
