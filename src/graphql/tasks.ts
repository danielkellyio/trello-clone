import gql from "graphql-tag";

export const GET_TASK_QUERY = gql`
  query GET_TASK($id: ID!) {
    task(id: $id) {
      type
      title
      images {
        items {
          id
          downloadUrl
        }
      }
    }
  }
`;
