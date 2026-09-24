/**
 * Columnas reales de `profiles` (database.types.ts, 2025-09-30).
 * El alta siempre adjunta `additionalRoles` y, en miembros de comunidad,
 * `community_code`. Esas claves no son columnas: PostgREST responde
 * PGRST204 y el registro aborta antes de crear roles.
 */
const PROFILE_FIELDS = [
  "full_name",
  "phone",
  "address",
  "city",
  "postal_code",
  "province",
  "country",
  "avatar_url",
  "language",
  "timezone",
  "email_notifications",
  "sms_notifications",
  "is_verified",
  "verification_code",
] as const;

export type RegistrationProfileInsert = {
  id: string;
  email: string;
  user_type: string;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  province?: string | null;
  country?: string | null;
  avatar_url?: string | null;
  language?: string | null;
  timezone?: string | null;
  email_notifications?: boolean | null;
  sms_notifications?: boolean | null;
  is_verified?: boolean | null;
  verification_code?: string | null;
};

export function buildRegistrationProfileInsert(
  userId: string,
  email: string,
  userData: object
): RegistrationProfileInsert {
  const source = userData as Record<string, unknown>;
  const profile: RegistrationProfileInsert = {
    id: userId,
    email,
    user_type: typeof source.user_type === "string" && source.user_type.length > 0
      ? source.user_type
      : "particular",
  };

  for (const key of PROFILE_FIELDS) {
    if (source[key] !== undefined) {
      (profile as Record<string, unknown>)[key] = source[key];
    }
  }

  return profile;
}
