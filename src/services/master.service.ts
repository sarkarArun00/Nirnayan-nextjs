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

export type OrganItem = {
    id: number;
    group_name: string;
    icon: string;
};

export type ConditionItem = {
    id: number;
    specialityname: string;
    icon: string;
};

export type DepartmentItem = {
    id: number;
    dept_name: string;
    image: string | null;
};

export type OrganConditionDepartmentResponse = {
    success: boolean;
    status: number;
    data: {
        organs: OrganItem[];
        conditions: ConditionItem[];
        departments: DepartmentItem[];
        testCount: number;
        packageCount: number;
    };
};

export type PopularInvestigationPayload = {
    group: number[];
    speciality: number[];
    department: number[];
    state_id: number;
    product_type: "test";
    popular_investigations: boolean;
    group_by: "" | "organ" | "speciality" | "department";
    page: number;
    limit: number;
};

export type PopularInvestigationItem = {
    id: number;
    test_name: string;
    product_type: string;
    description: string;
    department_id: number;
    test_code: string;

    tat: {
        normalTat: {
            value: string;
            isHour: boolean;
        };
        urgentTat: {
            value: string;
            isHour: boolean;
        };
    };

    homeCollection: boolean;
    tempOrder: number;
    mrpAmount: string;
};

export type PopularInvestigationResponse = {
    data: PopularInvestigationItem[];
};

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

export async function getAllGroups() {
    const url = `${getBaseUrl()}global/investigation/group/getAll?activeOnly=true`;

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


export async function getOrganConditionsDepartment(): Promise<OrganConditionDepartmentResponse> {
    const response = await fetch(
        `${getBaseUrl()}global/investigation/getOrganConditionsDepartment`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Organ/Condition/Department API failed with status ${response.status}`
        );
    }

    return response.json();
}

export async function getPopularPackagesPost(
    payload: PopularInvestigationPayload
): Promise<PopularInvestigationResponse> {
    const response = await fetch(
        `${getBaseUrl()}global/investigation/getPopularPackagesPost`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },

            body: JSON.stringify(payload),

            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Popular investigation API failed with status ${response.status}`
        );
    }

    return response.json();
}