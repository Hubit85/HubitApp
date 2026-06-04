export type RegistrableRole =
  | "particular"
  | "community_member"
  | "service_provider"
  | "property_administrator";

const ROLES_VERIFIED_ON_REGISTRATION: RegistrableRole[] = [
  "particular",
  "community_member",
];

export function isRoleVerifiedOnRegistration(roleType: RegistrableRole): boolean {
  return ROLES_VERIFIED_ON_REGISTRATION.includes(roleType);
}

export function getRegistrationVerificationFields(roleType: RegistrableRole, timestamp = new Date().toISOString()) {
  const isVerified = isRoleVerifiedOnRegistration(roleType);

  return {
    is_verified: isVerified,
    verification_confirmed_at: isVerified ? timestamp : null,
    verification_token: null,
    verification_expires_at: null,
  };
}
