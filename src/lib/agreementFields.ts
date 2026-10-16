function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export interface QuoteDraftFields {
  warranty_period?: string | null;
}

export function buildStoredQuoteFields(draft: QuoteDraftFields): {
  warranty_period: string | null;
} {
  return {
    warranty_period: normalizeOptionalText(draft.warranty_period),
  };
}

export interface ContractDraftFields {
  title?: string | null;
  work_scope?: string | null;
  fallbackDescription?: string | null;
  payment_terms?: string | null;
  deadline?: string | null;
  warranty_period?: string | null;
  special_terms?: string | null;
}

export function buildStoredContractFields(draft: ContractDraftFields): {
  work_description: string;
  payment_schedule: string | null;
  end_date: string | null;
  terms: string | null;
} {
  const workScope =
    normalizeOptionalText(draft.work_scope) ||
    normalizeOptionalText(draft.fallbackDescription) ||
    "Descripción del trabajo";
  const title = normalizeOptionalText(draft.title);
  const workDescription =
    title && title !== workScope ? `${title}\n${workScope}` : workScope;

  const termLines: string[] = [];
  const warranty = normalizeOptionalText(draft.warranty_period);
  const specialTerms = normalizeOptionalText(draft.special_terms);
  if (warranty) {
    termLines.push(`Garantía: ${warranty}`);
  }
  if (specialTerms) {
    termLines.push(specialTerms);
  }

  return {
    work_description: workDescription,
    payment_schedule: normalizeOptionalText(draft.payment_terms),
    end_date: normalizeOptionalText(draft.deadline),
    terms: termLines.length > 0 ? termLines.join("\n\n") : null,
  };
}
