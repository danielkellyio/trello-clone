import { defineStore, acceptHMRUpdate } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import dataDriver from "@/dataDrivers/dataDriver";
import type { EmailAndPassword, ResetPasswordPayload } from "@/types";

export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => {
    return {
      idToken: useLocalStorage("8BaseIdToken", null),
      user: null,
    };
  },
  getters: {},
  actions: {
    register({ email, password }: EmailAndPassword) {
      dataDriver.register({ email, password });
    },
    login({ email, password }: EmailAndPassword) {
      dataDriver.login({ email, password });
    },
    resetPassword({ oobCode, newPassword, uid }: ResetPasswordPayload) {
      dataDriver.resetPassword({ oobCode, newPassword, uid });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthUserStore, import.meta.hot));
}
