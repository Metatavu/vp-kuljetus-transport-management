import InfisicalClient from "infisical-node";
import * as dotenv from "dotenv";

dotenv.config();

const main = async () => {
  console.log("Starting Infisical...");
  const { INFISICAL_TOKEN, INFISICAL_SECRET_PATH } = process.env;

  if (!(INFISICAL_TOKEN && INFISICAL_SECRET_PATH)) {
    throw Error("INFISICAL_TOKEN and INFISICAL_CLIENT_SECRET must be set in the environment.");
  }

  const infisical = new InfisicalClient({
    token: INFISICAL_TOKEN,
  });

  console.log("Getting secrets...");
  await infisical.getAllSecrets({
    attachToProcessEnv: true,
    path: INFISICAL_SECRET_PATH,
    environment: "staging",
    includeImports: false,
  });

  console.log("Secrets loaded.");
};

main();
