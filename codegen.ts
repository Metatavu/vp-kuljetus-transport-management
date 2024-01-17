import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  /* TODO: Update schema location to here and tsconfig.json */
  schema: "",
  documents: "src/**/*.tsx",
  generates: {
    "src/generated/graphql": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
