<script setup lang="ts">
import { provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "./helpers/ApolloClient";
import AppDrawer from "./components/AppDrawer.vue";
import { useScriptTag } from "@vueuse/core";

// Provide Apollo Client to all Vue Components
provide(DefaultApolloClient, apolloClient);

// Initialize TwicPic
useScriptTag(`${import.meta.env.VITE_TWICPIC_URL}?v1`);
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
