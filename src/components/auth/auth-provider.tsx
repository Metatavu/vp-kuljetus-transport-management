import { useCallback, useEffect } from "react";
import Keycloak from "keycloak-js";
import { useAtom, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../atoms/auth";
import config from "../../app/config";

type Props = {
  children: JSX.Element;
};

const keycloak = new Keycloak(config.auth);

const AuthenticationProvider = ({ children }: Props) => {
  const [auth, setAuth] = useAtom(authAtom);
  const setUserProfile = useSetAtom(userProfileAtom);

  const updateAuthData = useCallback(() => {
    setAuth({
      token: keycloak.tokenParsed!,
      tokenRaw: keycloak.token!,
      logout: () => keycloak.logout({ redirectUri: `${window.location.origin}` })
    });

    setUserProfile(keycloak.profile);
  }, [auth]);

  const clearAuthData = useCallback(() => {
    setAuth(undefined);
    setUserProfile(undefined);
  }, [auth]);

  const initAuth = useCallback(async () => {
    try {
      keycloak.onTokenExpired = () => keycloak.updateToken(5);

      keycloak.onAuthRefreshError = () => keycloak.login();
      keycloak.onAuthRefreshSuccess = () => updateAuthData();

      keycloak.onAuthError = (error) => console.error(error);
      keycloak.onAuthSuccess = async () => {
        try {
          await keycloak.loadUserProfile();
        } catch (error) {
          console.error("Could not load user profile", error);
        }

        updateAuthData();
      };

      keycloak.onAuthLogout = () => {
        clearAuthData();
        keycloak.login();
      };

      await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false
      });
    } catch (error) {
      console.error(error);
    }
  }, [auth]);

  /**
   * Initializes authentication when component mounts
   */
  useEffect(() => {
    if (keycloak.authenticated === undefined) initAuth();
  }, []);

  if (!auth) return null;

  return children;
};

export default AuthenticationProvider;