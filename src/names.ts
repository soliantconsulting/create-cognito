import camelcase from "camelcase";
import slug from "slug";

export type DerivedNames = {
    identifier: string;
    resourceName: string;
    propPrefix: string;
};

export const deriveNames = (name: string, suffix: string): DerivedNames => {
    const identifier = slug(name);

    return {
        identifier,
        resourceName: `${camelcase(identifier, { pascalCase: true })}${suffix}`,
        propPrefix: camelcase(identifier),
    };
};

const reservedWords = /aws|amazon|cognito/g;
const maxDomainPrefixLength = 63;

export const toDomainPrefix = (projectName: string, envName: string): string => {
    const base = projectName
        .toLowerCase()
        .replace(reservedWords, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
    const safeBase = base === "" ? "auth" : base;
    const suffix = `-${envName}`;

    return `${safeBase.slice(0, maxDomainPrefixLength - suffix.length).replace(/-$/, "")}${suffix}`;
};
