#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import {
    type AwsEnvContext,
    type DeployRoleContext,
    type ProjectContext,
    runPipeline,
} from "@soliantconsulting/starter-lib";
import type { ApiSettingsContext } from "./tasks/api-settings.js";
import type { DomainPrefixContext } from "./tasks/domain-prefixes.js";
import type { PoolSettingsContext } from "./tasks/pool-settings.js";
import type { SpaSettingsContext } from "./tasks/spa-settings.js";
import { synthTask } from "./tasks/synth.js";

type BaseContext = ProjectContext &
    AwsEnvContext &
    DeployRoleContext &
    PoolSettingsContext &
    SpaSettingsContext &
    ApiSettingsContext &
    DomainPrefixContext;

const variant = process.argv[2];
const minimal = variant === "minimal";
const productionOnly = variant === "production";
const directory = minimal
    ? "test-synth-minimal"
    : productionOnly
      ? "test-synth-production"
      : "test-synth";

await runPipeline({
    packageName: "@soliantconsulting/create-cognito",
    tasks: [synthTask],
    baseContext: {
        project: {
            name: directory,
            title: "Test Synth",
            path: fileURLToPath(new URL(`../${directory}`, import.meta.url)),
        },
        awsEnv: {
            accountId: "123456789012",
            region: "us-east-1",
        },
        deployRole: {
            arn: "arn://unknown",
        },
        poolSettings: {
            friendlyName: 'Test "Pool"',
            identifier: "test-pool",
            fromAddress: "auth@example.com",
            environments: minimal
                ? ["staging"]
                : productionOnly
                  ? ["production"]
                  : ["staging", "production"],
            mfa: minimal ? "off" : productionOnly ? "optional" : "required",
        },
        spaSettings: minimal
            ? null
            : {
                  name: "Test SPA",
                  identifier: "test-spa",
                  resourceName: "TestSpaClient",
                  propPrefix: "testSpa",
              },
        apiSettings: minimal
            ? null
            : {
                  name: "Test API",
                  identifier: "test-api",
                  resourceName: "TestApiResourceServer",
              },
        domainPrefixes: {
            staging: `${directory}-staging`,
            production: `${directory}-production`,
        },
    } satisfies BaseContext,
});
