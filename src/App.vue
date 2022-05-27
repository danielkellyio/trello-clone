<script setup lang="ts">
import { provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "./helpers/ApolloClient";
provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>
<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
