"use server";

import { ApiError } from "@/lib/api/api-client";

import {
    requestOtp,
    resendOtp,
    verifyOtp,
} from "@/services/auth.service";

/* ========================================
   ACTION RESULT
======================================== */

export type AuthActionResult =
    | {
        success: true;
        data: unknown;
    }
    | {
        success: false;
        message: string;
        status?: number;
    };

/* ========================================
   COMMON ERROR HANDLER
======================================== */

function handleAuthError(
    error: unknown
): AuthActionResult {
    if (error instanceof ApiError) {
        return {
            success: false,
            message: error.message,
            status: error.status,
        };
    }

    if (error instanceof Error) {
        return {
            success: false,
            message: error.message,
        };
    }

    return {
        success: false,
        message:
            "Something went wrong. Please try again.",
    };
}

/* ========================================
   REQUEST OTP
======================================== */

export async function requestOtpAction(
    emailOrMobile: string
): Promise<AuthActionResult> {
    try {
        const result =
            await requestOtp(emailOrMobile);

        return {
            success: true,
            data: result,
        };
    } catch (error: unknown) {
        return handleAuthError(error);
    }
}

/* ========================================
   RESEND OTP
======================================== */

export async function resendOtpAction(
    emailOrMobile: string
): Promise<AuthActionResult> {
    try {
        const result =
            await resendOtp(emailOrMobile);

        return {
            success: true,
            data: result,
        };
    } catch (error: unknown) {
        return handleAuthError(error);
    }
}

/* ========================================
   VERIFY OTP / LOGIN
======================================== */

export async function verifyOtpAction(
    emailOrMobile: string,
    otp: string
): Promise<AuthActionResult> {
    try {
        const result =
            await verifyOtp(
                emailOrMobile,
                otp
            );

        return {
            success: true,
            data: result,
        };
    } catch (error: unknown) {
        return handleAuthError(error);
    }
}