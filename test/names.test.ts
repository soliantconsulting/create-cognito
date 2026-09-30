import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveNames, toDomainPrefix } from "../src/names.js";

describe("deriveNames", () => {
    it("builds identifier, resource name and prop prefix from a friendly name", () => {
        assert.deepEqual(deriveNames("My Web", "Client"), {
            identifier: "my-web",
            resourceName: "MyWebClient",
            propPrefix: "myWeb",
        });
    });
});

describe("toDomainPrefix", () => {
    it("joins project name and environment", () => {
        assert.equal(toDomainPrefix("acme-portal", "staging"), "acme-portal-staging");
    });

    it("drops reserved words Cognito rejects", () => {
        assert.equal(toDomainPrefix("acme-cognito", "staging"), "acme-staging");
        assert.equal(toDomainPrefix("aws-amazon-tools", "production"), "tools-production");
    });

    it("lowercases and strips characters Cognito does not allow", () => {
        assert.equal(toDomainPrefix("Acme_Portal", "staging"), "acme-portal-staging");
    });

    it("falls back to a usable prefix when only reserved words are left", () => {
        assert.equal(toDomainPrefix("cognito", "staging"), "auth-staging");
    });

    it("keeps within the 63 character limit", () => {
        const prefix = toDomainPrefix("a".repeat(80), "production");
        assert.ok(prefix.length <= 63);
        assert.ok(prefix.endsWith("-production"));
    });

    it("strips reserved words that reappear after stripping", () => {
        const prefix = toDomainPrefix("cogawsnito", "staging");

        for (const word of ["cognito", "aws", "amazon"]) {
            assert.ok(!prefix.includes(word), prefix);
        }
        assert.ok(prefix.endsWith("-staging"), prefix);
    });
});
