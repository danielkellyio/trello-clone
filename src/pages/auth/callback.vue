<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthUserStore } from "@/stores/AuthUserStore";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import jwt_decode from "jwt-decode";

const authUserStore = useAuthUserStore();
const route = useRoute();
const router = useRouter();
const searchParams = new URLSearchParams(route.hash.substring(1));
authUserStore.idToken = searchParams.get("id_token");
const user = jwt_decode(authUserStore.idToken);

async function storeUser() {
  const res = await fetch(import.meta.env.VITE_APP_WORKSPACE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authUserStore.idToken}`,
    },
    body: JSON.stringify({
      query: `mutation {
  userSignUpWithToken(
    authProfileId: "${import.meta.env.VITE_APP_AUTH_PROFILE_ID}"
    user: {
      email: "${user.email}",
      lastName: "${user.family_name}",
      firstName: "${user.name}",
    }
  ) {
    id
  }
}

#`,
    }),
  });
  authUserStore.user = await res.json();
  router.push("/");
}
storeUser();
</script>

<template>
  <button @click="doTest">doTest</button>
</template>

<style scoped></style>
