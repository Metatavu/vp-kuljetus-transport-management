import NotAuthorizedView from "components/generic/not-authorized-view";
import { useAtom, useSetAtom } from "jotai";
import Keycloak from "keycloak-js";
import { ReactNode, useCallback, useEffect, useState } from "react";
import config from "../../app/config";
import { authAtom, userProfileAtom } from "../../atoms/auth";

type Props = {
  children: ReactNode;
};

const keycloak = new Keycloak(config.auth);

const AuthenticationProvider = ({ children }: Props) => {
  const [_auth, setAuth] = useAtom(authAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const updateAuthData = useCallback(() => {
    if (!(keycloak.tokenParsed && keycloak.token)) return;

    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    const hasAccess = roles.includes("manager");

    setAuth({
      token: keycloak.tokenParsed,
      tokenRaw: keycloak.token,
      logout: () => keycloak.logout({ redirectUri: `${window.location.origin}` }),
    });

    setUserProfile(keycloak.profile);
    setIsAuthorized(hasAccess);
  }, [setAuth, setUserProfile]);

  const clearAuthData = useCallback(() => {
    setAuth(undefined);
    setUserProfile(undefined);
    setIsAuthorized(false);
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

      updateAuthData();
    } catch (error) {
      console.error(error);
    }
  }, [clearAuthData, updateAuthData]);

  /**
   * Initializes authentication when component mounts
   */
  useEffect(() => {
    if (keycloak.authenticated === undefined) initAuth();
  }, [initAuth]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (await keycloak.updateToken(70)) updateAuthData();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateAuthData]);

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return <NotAuthorizedView logout={() => keycloak.logout({ redirectUri: `${window.location.origin}` })} />;
  }

  return children;
};

export default AuthenticationProvider;
