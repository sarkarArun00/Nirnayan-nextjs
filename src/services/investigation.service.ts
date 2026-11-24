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
