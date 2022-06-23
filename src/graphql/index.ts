import gql from "graphql-tag";
export const IMAGE_UPLOAD_QUERY = gql`
  query {
    fileUploadInfo {
      policy

      signature

      apiKey

      path
    }
  }
`;

export const FILE_CREATE_MUTATION = gql`
  mutation CREATE_FILE($fileId: String!, $filename: String!) {
    fileCreate(data: { fileId: $fileId, filename: $filename }) {
      id
    }
  }
`;
