
/**
 * Nirnayan Healthcare - Location API
 *
 * Existing Angular endpoint:
 * POST /b2c/getAllLocations
 *
 * This service is intended for server-side use.
 */

/* ========================================
   TYPES
======================================== */

export interface HealthcareLocation {
    id: number | string;
    name: string;
}

export interface GetLocationsRequest {
    schemaName: string;
}

export interface GetLocationsResponse {
    status: number;
    data: HealthcareLocation[];
}

/* ========================================
   RESPONSE VALIDATION
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

function isHealthcareLocation(
    value: unknown
): value is HealthcareLocation {
    if (!isRecord(value)) {
        return false;
    }

    return (
        (typeof value.id === "number" ||
            typeof value.id === "string") &&
        typeof value.name === "string"
    );
}

/* ========================================
   GET ALL LOCATIONS
======================================== */

export async function getAllLocations(
    schemaName: string
): Promise<HealthcareLocation[]> {
    const baseUrl = process.env.LIMS_API_BASE_URL;

    if (!baseUrl) {
        throw new Error(
            "LIMS_API_BASE_URL is not configured."
        );
    }

    if (!schemaName.trim()) {
        throw new Error(
            "The location API schema name is required."
        );
    }

    const normalizedBaseUrl = baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl}/`;

    const url = new URL(
        "b2c/getAllLocations",
        normalizedBaseUrl
    );

    const request: GetLocationsRequest = {
        schemaName,
    };

    const response = await fetch(url, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(request),

        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Unable to retrieve locations. HTTP status: ${response.status}`
        );
    }

    const result: unknown = await response.json();

    if (
        !isRecord(result) ||
        typeof result.status !== "number" ||
        !Array.isArray(result.data)
    ) {
        throw new Error(
            "The location API returned an unexpected response."
        );
    }

    if (result.status !== 1) {
        throw new Error(
            "The location API reported an unsuccessful request."
        );
    }

    if (!result.data.every(isHealthcareLocation)) {
        throw new Error(
            "The location API returned invalid location records."
        );
    }

    return result.data;
}