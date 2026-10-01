"use server";

// import { cookies } from "next/headers";
// import { getIronSession } from "iron-session";
import { verifyOtp } from "@/services/auth.service";
import { getSession } from "@/lib/server/session";

interface LoginUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
}

interface SessionData {
    user?: LoginUser;
    accessToken?: string;
}

type LoginResult =
    | { success: true; user: LoginUser }
    | { success: false; message: string };

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

// async function getSession() {
//     const password = process.env.SESSION_PASSWORD;

//     if (!password || password.length < 32) {
//         throw new Error(
//             "A valid SESSION_PASSWORD must be configured."
//         );
//     }

//     return getIronSession<SessionData>(
//         await cookies(),
//         {
//             cookieName: "nirnayan_session",
//             password,
//             cookieOptions: {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "lax",
//                 path: "/",
//             },
//         }
//     );
// }

/* VERIFY OTP AND SAVE SESSION */

export async function loginWithOtp(
    mobile: string,
    otp: string
): Promise<LoginResult> {
    const mobileNumber = mobile.trim();
    const otpValue = otp.trim();

    if (
        !/^\d{10}$/.test(mobileNumber) ||
        !/^\d{6}$/.test(otpValue)
    ) {
        return {
            success: false,
            message: "Invalid mobile number or OTP.",
        };
    }

    try {
        // Call your EXISTING login API service
        const result: unknown = await verifyOtp(
            mobileNumber,
            otpValue
        );

        if (
            isRecord(result) &&
            result.status === 1 &&
            result.success === true &&
            typeof result.accessToken === "string" &&
            result.accessToken.length > 0 &&
            isRecord(result.data) &&
            typeof result.data.id === "number" &&
            typeof result.data.first_name === "string" &&
            typeof result.data.last_name === "string" &&
            typeof result.data.email === "string" &&
            typeof result.data.mobile_number === "string"
        ) {
            const user: LoginUser = {
                id: result.data.id,
                first_name: result.data.first_name,
                last_name: result.data.last_name,
                email: result.data.email,
                mobile_number: result.data.mobile_number,
            };

            // Save login session securely
            const session = await getSession();

            session.user = user;
            session.accessToken = result.accessToken;

            await session.save();

            return {
                success: true,
                user,
            };
        }

        // Handle backend error responses
        const errorMessage =
            isRecord(result) &&
                typeof result.data === "string"
                ? result.data
                : isRecord(result) &&
                    typeof result.message === "string"
                    ? result.message
                    : "OTP verification failed.";

        return {
            success: false,
            message: errorMessage,
        };
    } catch {
        return {
            success: false,
            message: "Unable to verify OTP. Please try again.",
        };
    }
}

/* RESTORE USER AFTER PAGE REFRESH */

export async function getLoggedInUser() {
    const session = await getSession();

    if (!session.accessToken || !session.user) {
        return null;
    }

    return session.user;
}

/* LOGOUT */

export async function logoutSession() {
    const session = await getSession();
    session.destroy();
}