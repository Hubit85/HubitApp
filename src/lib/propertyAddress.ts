export interface StoredPropertyAddressInput {
  street?: string | null;
  number?: string | null;
  existingAddress?: string | null;
  originalStreet?: string | null;
  originalNumber?: string | null;
}

function normalize(value?: string | null): string {
  return (value || "").trim();
}

/**
 * Properties created outside the structured form (incident picker, auto-registration)
 * store the location only in `address`. Rebuilding `address` from empty street/number
 * fields would wipe that value on the next save.
 */
export function resolveStoredPropertyAddress(input: StoredPropertyAddressInput): string {
  const composed = `${normalize(input.street)} ${normalize(input.number)}`.trim();
  if (composed) {
    return composed;
  }

  const streetUnchanged = normalize(input.street) === normalize(input.originalStreet);
  const numberUnchanged = normalize(input.number) === normalize(input.originalNumber);
  if (streetUnchanged && numberUnchanged) {
    return normalize(input.existingAddress);
  }

  return "";
}
