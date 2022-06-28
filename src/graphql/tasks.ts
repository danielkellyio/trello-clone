import gql from "graphql-tag";

export const GET_TASK_QUERY = gql`
  query GET_TASK($id: ID!) {
    task(id: $id) {
      type
      title
      description
      labels {
        items {
          id
          label
          color
        }
      }
      images {
        items {
          id
          downloadUrl
        }
      }
      comments {
        items {
          message
        }
      }
    }
  }
`;

export const CREATE_COMMENT_ON_TASKS_MUTATION = gql`
  mutation createQueryOnTask($id: ID!, $message: String!) {
    taskUpdate(
      filter: { id: $id }
      data: { comments: { create: [{ message: $message }] } }
    ) {
      id
      comments(last: 1) {
        items {
          id
          message
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation taskUpdate($id: ID, $description: String, $title: String) {
    taskUpdate(
      filter: { id: $id }
      data: { description: $description, title: $title }
    ) {
      id
      title
      description
    }
  }
`;

export const ATTACH_LABEL_TO_TASK_MUTATION = gql`
  mutation attachLabelToBoard($id: ID!, $labelId: ID!) {
    taskUpdate(
      filter: { id: $id }
      data: { labels: { connect: { id: $labelId } } }
    ) {
      labels {
        items {
          id
          color
          label
        }
      }
    }
  }
`;

export const REMOVE_LABEL_FROM_TASK_MUTATION = gql`
  mutation removeLabelFromBoard($id: ID!, $labelId: ID!) {
    taskUpdate(
      filter: { id: $id }
      data: { labels: { disconnect: { id: $labelId } } }
    ) {
      labels {
        items {
          id
          color
          label
        }
      }
    }
  }
`;
