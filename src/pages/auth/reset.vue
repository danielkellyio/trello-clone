<script setup lang="ts">
import { ref } from "vue";
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { useRoute } from "vue-router";
const route = useRoute();
const auth = useAuthUserStore();
const password = ref("");
function resetPassword() {
  auth.resetPassword({
    oobCode: route.query.oobCode as string,
    newPassword: password.value,
    uid: "rjXEbm7MW7gRMFtqqeVoSXuwn6d2",
  });
}
</script>
<template>
  <div class="container mx-auto flex justify-center">
    <form @submit.prevent="resetPassword" class="p-4 w-96 max-w-full pt-16">
      <h1 class="text-4xl mb-8">Reset Password</h1>
      <label>
        <div>New Password</div>
        <input
          v-model="password"
          type="password"
          placeholder="password"
          class="border-2 rounded p-2 block w-full"
        />
      </label>
      <button class="mt-5 bg-blue-500 rounded text-white p-2 w-full">
        Reset Password
      </button>
    </form>
  </div>
</template>
