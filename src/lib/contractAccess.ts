export type ContractAudience = "provider" | "client";

/**
 * Misma prioridad que el selector de rol del dashboard:
 * rol activo, luego cualquier rol verificado, luego profiles.user_type.
 * null significa que todavía no hay rol conocido y no se debe consultar
 * como si el usuario fuera el cliente.
 */
export function resolveContractAudience(
  activeRoleType: string | null | undefined,
  verifiedRoleTypes: readonly string[],
  profileUserType: string | null | undefined
): ContractAudience | null {
  const role =
    activeRoleType ||
    verifiedRoleTypes.find((type) => Boolean(type)) ||
    profileUserType ||
    null;

  if (!role) return null;
  return role === "service_provider" ? "provider" : "client";
}

export function quoteIdsWithoutContract<T extends { id: string }>(
  quotes: readonly T[],
  contractedQuoteIds: ReadonlySet<string>
): T[] {
  return quotes.filter((quote) => !contractedQuoteIds.has(quote.id));
}
