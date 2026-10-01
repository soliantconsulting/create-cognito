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

/**
 * SPA and API names also become TypeScript identifiers, which cannot start with a digit.
 */
export const validateAppName = (name: string): true | string => {
    const identifier = slug(name);

    if (identifier === "") {
        return "Enter a name";
    }

    if (/^\d/.test(identifier)) {
        return "Start with a letter";
    }

    return true;
};

const reservedWords = /aws|amazon|cognito/g;
const maxDomainPrefixLength = 63;

/**
 * Cleans a name into the base of a Cognito domain prefix. Cognito rejects prefixes containing
 * "aws", "amazon" or "cognito", and allows only lowercase letters, numbers and hyphens.
 */
export const toDomainPrefixBase = (name: string): string => {
    let stripped = name.toLowerCase();
    let previous: string;

    do {
        previous = stripped;
        stripped = stripped.replace(reservedWords, "");
    } while (stripped !== previous);

    const base = stripped
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");

    return base === "" ? "auth" : base;
};

export const toDomainPrefix = (name: string, envName: string): string => {
    const suffix = `-${envName}`;

    return `${toDomainPrefixBase(name)
        .slice(0, maxDomainPrefixLength - suffix.length)
        .replace(/-$/, "")}${suffix}`;
};
