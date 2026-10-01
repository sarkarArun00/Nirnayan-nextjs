import "server-only";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface SessionUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
}

export interface SessionData {
    user?: SessionUser;
    accessToken?: string;
}

export async function getSession() {
    const password = process.env.SESSION_PASSWORD;

    if (!password || password.length < 32) {
        throw new Error(
            "SESSION_PASSWORD is not configured correctly."
        );
    }

    return getIronSession<SessionData>(
        await cookies(),
        {
            cookieName: "nirnayan_session",
            password,

            // Use the same ttl as your existing session,
            // if you have configured one.

            cookieOptions: {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            },
        }
    );
}