import gql from "graphql-tag";

export const getAllBoards = gql`
  {
    boardsList {
      items {
        id
        order
        title
        updatedAt
        createdAt
        image {
          downloadUrl
        }
      }
    }
  }
`;

export const getBoard = gql`
  query getBoard($id: ID) {
    board(id: $id) {
      id
      title
      order
      createdAt
      updatedAt
      image {
        id
        downloadUrl
      }
      tasks {
        items {
          id
          title
          createdAt
          updatedAt
          dueAt
          color
        }
      }
    }
  }
`;

export const boardCreate = gql`
  mutation boardCreate($title: String!, $order: JSON!) {
    boardCreate(data: { title: $title, order: $order }) {
      id
      title
      order
    }
  }
`;

export const updateBoardQuery = gql`
  mutation boardUpdate($id: ID, $order: JSON, $title: String) {
    boardUpdate(filter: { id: $id }, data: { order: $order, title: $title }) {
      id
      title
      order
    }
  }
`;

export const deleteBoardQuery = gql`
  mutation deleteBoard($id: ID!) {
    boardDelete(filter: { id: $id }, force: true) {
      success
    }
  }
`;

export const ATTACH_IMAGE_TO_BOARD_MUTATION = gql`
  mutation attachImageToBoard($id: ID!, $imageId: ID!) {
    boardUpdate(
      filter: { id: $id }
      data: { image: { reconnect: { id: $imageId } } }
    ) {
      image {
        id
        downloadUrl
      }
    }
  }
`;

export const createTaskOnBoardQuery = gql`
  mutation addTaskToBoard($boardId: ID!, $title: String!, $type: String) {
    boardUpdate(
      filter: { id: $boardId }
      data: { tasks: { create: [{ title: $title, type: $type }] } }
    ) {
      id
      tasks(last: 1) {
        items {
          id
          title
          type
          createdAt
          updatedAt
          dueAt
          color
        }
      }
    }
  }
`;
export const deleteTaskQuery = gql`
  mutation deleteTask($id: ID!) {
    taskDelete(filter: { id: $id }) {
      success
    }
  }
`;

export const GET_BOARD_LABELS_QUERY = gql`
  query getBoardLabels($id: ID) {
    board(id: $id) {
      labels {
        items {
          id
          label
          color
        }
      }
    }
  }
`;

export const CREATE_LABEL_ON_BOARD = gql`
  mutation createLabelOnBoard($boardId: ID!, $label: String!, $color: String) {
    boardUpdate(
      filter: { id: $boardId }
      data: { labels: { create: [{ label: $label, color: $color }] } }
    ) {
      id
      labels(last: 1) {
        items {
          id
          label
          color
        }
      }
    }
  }
`;
export const DELETE_BOARD_LABEL = gql`
  mutation deleteLabel($id: ID!) {
    labelDelete(filter: { id: $id }, force: true) {
      success
    }
  }
`;
