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
      }
    }
  }
`;

export const getBoardWithTasks = gql`
  query getBoard($id: ID) {
    board(id: $id) {
      title
      order
      createdBy {
        id
        email
        firstName
        lastName
      }
      createdAt
      updatedAt
      tasks {
        items {
          title
        }
      }
    }
  }
`;

export const getBoard = gql`
  query getBoard($id: ID) {
    board(id: $id) {
      title
      order
      createdBy {
        id
        email
        firstName
        lastName
      }
      createdAt
      updatedAt
    }
  }
`;

export const boardCreate = gql`
  mutation boardCreate($title: String!, $order: JSON!) {
    boardCreate(data: { title: $title, order: $order }) {
      id
      title
      order
      createdAt
      createdBy
      updatedAt
    }
  }
`;

export const updateBoard = gql`
  mutation boardUpdate($id: ID, $order: JSON, $title: String) {
    __typename
    boardUpdate(filter: { id: $id }, data: { order: $order, title: $title }) {
      id
      title
      order
    }
  }
`;

export const destroyBoard = gql`
  mutation boardDestroy($id: ID) {
    boardDestroy(filter: { id: $id }) {
      success
    }
  }
`;
