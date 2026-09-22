
import type {
    DiagnosticTest,
    GetAllTestsRequest,
    GetAllTestsResponse,
} from "@/types/patient/test.types";

/*
 * Existing Nirnayan Healthcare API endpoint.
 */
const GET_ALL_TESTS_ENDPOINT =
    "global/test/test-master/getAllTests";

/*
 * Check whether a value is an object.
 */
function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

/*
 * Validate the required diagnostic test fields.
 */
function isDiagnosticTest(
    value: unknown
): value is DiagnosticTest {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.id === "number" &&
        typeof value.test_code === "string" &&
        typeof value.test_name === "string"
    );
}

/*
 * Validate the API response structure.
 *
 * Confirmed backend response:
 *
 * {
 *   data: DiagnosticTest[],
 *   status: 1,
 *   success: true
 * }
 */
function isGetAllTestsResponse(
    value: unknown
): value is GetAllTestsResponse {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.status === "number" &&
        typeof value.success === "boolean" &&
        Array.isArray(value.data) &&
        value.data.every(isDiagnosticTest)
    );
}

/*
 * Fetch diagnostic tests from the existing
 * Nirnayan Healthcare backend.
 */
export async function getAllTests(
    baseUrl: string,
    request: GetAllTestsRequest
): Promise<DiagnosticTest[]> {
    if (!baseUrl.trim()) {
        throw new Error(
            "The diagnostic test API base URL is not configured."
        );
    }

    const normalizedBaseUrl = baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl}/`;

    const url = new URL(
        GET_ALL_TESTS_ENDPOINT,
        normalizedBaseUrl
    );

    const response = await fetch(url, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(request),

        cache: "no-store",
    });

    /*
     * Handle HTTP errors.
     */
    if (!response.ok) {
        throw new Error(
            `Unable to retrieve diagnostic tests. HTTP status: ${response.status}`
        );
    }

    /*
     * Read and validate the backend response.
     */
    const result: unknown = await response.json();

    if (!isGetAllTestsResponse(result)) {
        throw new Error(
            "The diagnostic test API returned an unexpected response structure."
        );
    }

    /*
     * Validate the backend success status.
     */
    if (!result.success || result.status !== 1) {
        throw new Error(
            "The diagnostic test API reported an unsuccessful request."
        );
    }

    /*
     * Return the actual test records.
     */
    return result.data;
}