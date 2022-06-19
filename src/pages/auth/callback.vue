<script setup lang="ts">
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { useRouter } from "vue-router";
const auth = useAuthUserStore();
const router = useRouter();

auth.handleAuthentication().then(() => {
  router.push({ name: "home" });
});
</script>
<template>
  <div class="authenticating">Authenticating...</div>
</template>
