import { RequestOtpPayload } from "@/types/auth/login.types";

const BASE_URL =
    process.env.NEXT_PUBLIC_LIMS_API_BASE_URL;

function getBaseUrl() {
    if (!BASE_URL) {
        throw new Error(
            "NEXT_PUBLIC_LIMS_API_BASE_URL is not configured."
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


export async function getAllState() {
    const url = `${getBaseUrl()}global/address/state`;

    console.log("STATE API URL:", url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `State API failed with status ${response.status}`
        );
    }

    return response.json();
}