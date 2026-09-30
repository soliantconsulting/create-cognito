import { fileURLToPath } from "node:url";
import { createSynthTask, type ProjectContext } from "@soliantconsulting/starter-lib";
import type { PoolSettingsContext } from "./pool-settings.js";

export const synthTask = createSynthTask(
    fileURLToPath(new URL("../../skeleton", import.meta.url)),
    {
        ignoreList: (context: ProjectContext & PoolSettingsContext) => {
            const list: string[] = [];

            if (!context.poolSettings.environments.includes("staging")) {
                list.push("src/env-staging.ts.liquid");
            }

            if (!context.poolSettings.environments.includes("production")) {
                list.push("src/env-production.ts.liquid");
            }

            return list;
        },
    },
);
