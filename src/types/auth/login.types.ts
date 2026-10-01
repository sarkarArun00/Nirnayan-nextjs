export interface RequestOtpPayload {
    email_or_mobile: string;
}

export interface VerifyOtpPayload {
    email_or_mobile: string;
    otp: string;
}

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Accept:
 * - Indian 10 digit mobile number
 * - Standard email format
 */
export function validateEmailOrMobile(
    value: string
): ValidationResult {
    const input = value.trim();

    if (!input) {
        return {
            valid: false,
            message: "Please enter your email or mobile number.",
        };
    }

    const mobileRegex = /^[6-9]\d{9}$/;

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !mobileRegex.test(input) &&
        !emailRegex.test(input)
    ) {
        return {
            valid: false,
            message:
                "Please enter a valid email address or 10 digit mobile number.",
        };
    }

    return {
        valid: true,
    };
}

export function validateOtp(
    value: string
): ValidationResult {
    const otp = value.trim();

    if (!otp) {
        return {
            valid: false,
            message: "Please enter the OTP.",
        };
    }

    if (!/^\d+$/.test(otp)) {
        return {
            valid: false,
            message: "OTP must contain numbers only.",
        };
    }

    if (otp.length < 4 || otp.length > 6) {
        return {
            valid: false,
            message: "Please enter a valid OTP.",
        };
    }

    return {
        valid: true,
    };
}