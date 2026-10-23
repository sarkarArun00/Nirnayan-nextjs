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

export type GetCartResponse = {
    status: number;
    message: string;
    data: CartItem[];
};

export async function getCartByUser(): Promise<GetCartResponse> {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const url =
        `${getBaseUrl()}b2c/getAllCartByUser` +
        `?userId=${user.id}`;

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