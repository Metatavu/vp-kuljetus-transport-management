/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
