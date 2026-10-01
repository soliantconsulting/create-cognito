# Create Cognito

Init project for creating AWS Cognito user pool projects with Bitbucket Pipelines integration.

To create a new project, run the following command:

```pnpm dlx @soliantconsulting/create-cognito@latest [<name>]```

The script will place the project in a directory with the given name under the current working directory.

## Using Cognito instead of Auth0

This is the Cognito counterpart to `create-auth0-cicd`. Pick the Cognito options in
`create-react-app` and `create-taxum-api`, deploy the generated project, then copy its stack
outputs into those projects:

| Output | `create-react-app` | `create-taxum-api` |
| --- | --- | --- |
| `Issuer` | `VITE_APP_COGNITO_AUTHORITY` | `[jwt] issuer`; `jwksUri` is `Issuer` + `/.well-known/jwks.json` |
| `SpaClientId` | `VITE_APP_COGNITO_CLIENT_ID` | `[jwt] clientIds = [SpaClientId]` |
| `HostedDomain` | `VITE_APP_COGNITO_DOMAIN` | |
| `UserPoolArn` | | CDK `userPoolArn` |

The `[jwt]` settings go in the API's `dev-app-config.toml` locally and in AppConfig once deployed.
