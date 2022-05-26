<script setup lang="ts">
import { ref } from "vue";
import { useAuthUserStore } from "@/stores/AuthUserStore";
const auth = useAuthUserStore();
const form = ref({
  email: "",
  password: "",
});

function register() {
  if (form.value.email && form.value.password) {
    auth.login(form.value);
  } else {
    alert("Please provide username and password");
  }
}
</script>
<template>
  <div class="container mx-auto flex justify-center">
    <form @submit.prevent="register" class="p-4 w-96 max-w-full pt-16">
      <h1 class="text-4xl mb-8">Login</h1>
      <label class="block">
        <div>Email</div>
        <input
          v-model="form.email"
          type="text"
          placeholder="email"
          class="border-2 rounded p-2 block w-full mb-5"
        />
      </label>

      <label>
        <div>Password</div>
        <input
          v-model="form.password"
          type="password"
          placeholder="password"
          class="border-2 rounded p-2 block w-full"
        />
      </label>
      <button class="mt-5 bg-blue-500 rounded text-white p-2 w-full">
        Login
      </button>
    </form>
  </div>
</template>
