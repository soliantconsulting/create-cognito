import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEnvironments } from "../src/tasks/pool-settings.js";

describe("parseEnvironments", () => {
    it("keeps staging before production", () => {
        assert.deepEqual(parseEnvironments(["production", "staging"]), ["staging", "production"]);
    });
});
