
/**
 * Diagnostic Test API Types
 *
 * Based on the existing Nirnayan Healthcare
 * diagnostic test API response.
 *
 * Fields not required by the current test-listing UI
 * can be added as their corresponding features
 * are implemented.
 */

/* ========================================
   TEST LIST REQUEST
======================================== */

export interface GetAllTestsRequest {
    state: string | null;
}

/* ========================================
   INVESTIGATION GROUP
======================================== */

/**
 * Retained for compatibility with the previously
 * inspected Angular implementation.
 *
 * The provided sample test record does not contain
 * InvestigationGroups, so its availability and
 * full structure remain to be confirmed.
 */

export interface InvestigationGroup {
    group_name?: string | null;
}

/* ========================================
   TURNAROUND TIME
======================================== */

export interface TestTurnaroundTime {
    value: string;
    isHour: boolean;
}

export interface TestTat {
    normalTat?: TestTurnaroundTime | null;
    urgentTat?: TestTurnaroundTime | null;
}

/* ========================================
   MRP INVESTIGATION
======================================== */

export interface InvestigationPriceProfile {
    id: number;
    profileName: string;
    country_id: number;
    region_id: number;
    state_id: number;
    status: string;
}

export interface MrpInvestigation {
    amount: string;
    mrp_profile_id: number;
    testCode: string;
    testName: string;
    test_id: number;
    profile?: InvestigationPriceProfile | null;
}

/* ========================================
   TEST PARAMETERS
======================================== */

export interface TestParameter {
    id: number;
    parameter_code: string;
    parameter_name: string;
    description?: string | null;
    showOnWebsite?: boolean;
}

/* ========================================
   DIAGNOSTIC TEST
======================================== */

export interface DiagnosticTest {
    id: number;

    test_code: string;
    test_name: string;

    department_id?: number | null;
    subDepartment_id?: number | null;
    category_id?: number | null;

    description?: string | null;
    prerequisites?: string | null;

    product_type?: string;

    availability?: string;
    homeCollection?: boolean;

    mrpAmount?: string | null;
    offerPrice?: number | null;

    tat?: TestTat | null;

    mrpInvestigation?: MrpInvestigation[];

    OfferPriceTestWises?: unknown[];

    ParameterMasters?: TestParameter[];

    InvestigationGroups?: InvestigationGroup[] | null;
}

/* ========================================
   TEST LIST API RESPONSE
======================================== */

/**
 * The provided JSON represents a single test record.
 *
 * The complete getAllTests response envelope
 * has not yet been confirmed.
 *
 * The Angular implementation previously read
 * the test array from response.data.
 */

export interface GetAllTestsResponse {
    data: DiagnosticTest[];
    status: number;
    success: boolean;
}