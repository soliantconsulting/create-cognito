import { ListrEnquirerPromptAdapter } from "@listr2/prompt-adapter-enquirer";
import type { ListrTask } from "listr2";
import slug from "slug";

export type CognitoEnvironment = "staging" | "production";

const environmentOrder: CognitoEnvironment[] = ["staging", "production"];

export type PoolSettingsContext = {
    poolSettings: {
        friendlyName: string;
        identifier: string;
        fromAddress: string;
        environments: CognitoEnvironment[];
    };
};

export const parseEnvironments = (selected: string[]): CognitoEnvironment[] => {
    const environments = environmentOrder.filter((environment) => selected.includes(environment));

    if (environments.length === 0) {
        throw new Error("Select at least one environment");
    }

    return environments;
};

export const poolSettingsTask: ListrTask<Partial<PoolSettingsContext>> = {
    title: "Gather user pool settings",
    task: async (context, task): Promise<void> => {
        const prompt = task.prompt(ListrEnquirerPromptAdapter);

        const answers = await prompt.run<{ friendlyName: string; fromAddress: string }>([
            {
                name: "friendlyName",
                type: "input",
                message: "Friendly name (e.g. Acme Portal):",
            },
            {
                name: "fromAddress",
                type: "input",
                message: "Email from address:",
            },
        ]);

        let environments: CognitoEnvironment[] | null = null;

        while (environments === null) {
            const selected = await prompt.run<string[]>({
                type: "multiselect",
                message: "Environments:",
                choices: [
                    { message: "Staging", name: "staging" },
                    { message: "Production", name: "production" },
                ],
            });

            try {
                environments = parseEnvironments(selected);
            } catch (error) {
                task.output = (error as Error).message;
            }
        }

        context.poolSettings = {
            friendlyName: answers.friendlyName,
            identifier: slug(answers.friendlyName),
            fromAddress: answers.fromAddress,
            environments,
        };
    },
};
