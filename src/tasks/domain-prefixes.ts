import { ListrEnquirerPromptAdapter } from "@listr2/prompt-adapter-enquirer";
import { type ProjectContext, requireContext } from "@soliantconsulting/starter-lib";
import type { ListrTask } from "listr2";
import { toDomainPrefix, toDomainPrefixBase } from "../names.js";
import type { CognitoEnvironment } from "./pool-settings.js";

export type DomainPrefixContext = {
    domainPrefixes: Record<CognitoEnvironment, string>;
};

export const domainPrefixesTask: ListrTask<Partial<ProjectContext & DomainPrefixContext>> = {
    title: "Configure Cognito domain prefix",
    task: async (context, task): Promise<void> => {
        const projectContext = requireContext(context, "project");
        const prompt = task.prompt(ListrEnquirerPromptAdapter);

        const base = await prompt.run<string>({
            type: "input",
            message: "Cognito domain prefix:",
            initial: toDomainPrefixBase(projectContext.name),
            footer:
                "Shared by every AWS account in the region, so make it specific (e.g. client-app).\n" +
                "The environment is appended, e.g. <prefix>-staging.",
            validate: (value: string) =>
                toDomainPrefixBase(value) === value ||
                'Use lowercase letters, numbers and hyphens, without "aws", "amazon" or "cognito"',
        });

        context.domainPrefixes = {
            staging: toDomainPrefix(base, "staging"),
            production: toDomainPrefix(base, "production"),
        };
    },
};
