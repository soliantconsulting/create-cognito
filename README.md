# Create Cognito

Init project for creating AWS Cognito user pool projects with Bitbucket Pipelines integration.

To create a new project, run the following command:

```pnpm dlx @soliantconsulting/create-cognito@latest [<name>]```

The script will place the project in a directory with the given name under the current working directory.

## Using Cognito instead of Auth0

This is the Cognito counterpart to `create-auth0-cicd`. Pick the Cognito options in
`create-react-app` and `create-taxum-api`, then deploy the generated project. Its README lists the
stack outputs and where each one goes in those projects.
