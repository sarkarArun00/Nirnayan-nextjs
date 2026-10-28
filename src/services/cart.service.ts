import { getLoggedInUser } from "@/actions/session.actions";
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

export type CartItemPayload = {
    investigationId: number;
    productType: "test" | "package";
};

export type SaveToCartPayload = {
    patientId: number;
    items: CartItemPayload[];
};

export async function saveToCart(
    payload: SaveToCartPayload
) {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const finalPayload = {
        userId: user.id,
        patientId: payload.patientId,
        items: payload.items,
    };

    console.log(
        "Save To Cart Payload:",
        finalPayload
    );

    const response = await fetch(
        `${getBaseUrl()}b2c/saveToCart`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                user_id: String(user.id),
            },

            body: JSON.stringify(
                finalPayload
            ),

            cache: "no-store",
        }
    );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            "Failed to add item to cart."
        );
    }

    return result;
}

export type CartTat = {
    normalTat: {
        value: string;
        isHour: boolean;
    };

    urgentTat: {
        value: string;
        isHour: boolean;
    };
};

export type CartItem = {
    cartId: number;

    item_id: number;

    productType:
    | "test"
    | "package";

    patientId: number;

    patient_name: string;
    test_name: string;
    patient_age: number ;
    patient_gender: number ;
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

    mrpAmount: number;

    offerAmount: number | null;

    finalAmount: number;

    testCount?: number;

    testNames?: string[];
};

export type BookingSlot = {
    id: number;
    slot_label: string;
    start_time: string;
    end_time: string;
    threshold: number;
    status: boolean;
};

export type GetAllSlotsResponse = {
    status: number;
    success: boolean;
    message: string;
    data: BookingSlot[];
};

export type GetCartResponse = {
    status: number;
    message: string;
    data: CartItem[];
};

export type PatientAddressPayload = {
    addressName: string;
    fullName: string;
    contactNumber: string;
    alt_contactNumber: string;
    pinCode: number;
    addressLine_1: string;
    addressLine_2: string;
    landMark: string;
    latitude: number;
    longitude: number;
    status: boolean;
};

export type PatientAddress = PatientAddressPayload & {
    id: number;
    user_id: number;
    delete_status: boolean | null;
    createdAt: string;
    updatedAt: string;
};

export type EditPatientAddressPayload = Omit<
    PatientAddressPayload,
    "alt_contactNumber"
> & {
    address_id: number;
};

export type GetPatientAddressesResponse = {
    data: PatientAddress[];
    status: number;
    success: boolean;
    message: string;
};

const LOCATION_STORAGE_KEY =
    "nirnayan_selected_state";

function getSelectedStateId(): number {
    if (typeof window === "undefined") {
        throw new Error(
            "State ID is only available in browser."
        );
    }

    const savedState =
        localStorage.getItem(
            LOCATION_STORAGE_KEY
        );

    if (!savedState) {
        throw new Error(
            "Please select a location first."
        );
    }

    try {
        const parsedState =
            JSON.parse(savedState);

        if (
            !parsedState ||
            typeof parsedState.id !== "number"
        ) {
            throw new Error(
                "Invalid selected state."
            );
        }

        return parsedState.id;
    } catch (error) {
        console.error(
            "Unable to get selected state:",
            error
        );

        throw new Error(
            "Unable to get selected state."
        );
    }
}

export async function getCartByUser(): Promise<GetCartResponse> {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }
    const stateId =
        getSelectedStateId();

    console.log(
        "Selected State ID:",
        stateId
    );

    const url =
        `${getBaseUrl()}b2c/getAllCartByUser` + `?userId=${user.id}&stateId=${stateId}`;

    const response = await fetch(url, {
        method: "GET",

        headers: {
            Accept: "application/json",
            user_id: String(user.id),
        },

        cache: "no-store",
    });

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            "Failed to fetch cart."
        );
    }

    return result;
}


export async function removeFromCart(
    patientId: number,
    itemId: number
) {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const url =
        `${getBaseUrl()}b2c/removeFromCart` +
        `?userId=${user.id}` +
        `&patientId=${patientId}` +
        `&itemId=${itemId}`;

    const response = await fetch(url, {
        method: "DELETE",

        headers: {
            Accept: "application/json",
            user_id: String(user.id),
        },

        cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            "Failed to remove item from cart."
        );
    }

    return result;
}

export async function getAllSlots(): Promise<GetAllSlotsResponse> {
    const response = await fetch(
        `${getBaseUrl()}global/slot/getAllSlots`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Unable to fetch booking slots.");
    }

    const result: GetAllSlotsResponse = await response.json();

    if (result.status !== 1 || !result.success) {
        throw new Error(result.message || "Unable to fetch booking slots.");
    }

    return result;
}

async function requestPatientAddress(
    endpoint: string,
    method: "GET" | "POST",
    payload?: object
): Promise<unknown> {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const headers: Record<string, string> = {
        Accept: "application/json",
        user_id: String(user.id),
    };

    if (payload !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
        `${getBaseUrl()}b2c/patient-address/${endpoint}`,
        {
            method,
            headers,
            ...(payload !== undefined
                ? { body: JSON.stringify(payload) }
                : {}),
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Address request failed. Please try again.");
    }

    const result: unknown = await response.json();

    // Handle backend failures when these response fields are present.
    if (typeof result === "object" && result !== null) {
        const failedStatus =
            "status" in result &&
            typeof result.status === "number" &&
            result.status !== 1;

        const failedSuccess =
            "success" in result && result.success === false;

        if (failedStatus || failedSuccess) {
            const message =
                "message" in result && typeof result.message === "string"
                    ? result.message
                    : "Address request failed. Please try again.";

            throw new Error(message);
        }
    }

    return result;
}

export async function getAllPatientAddresses(): Promise<GetPatientAddressesResponse> {
    const result = await requestPatientAddress(
        "getAllPatientAddresses",
        "GET"
    );

    if (
        typeof result !== "object" ||
        result === null ||
        !("status" in result) ||
        result.status !== 1 ||
        !("success" in result) ||
        result.success !== true ||
        !("data" in result) ||
        !Array.isArray(result.data)
    ) {
        throw new Error("Invalid patient address response.");
    }

    return result as GetPatientAddressesResponse;
}

export async function addPatientAddress(
    payload: PatientAddressPayload
): Promise<unknown> {
    return requestPatientAddress(
        "addPatientAddress",
        "POST",
        payload
    );
}

export async function getPatientAddressById(
    addressId: number
): Promise<unknown> {
    return requestPatientAddress(
        "getPatientAddressById",
        "POST",
        {
            address_id: addressId,
        }
    );
}

export async function editPatientAddress(
    payload: EditPatientAddressPayload
): Promise<unknown> {
    return requestPatientAddress(
        "editPatientAddress",
        "POST",
        payload
    );
}

export async function deletePatientAddress(
    addressId: number
): Promise<unknown> {
    return requestPatientAddress(
        "deletePatientAddress",
        "POST",
        {
            address_id: addressId,
        }
    );
}