<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthUserStore } from "@/stores/AuthUserStore";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import jwt_decode from "jwt-decode";

const authUserStore = useAuthUserStore();
const route = useRoute();
const searchParams = new URLSearchParams(route.hash.substring(1));
authUserStore.idToken = searchParams.get("id_token");
const user = jwt_decode(authUserStore.idToken);

const CHARACTERS_QUERY = gql`
  query {
    user {
      id
    }
  }
`;

const CREATE_USER_QUERY = gql`
  mutation UserSignUp($user: UserCreateInput!, $authProfileId: ID) {
    userSignUpWithToken(user: $user, authProfileId: $authProfileId) {
      id
      email
    }
  }
`;

const { result, loading, error, onError } = useQuery(CHARACTERS_QUERY);
const { mutate: createUser } = useMutation(CREATE_USER_QUERY);

onError((error) => {
  if (error.toString() === "Error: User is absent") {
    createUser({
      authProfileId: authUserStore.idToken,
      user: { email: user.email },
    });
  }
});
</script>

<template>
  <div>{{ error }} {{ user.email }}</div>
</template>

<style scoped></style>
