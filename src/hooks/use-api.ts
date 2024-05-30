import { getDefaultStore } from "jotai";
import { useMemo } from "react";
import { getApiClient } from "src/api";
import { authAtom } from "atoms/auth";

export const useApi = () =>
  useMemo(
    () =>
      getApiClient(() => {
        const accessToken = getDefaultStore().get(authAtom)?.tokenRaw;
        return accessToken ? Promise.resolve(accessToken) : Promise.reject("Not authenticated");
      }),
    [],
  );
