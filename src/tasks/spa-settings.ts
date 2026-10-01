import { ListrEnquirerPromptAdapter } from "@listr2/prompt-adapter-enquirer";
import type { ListrTask } from "listr2";
import { deriveNames, validateAppName } from "../names.js";

export type SpaSettingsContext = {
    spaSettings: {
        name: string;
        identifier: string;
        resourceName: string;
        propPrefix: string;
    } | null;
};

export const spaSettingsTask: ListrTask<Partial<SpaSettingsContext>> = {
    title: "Gather SPA settings",
    task: async (context, task): Promise<void> => {
        const prompt = task.prompt(ListrEnquirerPromptAdapter);

        const enableSpa = await prompt.run<boolean>({
            type: "toggle",
            message: "Enable SPA:",
            initial: true,
        });

        if (!enableSpa) {
            context.spaSettings = null;
            task.skip("SPA disabled");
            return;
        }

        const name = await prompt.run<string>({
            type: "input",
            message: "Friendly name (e.g. My Web):",
            validate: validateAppName,
        });

        context.spaSettings = { name, ...deriveNames(name, "Client") };
    },
};
