
import { NextResponse } from "next/server";

import { getAllLocations } from "@/lib/server/get-locations";

/**
 * GET /api/locations
 *
 * Retrieves available locations using the existing
 * Nirnayan Healthcare backend API.
 *
 * The backend configuration remains server-side.
 */

export async function GET() {
    const schemaName = process.env.LIMS_LOCATION_SCHEMA_NAME;

    const baseUrl = process.env.LIMS_API_BASE_URL;

    // Validate the server environment configuration.

    if (!schemaName?.trim() || !baseUrl?.trim()) {
        return NextResponse.json(
            {
                success: false,
                message: "Location API configuration is missing.",
            },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }

    try {
        // Call the existing server-side location service.

        const locations = await getAllLocations(schemaName);

        // Return only the public location information.

        return NextResponse.json(
            {
                success: true,
                data: locations,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        // Handle unexpected responses and backend failures
        // without exposing internal configuration details.

        return NextResponse.json(
            {
                success: false,
                message: "Unable to retrieve locations. Please try again.",
            },
            {
                status: 502,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }
}