import "server-only";

/* ========================================
   HTTP TYPES
======================================== */

type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

type QueryValue =
    | string
    | number
    | boolean
    | null
    | undefined;

export interface ApiRequestOptions {
    method?: HttpMethod;

    body?: unknown;

    headers?: HeadersInit;

    query?: Record<string, QueryValue>;

    cache?: RequestCache;
}

/* ========================================
   API ERROR
======================================== */

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(
        message: string,
        status: number,
        data: unknown
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

/* ========================================
   HELPERS
======================================== */

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function buildApiUrl(
    endpoint: string,
    query?: Record<string, QueryValue>
): URL {
    const baseUrl =
        process.env.LIMS_API_BASE_URL?.trim();

    if (!baseUrl) {
        throw new Error(
            "LIMS_API_BASE_URL is not configured."
        );
    }

    const normalizedBaseUrl =
        baseUrl.endsWith("/")
            ? baseUrl
            : `${baseUrl}/`;

    const normalizedEndpoint =
        endpoint.replace(/^\/+/, "");

    const url = new URL(
        normalizedEndpoint,
        normalizedBaseUrl
    );

    if (query) {
        Object.entries(query).forEach(
            ([key, value]) => {
                if (
                    value !== null &&
                    value !== undefined
                ) {
                    url.searchParams.set(
                        key,
                        String(value)
                    );
                }
            }
        );
    }

    return url;
}

async function parseResponse(
    response: Response
): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(
    data: unknown,
    status: number
): string {
    if (
        isRecord(data) &&
        typeof data.message === "string" &&
        data.message.trim()
    ) {
        return data.message;
    }

    return `API request failed with status ${status}.`;
}

/* ========================================
   COMMON API REQUEST
======================================== */

export async function apiRequest<
    TResponse = unknown
>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<TResponse> {
    const {
        method = "GET",
        body,
        headers: customHeaders,
        query,
        cache = "no-store",
    } = options;

    const url = buildApiUrl(
        endpoint,
        query
    );

    const headers = new Headers(
        customHeaders
    );

    let requestBody: BodyInit | undefined;

    /*
     * FormData is supported for future file uploads.
     * Do not manually set Content-Type for FormData.
     */
    if (body instanceof FormData) {
        requestBody = body;
    } else if (body !== undefined) {
        if (
            !headers.has("Content-Type")
        ) {
            headers.set(
                "Content-Type",
                "application/json"
            );
        }

        requestBody = JSON.stringify(body);
    }

    const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        cache,
    });

    const data =
        await parseResponse(response);

    if (!response.ok) {
        throw new ApiError(
            getErrorMessage(
                data,
                response.status
            ),
            response.status,
            data
        );
    }

    return data as TResponse;
}

/* ========================================
   SHORTCUT METHODS
======================================== */

export function apiGet<
    TResponse = unknown
>(
    endpoint: string,
    options?: Omit<
        ApiRequestOptions,
        "method" | "body"
    >
) {
    return apiRequest<TResponse>(
        endpoint,
        {
            ...options,
            method: "GET",
        }
    );
}

export function apiPost<
    TResponse = unknown
>(
    endpoint: string,
    body?: unknown,
    options?: Omit<
        ApiRequestOptions,
        "method" | "body"
    >
) {
    return apiRequest<TResponse>(
        endpoint,
        {
            ...options,
            method: "POST",
            body,
        }
    );
}

export function apiPut<
    TResponse = unknown
>(
    endpoint: string,
    body?: unknown,
    options?: Omit<
        ApiRequestOptions,
        "method" | "body"
    >
) {
    return apiRequest<TResponse>(
        endpoint,
        {
            ...options,
            method: "PUT",
            body,
        }
    );
}

export function apiDelete<
    TResponse = unknown
>(
    endpoint: string,
    options?: Omit<
        ApiRequestOptions,
        "method" | "body"
    >
) {
    return apiRequest<TResponse>(
        endpoint,
        {
            ...options,
            method: "DELETE",
        }
    );
}