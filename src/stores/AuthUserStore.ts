import { defineStore, acceptHMRUpdate } from "pinia";
import type { EmailAndPassword } from "@/types";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { authClient } from "@/helpers/Auth8Base";
import { CURRENT_USER_QUERY, USER_SIGN_UP_MUTATION } from "@/graphql/auth";

export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => {
    return {
      authenticated: !!localStorage.getItem("id_token"),
      idToken: localStorage.getItem("id_token"),
      user: null,
    };
  },
  getters: {},
  actions: {
    register({ email, password }: EmailAndPassword) {
      authClient.authorize();
    },
    login() {
      authClient.authorize();
    },
    logout() {
      authClient.logout();
      this.authenticated = false;
      this.idToken = null;
      localStorage.removeItem("id_token");
    },
    async handleAuthentication() {
      const authResult = await authClient.getAuthorizedData();
      /**
       * Auth headers for communicating with the 8base API.
       */
      const context = {
        headers: {
          authorization: `Bearer ${authResult.idToken}`,
        },
      };

      const { mutate: signUpUser, onDone: onUserSignUp } = useMutation(
        USER_SIGN_UP_MUTATION,
        context
      );
      const { onError } = useQuery(CURRENT_USER_QUERY, context);

      onError(() => {
        signUpUser({
          user: {
            email: authResult.email,
          },
          authProfileId: process.env.VUE_APP_AUTH_PROFILE_ID,
        });
      });
      onUserSignUp(() => {
        this.authenticated = true;
        this.idToken = authResult.idToken;

        localStorage.setItem("id_token", this.idToken as unknown as string);
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthUserStore, import.meta.hot));
}
