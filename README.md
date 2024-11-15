## VP-Kuljetus Transport Management

### Running the project

- Change to correct node version (found in `.nvmrc`)
  - NOTE: If you're using [nvm](https://github.com/nvm-sh/nvm) for managing node versions
  - `nvm use`
  - For instructions on setting up automatic node version switching see [this](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- `npm i`
- See [Environment variables](#environment-variables) for setting up automatic secret injection from Hashicorp Vault
- After this, you can run the project with `withhcv npm run start`

### Linting / formatting

This project uses Biome.js. Please install Biome's [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) to get automatic linting + formatting on save, suggestions and refactoring.

### Routing

This project is using [Tanstack Router](https://tanstack.com/router/v1/docs/). It is fully type-safe.

Routing is file-based and we are using [flat routing](https://tanstack.com/router/v1/docs/framework/react/guide/route-trees#flat-routes). Route files are inside `/routes` folder. More info about how route file naming conventions found [here](https://tanstack.com/router/v1/docs/framework/react/guide/route-trees#flat-routes).

Route typings and runtime definitions are generated automatically by Tanstack Router Vite plugin, when the project is started.

> **NOTE!** Remember to start the project locally when creating new routes to get all the functionality and type-safety of the router during development.

Tanstack Router also provides [Devtools](https://tanstack.com/router/v1/docs/framework/react/devtools). They help resolving router issues during development. Devtools will mount as a fixed, floating toggle in the corner of the screen to show and hide the devtools.

### Localization

This project uses i18next for localization. Different features about what i18next can do can be found in the docs [starting from here](https://www.i18next.com/translation-function/essentials). As this is a React project, it uses react-i18next for compatibility layer. The documentation for it can be found [here](https://react.i18next.com/).

### Environment variables

- add `.env` file with `VAULT_PATH` secret. Contact project team to acquire the secret value and the credentials to HCV.

### To update spec
Run `git submodule update --init`

### To generate API
Run `npm run build-client`