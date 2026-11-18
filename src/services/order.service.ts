import { getLoggedInUser } from "@/actions/session.actions";

function getBaseUrl() {
    const baseUrl =
        process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim();

    if (!baseUrl) {
        throw new Error(
            "NEXT_PUBLIC_LIMS_API_BASE_URL is missing."
        );
    }

    return `${baseUrl.replace(/\/+$/, "")}/`;
}

export type OrderPatient = {
    id: number;
    user_id: number;
    patient_name: string;
    gender: number | null;
    height: number | null;
    weight: number | null;
    blood_group: number | null;
    title: string | null;
    dob: string | null;
    phoneNumber: string | null;
    altPhoneNumber: string | null;
    patientAddress: string | null;
    patientEmail: string | null;
};

export type OrderBookingDetail = {
    id: number;

    bookingId: number;

    userId: number;

    patientId: number;

    doctor_name: string | null;

    test_id: number;

    mrpAmount: number | null;

    costAmount: number | null;

    paymentStatus: string;

    addedBy: string | null;

    created_at: string | null;

    updated_at: string | null;

    testStatus: string | null;

    taskId: number | null;

    cartId: number;

    productType: "test" | "package";

    testDetails?: OrderTestDetails | null;
};

export type PatientWiseBookingDetail = {
    patientId: number;
    patient: OrderPatient;
    cartIds: number[];
    bookingDetails: OrderBookingDetail[];
    attachments: OrderAttachment[];
};

export type OrderCart = {
    id: number;
    user_id: number;
    patient_id: number;

    doctor_name: string | null;

    created_at: string | null;
    updated_at: string | null;

    is_deleted: boolean;
    is_order_placed: boolean;
};

export type OrderAddressDetails = {
    id: number;
    user_id: number;

    addressName: string;
    fullName: string;

    contactNumber: string;
    alt_contactNumber: string | null;

    pinCode: number;

    addressLine_1: string;
    addressLine_2: string | null;
    landMark: string | null;

    latitude: number | string | null;
    longitude: number | string | null;

    status: boolean;
    delete_status: boolean;

    createdAt: string;
    updatedAt: string;
};

export type OrderItem = {
    id: number;

    user_id: number;

    membership_id: number | null;

    coupon_id: number | null;

    voucher_id: number | null;

    coins: string;

    phlebo_lat?: number | string | null;
    phlebo_long?: number | string | null;

    addressDetails: OrderAddressDetails | null;

    gross_amount: number;

    discount_amount: number;

    net_amount: number;

    received_amount: number;

    due_amount: number;

    paymentStatus: string;

    created_at: string | null;
    updated_at: string | null;

    slot_date: string;

    slot_id: number;

    displayBookingNumber: string | null;

    address_id: number;

    reportStatus: string;

    paymentId: string | null;

    platform: string | null;

    rescheduleCount: number;

    bookingStatus: string;

    offer_discount: number;

    coupon_discount: number;

    total_amount: number;

    transaction_id: string | null;

    payment_type: string | null;

    patientWiseBookingDetails:
    PatientWiseBookingDetail[];

    carts: OrderCart[];
};

export type GetAllOrdersResponse = {
    status: number;

    success: boolean;

    message: string;

    totalOrders: number;

    data: OrderItem[];
};

export type OrderAttachment = {
    id: number;
    cartId: number;
    bookingId: number;
    attechment: string;
    createdAt: string;
    updatedAt: string;
};

export type OrderTestDetails = {
    id: number;

    test_code: string;
    test_name: string;

    department_id: number | null;
    subDepartment_id: number | null;

    gender: number | null;

    sample_quantity: string | null;

    category_id: number | null;

    isConsentForm: boolean;

    consent_form: string | null;
    dummy_format: string | null;

    prerequisites: string | null;
    description: string | null;

    status: string | number | null;
    delete_status: boolean | null;

    parameter_group: boolean;
    print_separate: boolean;

    product_type: string;

    availability: string | null;

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

    corporate_test: boolean;

    clientId: number | null;

    homeCollection: boolean;

    clinicalHistory: boolean;

    reporting: boolean;

    created_at: string | null;
    updated_at: string | null;

    tempOrder: number | null;
};

export async function getAllOrders(
    limit = 10,
    offset = 0,
): Promise<GetAllOrdersResponse> {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error(
            "Please sign in to view your orders."
        );
    }

    const response = await fetch(
        `${getBaseUrl()}b2c/getAllOrder`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                user_id: String(user.id),
            },

            body: JSON.stringify({
                userId: user.id,
                limit,
                offset,
            }),

            cache: "no-store",
        }
    );

    const result =
        await response.json();

    console.log(
        "Get All Orders Response:",
        result
    );

    if (!response.ok) {
        throw new Error(
            result?.message ||
            "Unable to load orders."
        );
    }

    return result;
}