import { defineStore, acceptHMRUpdate } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => {
    return {
      idToken: useLocalStorage("8BaseIdToken", null),
      user: null,
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthUserStore, import.meta.hot));
}
