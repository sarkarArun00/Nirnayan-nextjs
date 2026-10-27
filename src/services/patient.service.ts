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

export type CreatePatientPayload = {
    schemaName: string;
    centre_id: number;

    patientName: string;
    age: number;
    blood_group: string;
    gender: number;
    dob: string;

    height: number;
    weight: number;

    title: string;

    phoneNumber: string;
    altPhoneNumber: string;

    patientAddress: string;
    patientEmail: string;
};

export type CreatePatientResponse = {
    status: number;
    success: boolean;
    message: string;

    data: {
        id: number;
        user_id: number;
        patient_name: string;
        gender: number;
        height: number;
        weight: number;
        blood_group: string | null;
        title: string | null;
        created_at: string;
        updated_at: string;
        patient_profile: string | null;
        status: boolean;
        dob: string | null;
        delete_status: boolean | null;
        phoneNumber: string | null;
        altPhoneNumber: string | null;
        patientAddress: string | null;
        patientEmail: string | null;
    };
};

export type EditPatientPayload = {
    patient_id: number;
    centre_id: number;
    patientName: string;
    gender: number;
    blood_group: string;
    dob: string;
    height: number;
    weight: number;
    title: string;
    phoneNumber: string;
    altPhoneNumber: string;
    patientAddress: string;
    patientEmail: string;
};

export type PatientItem = {
    id: number;
    user_id: number;
    patient_name: string;
    gender: number;
    height: number;
    weight: number;
    blood_group: string | null;
    title: string | null;
    patient_profile: string | null;
    status: boolean;
    dob: string | null;
    phoneNumber: string | null;
    altPhoneNumber: string | null;
    patientAddress: string | null;
    patientEmail: string | null;
};

export type PatientListResponse = {
    data: PatientItem[];
};

export type GetPatientPayload = {
    user_id: number;
};


export async function createPatient(
    payload: CreatePatientPayload
): Promise<CreatePatientResponse> {

    // Get logged-in user from iron-session
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const finalPayload = {
        ...payload,

        user_id: user.id,
    };

    console.log(
        "Create Patient Payload:",
        finalPayload
    );

    const response = await fetch(
        `${getBaseUrl()}client/service-registration/patient/create`,
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

    console.log(
        "Create Patient Response:",
        result
    );

    if (!response.ok) {
        throw new Error(
            result?.message ||
            `Patient creation failed with status ${response.status}`
        );
    }

    return result;
}

export async function getAllPatients(payload: GetPatientPayload): Promise<PatientListResponse> {
    // Get logged-in user from iron-session
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const userId = String(user.id);

    console.log("Patient API User ID:", userId);

    const response = await fetch(
        `${getBaseUrl()}b2c/patient/getUserPatients`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                user_id: userId,
            },
            body: JSON.stringify(payload),

            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Patient API failed with status ${response.status}`
        );
    }

    return response.json();
}

async function sendPatientMutation(
    endpoint: "editPatient" | "deletePatient",
    payload: EditPatientPayload | { patient_id: number }
): Promise<unknown> {
    const user = await getLoggedInUser();

    if (!user?.id) {
        throw new Error("User not logged in.");
    }

    const response = await fetch(
        `${getBaseUrl()}b2c/patient/${endpoint}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                user_id: String(user.id),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        }
    );

    const fallbackMessage =
        endpoint === "editPatient"
            ? "Unable to update patient."
            : "Unable to delete patient.";

    if (response.status === 204 && response.ok) {
        return null;
    }

    const result: unknown = await response.json();

    if (typeof result === "object" && result !== null) {
        const failedStatus =
            "status" in result &&
            typeof result.status === "number" &&
            result.status !== 1;

        const failedSuccess =
            "success" in result && result.success === false;

        if (!response.ok || failedStatus || failedSuccess) {
            const message =
                "message" in result && typeof result.message === "string"
                    ? result.message
                    : fallbackMessage;

            throw new Error(message);
        }
    } else if (!response.ok) {
        throw new Error(fallbackMessage);
    }

    return result;
}

export async function editPatient(
    payload: EditPatientPayload
): Promise<unknown> {
    return sendPatientMutation("editPatient", payload);
}

export async function deletePatient(
    patientId: number
): Promise<unknown> {
    return sendPatientMutation("deletePatient", {
        patient_id: patientId,
    });
}