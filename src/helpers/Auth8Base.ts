// import { Auth, AUTH_STRATEGIES } from "@8base/auth";
/**
 * Creating an Authentication Profile in 8base will provide
 * you with a Client ID and Domain.
 */
const domain = import.meta.env.VITE_APP_AUTH_CALLBACK_URL;
const clientId = import.meta.env.VITE_APP_AUTH_CLIENT_ID;
/**
 * The redirect and logout URIs are all configured in the
 * authentication profile that gets set up in the 8base
 * management console.
 */
const logoutRedirectUri = `${window.location.origin}/logout`;
const redirectUri = `${window.location.origin}/auth/callback`;

const Auth = {
  createClient({}, {}) {
    console.log("Fake auth client... awaiting bug fixes from 8base");
    return {};
  },
};
const AUTH_STRATEGIES = { WEB_8BASE: "WEB_8BASE" };
/**
 * There are multiple auth strategies that can be
 * used when using 8base. By default, specifying
 * 'web_8base' will configure the 8base auth client.
 */
export const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES["WEB_8BASE"],
  },
  {
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri,
  }
);

export default authClient;
