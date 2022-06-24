<script setup lang="ts">
import { provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "./helpers/ApolloClient";
import AppDrawer from "./components/AppDrawer.vue";
provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <AppDrawer />
  <AppAlerts />
</template>
<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
