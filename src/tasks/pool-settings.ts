import { ListrEnquirerPromptAdapter } from "@listr2/prompt-adapter-enquirer";
import type { ListrTask } from "listr2";
import slug from "slug";

export type CognitoEnvironment = "staging" | "production";

type MfaMode = "required" | "optional" | "off";

export type PoolSettingsContext = {
    poolSettings: {
        friendlyName: string;
        identifier: string;
        fromAddress: string;
        environments: CognitoEnvironment[];
        mfa: MfaMode;
    };
};

type PoolAnswers = {
    friendlyName: string;
    fromAddress: string;
};

const emailAddressPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export const poolSettingsTask: ListrTask<Partial<PoolSettingsContext>> = {
    title: "Gather user pool settings",
    task: async (context, task): Promise<void> => {
        const prompt = task.prompt(ListrEnquirerPromptAdapter);

        const answers = await prompt.run<PoolAnswers>([
            {
                name: "friendlyName",
                type: "input",
                message: "Friendly name (e.g. Acme Portal):",
                validate: (value: string) => slug(value) !== "" || "Enter a name",
            },
            {
                name: "fromAddress",
                type: "input",
                message: "Email from address:",
                validate: (value: string) =>
                    emailAddressPattern.test(value.trim()) || "Enter an email address",
            },
        ]);

        const environments = await prompt.run<CognitoEnvironment[]>({
            type: "multiselect",
            message: "Environments:",
            choices: [
                { message: "Staging", name: "staging" },
                { message: "Production", name: "production" },
            ],
            validate: (value: string[]) => value.length > 0 || "Select at least one environment",
        });

        const mfa = await prompt.run<MfaMode>({
            type: "select",
            message: "MFA:",
            choices: [
                { message: "Required (authenticator app)", name: "required" },
                { message: "Optional (the app must offer its own setup screen)", name: "optional" },
                { message: "Off", name: "off" },
            ],
        });

        context.poolSettings = {
            friendlyName: answers.friendlyName,
            identifier: slug(answers.friendlyName),
            fromAddress: answers.fromAddress.trim(),
            environments,
            mfa,
        };
    },
};
