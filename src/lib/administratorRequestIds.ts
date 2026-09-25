/**
 * administrator_requests.property_administrator_id references profiles.id.
 * Callers pass user_roles.id or property_administrators.id. Those values
 * must be reduced to the administrator's profile id before insert, and
 * managed_communities still needs the user_roles.id.
 */

export interface AdministratorProfileLookups {
  roleUserId: string | null;
  propertyAdministratorUserId: string | null;
  profileId: string | null;
}

export function selectAdministratorProfileId(
  lookups: AdministratorProfileLookups
): string | null {
  return lookups.roleUserId || lookups.propertyAdministratorUserId || lookups.profileId || null;
}

export interface AdministratorRoleLookups {
  roleIdByPrimaryKey: string | null;
  roleIdByUserId: string | null;
}

export function selectAdministratorRoleId(
  lookups: AdministratorRoleLookups
): string | null {
  return lookups.roleIdByPrimaryKey || lookups.roleIdByUserId || null;
}
