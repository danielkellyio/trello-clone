import gql from "graphql-tag";
export const CURRENT_USER_QUERY = gql`
  query {
    user {
      id
      email
    }
  }
`;

export const USER_SIGN_UP_MUTATION = gql`
  mutation UserSignUp($user: UserCreateInput!, $authProfileId: ID) {
    userSignUpWithToken(user: $user, authProfileId: $authProfileId) {
      id
      email
    }
  }
`;
