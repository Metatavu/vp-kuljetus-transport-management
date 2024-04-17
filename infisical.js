import InfisicalClient from "infisical-node";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This script is used to load secrets from Infisical into the environment.
 */
const main = async () => {
  const { INFISICAL_TOKEN, INFISICAL_SECRET_PATH, INFISICAL_ENVIRONMENT } = process.env;

  if (!(INFISICAL_TOKEN && INFISICAL_SECRET_PATH && INFISICAL_ENVIRONMENT)) {
    throw Error("INFISICAL_TOKEN, INFISICAL_SECRET_PATH and INFISICAL_ENVIRONMENT must be set in the environment.");
  }

  const infisical = new InfisicalClient({
    token: INFISICAL_TOKEN,
  });

  const secrets = await infisical.getAllSecrets({
    attachToProcessEnv: false,
    path: INFISICAL_SECRET_PATH,
    environment: INFISICAL_ENVIRONMENT,
    includeImports: false,
  });

  for (const secret of secrets) {
    const { secretName, secretValue } = secret;
    console.log(`${secretName}=${secretValue}`);
  }
};

main();
