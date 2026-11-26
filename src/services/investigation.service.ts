export type SearchInvestigation = {
  id: number;
  test_name: string;
  product_type: "test" | "package";
  description: string;
  department_id: number | null;
  test_code: string;
  tat: {
    normalTat: { value: string; isHour: boolean };
    urgentTat: { value: string; isHour: boolean };
  };
  homeCollection: boolean;
  tempOrder: number;
  mrpAmount: string;
  offerAmount: number | string | null;
  finalAmount: string | number;
};

export type InvestigationSearchResponse = {
  data: SearchInvestigation[];
  status: number;
  success: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};



export type InvestigationDetail = {
  id: number;
  test_name: string;
  product_type: "test" | "package";
  description: string | null;
  department_id: number | null;
  test_code: string;
  tat: {
    normalTat: { value: string; isHour: boolean };
    urgentTat: { value: string; isHour: boolean };
  } | null;
  homeCollection: boolean;
  tempOrder: number;
  prerequisites: string | null;
  gender: number | null;
  sample_quantity: string | null;
  mrpAmount: number | string;
  offerAmount: number | string | null;
  finalAmount: number | string;
  sampleTypes: {
    id: number;
    sampleName: string;
    sampleTypeCode: string;
    description: string | null;
  }[];
  alias_names: string[];
  testCount?: number;
  testNames?: string[];
  groupNames?: string[];
};

export async function searchInvestigations(
  payload: { search: string; state_id: number; page: number; limit: number },
  signal?: AbortSignal,
): Promise<InvestigationSearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_LIMS_API_BASE_URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/global/investigation/searchInvestigations`,
    {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal,
    },
  );
  const result = await response.json().catch(() => null);

  if (
    !response.ok || Number(result?.status) !== 1 ||
    result?.success === false || !Array.isArray(result?.data)
  ) {
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : "Unable to search investigations. Please try again.",
    );
  }

  return result;
}

export async function getInvestigationById(
  input: { id: number; state_id: number },
  signal?: AbortSignal,
): Promise<InvestigationDetail> {
  if (!Number.isSafeInteger(input.id) || input.id <= 0) {
    throw new Error("Invalid investigation ID.");
  }
  if (!Number.isSafeInteger(input.state_id) || input.state_id <= 0) {
    throw new Error("Please select a location first.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_LIMS_API_BASE_URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/global/investigation/getInvestigationById`,
    {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: input.id, state_id: input.state_id }),
      cache: "no-store",
      signal,
    },
  );
  const result = await response.json().catch(() => null);

  if (!response.ok || Number(result?.status) !== 1 || result?.success !== true) {
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : "Unable to load investigation details. Please try again.",
    );
  }

  const detail: InvestigationDetail | null = result?.data ?? null;
  if (
    !detail || detail.id !== input.id || !detail.test_name ||
    (detail.product_type !== "test" && detail.product_type !== "package")
  ) {
    throw new Error("Investigation details were not found.");
  }

  return detail;
}



