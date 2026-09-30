import { type ProjectContext, requireContext } from "@soliantconsulting/starter-lib";
import type { ListrTask } from "listr2";
import { toDomainPrefix } from "../names.js";
import type { CognitoEnvironment } from "./pool-settings.js";

export type DomainPrefixContext = {
    domainPrefixes: Record<CognitoEnvironment, string>;
};

export const domainPrefixesTask: ListrTask<Partial<ProjectContext & DomainPrefixContext>> = {
    title: "Derive Cognito domain prefixes",
    task: async (context): Promise<void> => {
        const projectContext = requireContext(context, "project");

        context.domainPrefixes = {
            staging: toDomainPrefix(projectContext.name, "staging"),
            production: toDomainPrefix(projectContext.name, "production"),
        };
    },
};
