"use server";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getLoggedInUser } from "@/actions/session.actions";

export type CheckoutSelection = {
    cartIds: number[];
    patientIds: number[];
    slot_date: string;
    slot_id: number;
    address_id: number;
};

export type CheckoutPaymentProof = {
    attemptId: string;
    paymentId: string;
    signature: string;
};

type CheckoutTotals = {
    grossAmount: number;
    net_amount: number;
    offer_discount: number;
    coupon_discount: number;
    total_Amount: number;
};

export type CheckoutBookingDetails = CheckoutSelection & CheckoutTotals;

export type RazorpayPaymentResult = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type CartResponse = {
    status: number;
    data: Array<{
        cartId: number;
        patientId: number;
        investigation: Array<{
            mrpAmount: number | string;
            finalAmount?: number | string | null;
            offerAmount?: number | string | null;
        }>;
    }>;
};

type RazorpayOrder = {
    id: string;
    receipt: string;
    amount: number;
    currency: string;
    notes?: { lims_checkout?: string };
};

type RazorpayPayment = {
    id: string;
    order_id: string;
    amount: number;
    amount_refunded: number;
    currency: string;
    status: string;
};

function isId(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function validIds(ids: unknown): ids is number[] {
    return Array.isArray(ids) && ids.length > 0 && ids.every(isId)
        && new Set(ids).size === ids.length;
}

function validateSelection(input: CheckoutSelection): CheckoutSelection {
    if (
        !input || !validIds(input.cartIds) || !validIds(input.patientIds) ||
        !isId(input.slot_id) || !isId(input.address_id) ||
        typeof input.slot_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.slot_date)
    ) {
        throw new Error("Select a cart, a collection slot, and an address.");
    }

    return {
        cartIds: input.cartIds,
        patientIds: input.patientIds,
        slot_date: input.slot_date,
        slot_id: input.slot_id,
        address_id: input.address_id,
    };
}

async function getCheckoutUserId() {
    const user = await getLoggedInUser();
    const id = Number(user?.id);

    if (!isId(id)) {
        throw new Error("Please sign in before checking out.");
    }

    return id;
}

function getLimsBaseUrl() {
    const base = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim();

    if (!base) {
        throw new Error("Missing NEXT_PUBLIC_LIMS_API_BASE_URL.");
    }

    return base.replace(/\/+$/, "");
}

function getRazorpayConfig() {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !secret) {
        throw new Error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the Next.js server.");
    }

    return { keyId, secret };
}

async function requestJson<T>(url: string, init: RequestInit, operation: string): Promise<T> {
    const response = await fetch(url, {
        ...init,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15_000),
    }).catch(() => {
        throw new Error(`${operation} could not reach the server.`);
    });

    if (!response.ok) {
        throw new Error(`${operation} returned HTTP ${response.status}.`);
    }

    return response.json().catch(() => {
        throw new Error(`${operation} returned invalid JSON.`);
    });
}

async function razorpayRequest<T>(path: string, body?: object) {
    const { keyId, secret } = getRazorpayConfig();
    const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");

    return requestJson<T>(`https://api.razorpay.com/v1${path}`, {
        method: body ? "POST" : "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    }, `Razorpay ${path.split("/")[1]}`);
}

function toPaise(value: number | string) {
    if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) {
        throw new Error("Invalid checkout amount.");
    }

    const amount = Number(value);
    const paise = Math.round(amount * 100);

    if (amount < 0 || !Number.isSafeInteger(paise)) {
        throw new Error("Invalid checkout amount.");
    }

    return paise;
}

async function getCartTotals(userId: number, stateId: number, selection: CheckoutSelection) {
    const query = new URLSearchParams({ userId: String(userId), stateId: String(stateId) });
    const cart = await requestJson<CartResponse>(
        `${getLimsBaseUrl()}/b2c/getAllCartByUser?${query}`,
        { method: "GET", headers: { Accept: "application/json", user_id: String(userId) } },
        "Load cart for checkout",
    );

    if (cart?.status !== 1 || !Array.isArray(cart.data)) {
        throw new Error("The cart API returned an unexpected response.");
    }

    const selected = cart.data.filter(group => selection.cartIds.includes(group.cartId));
    const patientIds = new Set(selected.map(group => group.patientId));

    if (
        selected.length !== selection.cartIds.length ||
        patientIds.size !== selection.patientIds.length ||
        !selection.patientIds.every(id => patientIds.has(id)) ||
        selected.some(group => !Array.isArray(group.investigation) || !group.investigation.length)
    ) {
        throw new Error("Your cart changed. Reload it and review the booking.");
    }

    let gross = 0;
    let net = 0;
    for (const group of selected) {
        for (const item of group.investigation) {
            gross += toPaise(item.mrpAmount);
            net += toPaise(item.finalAmount ?? item.offerAmount ?? item.mrpAmount);
        }
    }

    if (!Number.isSafeInteger(gross) || !isId(net)) {
        throw new Error("The cart has no valid amount to pay.");
    }

    return {
        grossAmount: gross / 100,
        net_amount: net / 100,
        offer_discount: Math.max(0, gross - net) / 100,
        coupon_discount: 0,
        total_Amount: net / 100,
    };
}

function bookingDigest(userId: number, receipt: string, details: CheckoutBookingDetails) {
    const { secret } = getRazorpayConfig();
    const fields = [
        "lims-checkout-v1", getLimsBaseUrl(), userId, receipt,
        details.cartIds, details.patientIds, details.slot_date, details.slot_id, details.address_id,
        toPaise(details.grossAmount), toPaise(details.net_amount), toPaise(details.offer_discount),
        toPaise(details.coupon_discount), toPaise(details.total_Amount),
    ];

    return createHmac("sha256", secret).update(JSON.stringify(fields)).digest("hex");
}

function digestMatches(expected: string, actual: unknown) {
    return typeof actual === "string" && /^[a-f0-9]{64}$/i.test(actual)
        && timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export async function createCheckoutOrder(
    input: CheckoutSelection,
    selectedStateId: number | string | null | undefined,
) {
    const userId = await getCheckoutUserId();
    const selection = validateSelection(input);
    const stateId = Number(selectedStateId);

    if (!isId(stateId)) {
        throw new Error("Select your location before paying.");
    }

    const { keyId } = getRazorpayConfig();
    const totals = await getCartTotals(userId, stateId, selection);
    const amount = toPaise(totals.total_Amount);
    const receipt = randomUUID();
    const details = { ...selection, ...totals };
    const digest = bookingDigest(userId, receipt, details);
    const order = await razorpayRequest<RazorpayOrder>("/orders", {
        amount,
        currency: "INR",
        partial_payment: false,
        receipt,
        notes: { lims_checkout: digest },
    });

    if (
        !order || !/^order_[a-z0-9]+$/i.test(order.id) ||
        order.amount !== amount || order.currency !== "INR" || order.receipt !== receipt
    ) {
        throw new Error("Razorpay returned an unexpected order.");
    }

    return {
        attemptId: receipt,
        orderId: order.id,
        keyId,
        amount,
        currency: "INR" as const,
        details,
    };
}

export async function processToCheckout(
    input: CheckoutBookingDetails,
    payment: RazorpayPaymentResult,
) {
    if (process.env.NODE_ENV === "development") {
        console.info("[Checkout] Verifying Razorpay payment");
    }

    const userId = await getCheckoutUserId();
    const selection = validateSelection(input);
    const paymentId = payment?.razorpay_payment_id;

    if (
        typeof paymentId !== "string" || !/^pay_[a-z0-9]+$/i.test(paymentId) ||
        typeof payment.razorpay_order_id !== "string" || !/^order_[a-z0-9]+$/i.test(payment.razorpay_order_id) ||
        typeof payment.razorpay_signature !== "string" || !/^[a-f0-9]{64}$/i.test(payment.razorpay_signature)
    ) {
        throw new Error("Razorpay payment details are incomplete.");
    }

    const totals = {
        grossAmount: toPaise(input.grossAmount) / 100,
        net_amount: toPaise(input.net_amount) / 100,
        offer_discount: toPaise(input.offer_discount) / 100,
        coupon_discount: toPaise(input.coupon_discount) / 100,
        total_Amount: toPaise(input.total_Amount) / 100,
    };
    const amount = toPaise(totals.total_Amount);
    const verified = await razorpayRequest<RazorpayPayment>(`/payments/${paymentId}`);

    if (
        verified?.id !== paymentId || verified.order_id !== payment.razorpay_order_id ||
        verified.amount !== amount || verified.currency !== "INR" ||
        verified.status !== "captured" || verified.amount_refunded !== 0
    ) {
        throw new Error("Razorpay has not confirmed the expected captured payment.");
    }

    const order = await razorpayRequest<RazorpayOrder>(`/orders/${verified.order_id}`);
    const details = { ...selection, ...totals };

    if (
        order?.id !== verified.order_id || order.amount !== amount || order.currency !== "INR" ||
        typeof order.receipt !== "string" ||
        !digestMatches(bookingDigest(userId, order.receipt, details), order.notes?.lims_checkout)
    ) {
        throw new Error("This Razorpay order does not match the booking.");
    }

    const { secret } = getRazorpayConfig();
    const signature = createHmac("sha256", secret).update(`${order.id}|${paymentId}`).digest("hex");

    if (!digestMatches(signature, payment.razorpay_signature)) {
        throw new Error("The Razorpay payment signature is invalid.");
    }

    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        user_id: String(userId),
        "Idempotency-Key": paymentId,
        "X-Razorpay-Order-Id": order.id,
        "X-Razorpay-Signature": payment.razorpay_signature,
    };
    const serviceToken = process.env.LIMS_CHECKOUT_SERVICE_TOKEN?.trim();
    if (serviceToken) {
        headers.Authorization = `Bearer ${serviceToken}`;
    }

    if (process.env.NODE_ENV === "development") {
        console.info("[Checkout] Calling /b2c/processToCheckout");
    }

    const result = await requestJson<{ status: number; data?: unknown }>(
        `${getLimsBaseUrl()}/b2c/processToCheckout`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                ...selection,
                userId,
                paymentStatus: 1,
                paymentType: "Online",
                paymentId,
                transaction_id: paymentId,
                gross_amount: totals.grossAmount,
                net_amount: totals.net_amount,
                offer_discount: totals.offer_discount,
                coupon_discount: totals.coupon_discount,
                total_amount: totals.total_Amount,
                platform: "website",
            }),
        },
        "Save booking",
    );

    if (result?.status !== 1) {
        throw new Error("The booking API did not confirm the booking.");
    }

    return result.data ?? result;
}
