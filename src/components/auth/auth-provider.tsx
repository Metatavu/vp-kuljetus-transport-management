import { useAtom, useSetAtom } from "jotai";
import Keycloak from "keycloak-js";
import { ReactNode, useCallback, useEffect } from "react";
import config from "../../app/config";
import { authAtom, userProfileAtom } from "../../atoms/auth";

type Props = {
  children: ReactNode;
};

const keycloak = new Keycloak(config.auth);

const AuthenticationProvider = ({ children }: Props) => {
  const [auth, setAuth] = useAtom(authAtom);
  const setUserProfile = useSetAtom(userProfileAtom);

  const updateAuthData = useCallback(() => {
    if (!(keycloak.tokenParsed && keycloak.token)) return;

    setAuth({
      token: keycloak.tokenParsed,
      tokenRaw: keycloak.token,
      logout: () => keycloak.logout({ redirectUri: `${window.location.origin}` }),
    });

    setUserProfile(keycloak.profile);
  }, [setAuth, setUserProfile]);

  const clearAuthData = useCallback(() => {
    setAuth(undefined);
    setUserProfile(undefined);
  }, [setAuth, setUserProfile]);

  const initAuth = useCallback(async () => {
    try {
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
        checkLoginIframe: false,
      });
    } catch (error) {
      console.error(error);
    }
  }, [clearAuthData, updateAuthData]);

  /**
   * Initializes authentication when component mounts
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (keycloak.authenticated === undefined) initAuth();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (await keycloak.updateToken(70)) updateAuthData();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateAuthData]);

  if (!auth) return null;

  return children;
};

export default AuthenticationProvider;
