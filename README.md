# Create Cognito

Init project for creating AWS Cognito user pool projects with Bitbucket Pipelines and CDK.

It is the Cognito counterpart to `create-auth0-cicd`. Use it with the Cognito options in
`create-react-app` and `create-taxum-api`.

```pnpm dlx @soliantconsulting/create-cognito@latest [<name>]```

The script will place the project in a directory with the given name under the current working directory.

## Using Cognito instead of Auth0

Deploy the generated project, then copy its stack outputs into the app projects:

| Output | `create-react-app` | `create-taxum-api` |
| --- | --- | --- |
| `Issuer` | `VITE_APP_COGNITO_AUTHORITY` | `[jwt] issuer`; `jwksUri` is `Issuer` + `/.well-known/jwks.json` |
| `SpaClientId` | `VITE_APP_COGNITO_CLIENT_ID` | `[jwt] clientIds = [SpaClientId]` |
| `HostedDomain` | `VITE_APP_COGNITO_DOMAIN` | |
| `UserPoolArn` | | CDK `userPoolArn` |

The `[jwt]` settings go in the API's `dev-app-config`.
