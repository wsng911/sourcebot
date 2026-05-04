'use client';

import { ServiceError } from "@/lib/serviceError";
import { GetVersionResponse, ListReposQueryParams, ListReposResponse } from "@/lib/types";
import { isServiceError } from "@/lib/utils";
import {
    搜索Request,
    搜索Response,
} from "@/features/search";
import {
    FindRelatedSymbolsRequest,
    FindRelatedSymbolsResponse,
} from "@/features/codeNav/types";
import {
    Commit,
    GetFilesRequest,
    GetFilesResponse,
    GetTreeRequest,
    GetTreeResponse,
    FileSourceRequest,
    FileSourceResponse,
    ListCommitsQueryParams,
    ListCommitsResponse,
} from "@/features/git";
import type { Permission同步状态Response } from "../(server)/ee/permission同步状态/api";
import type { Account同步状态Response } from "../(server)/ee/accountPermission同步Job状态/api";
import type {
    搜索Chat分享ableMembersQueryParams,
    搜索Chat分享ableMembersResponse,
} from "../(server)/ee/chat/[chatId]/searchMembers/route";

export const search = async (body: 搜索Request): Promise<搜索Response | ServiceError> => {
    const result = await fetch("/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        body: JSON.stringify(body),
    }).then(response => response.json());

    if (isServiceError(result)) {
        return result;
    }

    return result as 搜索Response | ServiceError;
}

export const getFileSource = async (queryParams: FileSourceRequest): Promise<FileSourceResponse | ServiceError> => {
    const url = new URL("/api/source", window.location.origin);
    for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.set(key, value.toString());
    }

    const result = await fetch(url, {
        method: "GET",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        }
    }).then(response => response.json());

    return result as FileSourceResponse | ServiceError;
}

export const listRepos = async (queryParams: ListReposQueryParams): Promise<ListReposResponse | ServiceError> => {
    const url = new URL("/api/repos", window.location.origin);
    for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.set(key, value.toString());
    }

    const result = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
    }).then(response => response.json());

    return result as ListReposResponse | ServiceError;
}

export const getVersion = async (): Promise<GetVersionResponse> => {
    const result = await fetch("/api/version", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
    }).then(response => response.json());
    return result as GetVersionResponse;
}

export const find搜索BasedSymbolReferences = async (body: FindRelatedSymbolsRequest): Promise<FindRelatedSymbolsResponse | ServiceError> => {
    const result = await fetch("/api/find_references", {
        method: "POST",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
    return result as FindRelatedSymbolsResponse | ServiceError;
}

export const find搜索BasedSymbolDefinitions = async (body: FindRelatedSymbolsRequest): Promise<FindRelatedSymbolsResponse | ServiceError> => {
    const result = await fetch("/api/find_definitions", {
        method: "POST",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
    return result as FindRelatedSymbolsResponse | ServiceError;
}

export const getTree = async (body: GetTreeRequest): Promise<GetTreeResponse | ServiceError> => {
    const result = await fetch("/api/tree", {
        method: "POST",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
    return result as GetTreeResponse | ServiceError;
}

export const listCommits = async (queryParams: ListCommitsQueryParams): Promise<ListCommitsResponse | ServiceError> => {
    const url = new URL("/api/commits", window.location.origin);
    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== '') {
            url.searchParams.set(key, value.toString());
        }
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
    });

    const result = await response.json();
    if (isServiceError(result)) {
        return result;
    }

    const totalCount = parseInt(response.headers.get('X-Total-Count') ?? '0', 10);
    return { commits: result as Commit[], totalCount };
}

export const getFiles = async (body: GetFilesRequest): Promise<GetFilesResponse | ServiceError> => {
    const result = await fetch("/api/files", {
        method: "POST",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
    return result as GetFilesResponse | ServiceError;
}

export const getPermission同步状态 = async (): Promise<Permission同步状态Response | ServiceError> => {
    const result = await fetch("/api/ee/permission同步状态", {
        method: "GET",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
    }).then(response => response.json());
    return result as Permission同步状态Response | ServiceError;
}

export const getAccount同步状态 = async (jobId: string): Promise<Account同步状态Response | ServiceError> => {
    const url = new URL("/api/ee/accountPermission同步Job状态", window.location.origin);
    url.searchParams.set("jobId", jobId);
    const result = await fetch(url, {
        headers: { "X-Sourcebot-Client-Source": "sourcebot-web-client" },
    }).then(r => r.json());
    return result as Account同步状态Response | ServiceError;
}

export const searchChat分享ableMembers = async (
    params: 搜索Chat分享ableMembersQueryParams & { chatId: string },
    signal?: AbortSignal
): Promise<搜索Chat分享ableMembersResponse | ServiceError> => {
    const url = new URL(`/api/ee/chat/${params.chatId}/searchMembers`, window.location.origin);
    if (params.query) {
        url.searchParams.set('query', params.query);
    }

    const result = await fetch(url, {
        method: "GET",
        headers: {
            "X-Sourcebot-Client-Source": "sourcebot-web-client",
        },
        signal,
    }).then(response => response.json());

    return result as 搜索Chat分享ableMembersResponse | ServiceError;
}