#!/usr/bin/env node

import {
    createAwsEnvTask,
    createBitbucketRepositoryTask,
    createDeployRoleTask,
    createGitTask,
    createNodeVersionTask,
    createPnpmVersionTask,
    createProjectTask,
    runPipeline,
} from "@soliantconsulting/starter-lib";
import { apiSettingsTask } from "./tasks/api-settings.js";
import { poolSettingsTask } from "./tasks/pool-settings.js";
import { spaSettingsTask } from "./tasks/spa-settings.js";

await runPipeline({
    packageName: "@soliantconsulting/create-cognito",
    tasks: [
        createPnpmVersionTask("11.0.0"),
        createNodeVersionTask("26.0.0"),
        createProjectTask(),
        createAwsEnvTask({
            disallowSkip: true,
        }),
        createBitbucketRepositoryTask({
            disallowSkip: true,
        }),
        createDeployRoleTask(),
        poolSettingsTask,
        spaSettingsTask,
        apiSettingsTask,
        createGitTask(),
    ],
});
