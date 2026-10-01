import { RequestOtpPayload } from "@/types/auth/login.types";

const BASE_URL =
    process.env.NEXT_PUBLIC_LIMS_API_BASE_URL;

export interface VerifyOtpPayload {
    email_or_mobile: string;
    otp: string;
}


function getBaseUrl() {
    if (!BASE_URL) {
        throw new Error(
            "API base URL is not configured."
        );
    }

    return BASE_URL.endsWith("/")
        ? BASE_URL
        : `${BASE_URL}/`;
}

/* =========================
   COMMON GET
========================= */

async function getRequest<TResponse>(
    endpoint: string
): Promise<TResponse> {
    const response = await fetch(
        `${getBaseUrl()}${endpoint}`,
        {
            method: "GET",

            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: unknown =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Something went wrong. Please try again."
        );
    }

    return data as TResponse;
}

/* =========================
   COMMON POST
========================= */

async function postRequest<TResponse>(
    endpoint: string,
    payload: unknown
): Promise<TResponse> {
    const response = await fetch(
        `${getBaseUrl()}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },

            body: JSON.stringify(payload),
        }
    );

    const data: unknown =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Something went wrong. Please try again."
        );
    }

    return data as TResponse;
}

/* =========================
   GET OTP
========================= */

// export function requestOtp(
//     payload: string
// ) {
//     const value =
//         encodeURIComponent(emailOrMobile);

//     return getRequest<unknown>(
//         `b2c/request-otp-b2c`,
//         payload
//     );
// }

export function requestOtp(
    emailOrMobile: string
) {
    const payload: RequestOtpPayload = {
        email_or_mobile: emailOrMobile,
    };

    return postRequest<unknown>(
        "b2c/request-otp-b2c",
        payload
    );
}
export function requestLoginOtp(
    emailOrMobile: string
) {
    const payload: RequestOtpPayload = {
        email_or_mobile: emailOrMobile,
    };

    return postRequest<unknown>(
        "b2c/request-b2c-loginotp",
        payload
    );
}

/* =========================
   RESEND OTP
========================= */

export function resendOtp(
    emailOrMobile: string
) {
    const value =
        encodeURIComponent(emailOrMobile);

    return getRequest<unknown>(
        `b2c/requestOTP?email_or_mobile=${value}`
    );
}

/* =========================
   VERIFY OTP
========================= */

export function verifyOtp(
    emailOrMobile: string,
    otp: string
) {
    const payload: VerifyOtpPayload = {
        email_or_mobile: emailOrMobile,
        otp,
    };

    return postRequest<unknown>(
        "b2c/verify-otp-b2c",
        payload
    );
}

/* =========================
   Sign Up
========================= */

export interface SignUpPayload {
    first_name: string;
    last_name: string;
    email: string;
    mobileNumber: string;
}

export function signUp(
    payload: SignUpPayload
) {
    return postRequest<unknown>(
        "b2c/signUp",
        payload
    );
}