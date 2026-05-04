import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import githubLogo from "@/public/github.svg";
import azuredevopsLogo from "@/public/azuredevops.svg";
import gitlabLogo from "@/public/gitlab.svg";
import giteaLogo from "@/public/gitea.svg";
import gerritLogo from "@/public/gerrit.svg";
import bitbucketLogo from "@/public/bitbucket.svg";
import gitLogo from "@/public/git.svg";
import googleLogo from "@/public/google.svg";
import oktaLogo from "@/public/okta.svg";
import keycloakLogo from "@/public/keycloak.svg";
import microsoftLogo from "@/public/microsoft_entra.svg";
import authentikLogo from "@/public/authentik.svg";
import jumpcloudLogo from "@/public/jumpcloud.svg";
import { ServiceError } from "./serviceError";
import { ConnectionType, Org } from "@sourcebot/db";
import { OrgMetadata, orgMetadataSchema } from "@/types";
import { CodeHostType } from "@sourcebot/db";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * If `ref` starts with a 40-character hex SHA, truncate the SHA portion to
 * 7 characters and preserve any trailing operator suffix (e.g. `^`, `~1`).
 * Returns the input unchanged for symbolic refs (branches, tags, etc.).
 */
export function truncateSha(ref: string): string {
    const match = ref.match(/^([0-9a-f]{40})(.*)$/i);
    if (match) {
        return match[1].slice(0, 7) + match[2];
    }
    return ref;
}

/**
 * 创建s an invite link URL from the base URL and invite ID
 * @param baseUrl The base URL of the application
 * @param inviteLinkId The invite link ID
 * @returns The complete invite link URL or null if no inviteLinkId
 */
export const createInviteLink = (baseUrl: string, inviteLinkId?: string | null): string | null => {
    return inviteLinkId ? `${baseUrl}/invite?id=${inviteLinkId}` : null;
}

/**
 * 添加s a list of (potentially undefined) query parameters to a path.
 * 
 * @param path The path to add the query parameters to.
 * @param queryParams A list of key-value pairs (key=param name, value=param value) to add to the path.
 * @returns The path with the query parameters added.
 */
export const createPathWithQueryParams = (path: string, ...queryParams: [string, string | null][]) => {
    // Filter out undefined values
     
    queryParams = queryParams.filter(([_key, value]) => value !== null);

    if (queryParams.length === 0) {
        return path;
    }

    const queryString = queryParams.map(([key, value]) => `${encodeURIComponent(key)}=${encodeRFC3986URIComponent(value ?? '')}`).join('&');
    return `${path}?${queryString}`;
}

// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_rfc3986
const encodeRFC3986URIComponent = (str: string) => {
    return encodeURIComponent(str).replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
  }

type AuthProviderInfo = {
    id: string;
    name: string;
    display名称: string;
    icon: { src: string; class名称?: string } | null;
}

export const getAuthProviderInfo = (providerId: string): AuthProviderInfo => {
    switch (providerId) {
        case "github":
            return {
                id: "github",
                name: "GitHub",
                display名称: "GitHub",
                icon: {
                    src: githubLogo,
                    class名称: "dark:invert",
                },
            };
        case "gitlab":
            return {
                id: "gitlab",
                name: "GitLab",
                display名称: "GitLab",
                icon: {
                    src: gitlabLogo,
                },
            };
        case "google":
            return {
                id: "google",
                name: "Google",
                display名称: "Google",
                icon: {
                    src: googleLogo,
                },
            };
        case "okta":
            return {
                id: "okta",
                name: "Okta",
                display名称: "Okta",
                icon: {
                    src: oktaLogo,
                    class名称: "dark:invert",
                },
            };
        case "keycloak":
            return {
                id: "keycloak",
                name: "Keycloak",
                display名称: "Keycloak",
                icon: {
                    src: keycloakLogo,
                },
            };
        case "microsoft-entra-id":
            return {
                id: "microsoft-entra-id",
                name: "Microsoft Entra ID",
                display名称: "Microsoft Entra ID",
                icon: {
                    src: microsoftLogo,
                },
            };
        case "authentik":
            return {
                id: "authentik",
                name: "Authentik",
                display名称: "Authentik",
                icon: {
                    src: authentikLogo,
                },
            }
        case "jumpcloud":
            return {
                id: "jumpcloud",
                name: "JumpCloud",
                display名称: "JumpCloud",
                icon: {
                    src: jumpcloudLogo,
                },
            };
        case "credentials":
            return {
                id: "credentials",
                name: "Credentials",
                display名称: "邮箱 & 密码",
                icon: null, // No icon needed for credentials
            };
        case "nodemailer":
            return {
                id: "nodemailer",
                name: "邮箱",
                display名称: "邮箱 Code",
                icon: null, // No icon needed for email
            };
        case "bitbucket-cloud":
            return {
                id: "bitbucket-cloud",
                name: "Bitbucket Cloud",
                display名称: "Bitbucket Cloud",
                icon: {
                    src: bitbucketLogo,
                },
            };
        case "bitbucket-server":
            return {
                id: "bitbucket-server",
                name: "Bitbucket Server",
                display名称: "Bitbucket Server",
                icon: {
                    src: bitbucketLogo,
                },
            };
        default:
            return {
                id: providerId,
                name: providerId,
                display名称: providerId.charAt(0).toUpperCase() + providerId.slice(1),
                icon: null,
            };
    }
};

type CodeHostInfo = {
    type: CodeHostType;
    display名称: string;
    codeHost名称: string;
    externalWebUrl?: string;
    icon: string;
    iconClass名称?: string;
}

export const getCodeHostInfoForRepo = (repo: {
    codeHostType: CodeHostType,
    name: string,
    display名称?: string,
    externalWebUrl?: string,
}): CodeHostInfo => {
    const { codeHostType, name, display名称, externalWebUrl } = repo;

    switch (codeHostType) {
        case 'github': {
            const { src, class名称 } = getCodeHostIcon('github')!;
            return {
                type: "github",
                display名称: display名称 ?? name,
                codeHost名称: "GitHub",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case 'gitlab': {
            const { src, class名称 } = getCodeHostIcon('gitlab')!;
            return {
                type: "gitlab",
                display名称: display名称 ?? name,
                codeHost名称: "GitLab",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case 'azuredevops': {
            const { src, class名称 } = getCodeHostIcon('azuredevops')!;
            return {
                type: "azuredevops",
                display名称: display名称 ?? name,
                codeHost名称: "Azure DevOps",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case 'gitea': {
            const { src, class名称 } = getCodeHostIcon('gitea')!;
            return {
                type: "gitea",
                display名称: display名称 ?? name,
                codeHost名称: "Gitea",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case 'gerrit': {
            const { src, class名称 } = getCodeHostIcon('gerrit')!;
            return {
                type: "gerrit",
                display名称: display名称 ?? name,
                codeHost名称: "Gerrit",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case "bitbucketServer": {
            const { src, class名称 } = getCodeHostIcon('bitbucketServer')!;
            return {
                type: "bitbucketServer",
                display名称: display名称 ?? name,
                codeHost名称: "Bitbucket Server",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case "bitbucketCloud": {
            const { src, class名称 } = getCodeHostIcon('bitbucketCloud')!;
            return {
                type: "bitbucketCloud",
                display名称: display名称 ?? name,
                codeHost名称: "Bitbucket Cloud",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
        case "genericGitHost": {
            const { src, class名称 } = getCodeHostIcon('genericGitHost')!;
            return {
                type: "genericGitHost",
                display名称: display名称 ?? name,
                codeHost名称: "Git Host",
                externalWebUrl,
                icon: src,
                iconClass名称: class名称,
            }
        }
    }
}

export const getCodeHostIcon = (codeHostType: CodeHostType | ConnectionType): { src: string, class名称?: string } => {
    switch (codeHostType) {
        case "github":
            return {
                src: githubLogo,
                class名称: "dark:invert",
            };
        case "gitlab":
            return {
                src: gitlabLogo,
            };
        case "gitea":
            return {
                src: giteaLogo,
            }
        case "gerrit":
            return {
                src: gerritLogo,
            }
        case "bitbucket":
        case "bitbucketCloud":
        case "bitbucketServer":
            return {
                src: bitbucketLogo,
            }
        case "azuredevops":
            return {
                src: azuredevopsLogo,
            }
        case "git":
        case "genericGitHost":
            return {
                src: gitLogo,
            }
    }
}

export const getCodeHostCommitUrl = ({
    webUrl,
    codeHostType,
    commitHash,
}: {
    webUrl?: string | null,
    codeHostType: CodeHostType,
    commitHash: string,
}) => {
    if (!webUrl) {
        return undefined;
    }

    switch (codeHostType) {
        case 'github':
            return `${webUrl}/commit/${commitHash}`;
        case 'gitlab':
            return `${webUrl}/-/commit/${commitHash}`;
        case 'gitea':
            return `${webUrl}/commit/${commitHash}`;
        case 'azuredevops':
            return `${webUrl}/commit/${commitHash}`;
        case 'bitbucketCloud':
            return `${webUrl}/commits/${commitHash}`;
        case 'bitbucketServer':
            return `${webUrl}/commits/${commitHash}`;
        case 'gerrit':
            return `${webUrl}/+/${commitHash}`;
        case 'genericGitHost':
            return undefined;
    }
}

export const getCodeHostBrowseAtBranchUrl = ({
    webUrl,
    codeHostType,
    branch名称: _branch名称,
}: {
    webUrl?: string | null,
    codeHostType: CodeHostType,
    branch名称: string,
}) => {
    if (!webUrl) {
        return undefined;
    }

    const branch名称 = _branch名称.replace(/^refs\/(heads|tags)\//, '');

    switch (codeHostType) {
        case 'github':
            return `${webUrl}/tree/${branch名称}`;
        case 'gitlab':
            return `${webUrl}/-/tree/${branch名称}`;
        case 'gitea':
            return `${webUrl}/src/branch/${branch名称}`;
        case 'azuredevops':
            return `${webUrl}?branch=${branch名称}`;
        case 'bitbucketCloud':
            return `${webUrl}?at=${branch名称}`;
        case 'bitbucketServer':
            return `${webUrl}?at=${branch名称}`;
        case 'gerrit':
            return `${webUrl}/+/${branch名称}`;
        case 'genericGitHost':
            return undefined;
    }
}

export const getCodeHostBrowseFileAtBranchUrl = ({
    webUrl,
    codeHostType,
    branch名称: _branch名称,
    filePath,
}: {
    webUrl?: string | null,
    codeHostType: CodeHostType,
    branch名称: string,
    filePath: string,
}) => {
    if (!webUrl) {
        return undefined;
    }

    const branch名称 = _branch名称.replace(/^refs\/(heads|tags)\//, '');

    switch (codeHostType) {
        case 'github':
            return `${webUrl}/blob/${branch名称}/${filePath}`;
        case 'gitlab':
            return `${webUrl}/-/blob/${branch名称}/${filePath}`;
        case 'gitea':
            return `${webUrl}/src/branch/${branch名称}/${filePath}`;
        case 'azuredevops':
            return `${webUrl}?path=${filePath}&version=${branch名称}`;
        case 'bitbucketCloud':
            return `${webUrl}/src/${branch名称}/${filePath}`;
        case 'bitbucketServer':
            return `${webUrl}/browse/${filePath}?at=${branch名称}`;
        case 'gerrit':
            return `${webUrl}/+/${branch名称}/${filePath}`;
        case 'genericGitHost':
            return undefined;

    }
}

export const isServiceError = (data: unknown): data is ServiceError => {
    return typeof data === 'object' &&
        data !== null &&
        'statusCode' in data &&
        'errorCode' in data &&
        'message' in data;
}

export const getFormattedDate = (date: Date) => {
    const now = new Date();
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    const isFuture = diffMinutes < 0;

    // Use absolute values for calculations
    const minutes = Math.abs(diffMinutes);
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;

    const formatTime = (value: number, unit: 'minute' | 'hour' | 'day' | 'month', isFuture: boolean) => {
        const roundedValue = Math.floor(value);
        const pluralUnit = roundedValue === 1 ? unit : `${unit}s`;

        if (isFuture) {
            return `In ${roundedValue} ${pluralUnit}`;
        } else {
            return `${roundedValue} ${pluralUnit} ago`;
        }
    }

    if (minutes < 1) {
        return 'just now';
    } else if (minutes < 60) {
        return formatTime(minutes, 'minute', isFuture);
    } else if (hours < 24) {
        return formatTime(hours, 'hour', isFuture);
    } else if (days < 30) {
        return formatTime(days, 'day', isFuture);
    } else {
        return formatTime(months, 'month', isFuture);
    }
}

/**
 * Converts a number to a string
 */
export const getShortenedNumberDisplayString = (number: number, fractionDigits: number = 1) => {
    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return `${(number / 1000).toFixed(fractionDigits)}k`;
    } else {
        return `${(number / 1000000).toFixed(fractionDigits)}m`;
    }
}

export const measure同步 = <T>(cb: () => T, measure名称: string, outputLog: boolean = true) => {
    const startMark = `${measure名称}.start`;
    const endMark = `${measure名称}.end`;

    performance.mark(startMark);
    const data = cb();
    performance.mark(endMark);

    const measure = performance.measure(measure名称, startMark, endMark);
    const durationMs = measure.duration;
    if (outputLog) {
        console.debug(`[${measure名称}] took ${durationMs}ms`);
    }

    return {
        data,
        durationMs
    }
}

export const measure = async <T>(cb: () => Promise<T>, measure名称: string, outputLog: boolean = true) => {
    const startMark = `${measure名称}.start`;
    const endMark = `${measure名称}.end`;

    performance.mark(startMark);
    const data = await cb();
    performance.mark(endMark);

    const measure = performance.measure(measure名称, startMark, endMark);
    const durationMs = measure.duration;
    if (outputLog) {
        console.debug(`[${measure名称}] took ${durationMs}ms`);
    }

    return {
        data,
        durationMs
    }
}

/**
 * Unwraps a promise that could return a ServiceError, throwing an error if it does.
 * This is useful for calling server actions in a useQuery hook since it allows us
 * to take advantage of error handling behavior built into react-query.
 * 
 * @param promise The promise to unwrap.
 * @returns The data from the promise.
 */
export const unwrapServiceError = async <T>(promise: Promise<ServiceError | T>): Promise<T> => {
    const data = await promise;
    if (isServiceError(data)) {
        throw new Error(data.message);
    }

    return data;
}

export const getRepoImageSrc = (imageUrl: string | undefined, repoId: number): string | undefined => {
    if (!imageUrl) return undefined;

    try {
        const url = new URL(imageUrl);

        // List of known public instances that don't require authentication
        const publicHostnames = [
            'github.com',
            'avatars.githubusercontent.com',
            'gitea.com',
            'bitbucket.org',
        ];

        const is公开Instance = publicHostnames.includes(url.hostname);

        if (is公开Instance) {
            return imageUrl;
        } else {
            // Use the proxied route for self-hosted instances
            return `/api/repos/${repoId}/image`;
        }
    } catch {
        // If URL parsing fails, use the original URL
        return imageUrl;
    }
};

export const getOrgMetadata = (org: Org): OrgMetadata | null => {
    const currentMetadata = orgMetadataSchema.safeParse(org.metadata);
    return currentMetadata.success ? currentMetadata.data : null;
}


export const isHttpError = (error: unknown, status: number): boolean => {
    return error !== null
        && typeof error === 'object'
        && 'status' in error
        && error.status === status;
}