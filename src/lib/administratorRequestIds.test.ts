import assert from "node:assert/strict";
import test from "node:test";
import {
  selectAdministratorProfileId,
  selectAdministratorRoleId,
} from "./administratorRequestIds.ts";

test("property administrator row resolves to profiles.id, not the row id", () => {
  const profileId = selectAdministratorProfileId({
    roleUserId: null,
    propertyAdministratorUserId: "profile-admin-1",
    profileId: null,
  });

  assert.equal(profileId, "profile-admin-1");
  assert.notEqual(profileId, "property-administrators-row");
});

test("user role id resolves through the role's user_id", () => {
  assert.equal(
    selectAdministratorProfileId({
      roleUserId: "profile-from-role",
      propertyAdministratorUserId: null,
      profileId: null,
    }),
    "profile-from-role"
  );
});

test("a profile id is kept when it is already the foreign key target", () => {
  assert.equal(
    selectAdministratorProfileId({
      roleUserId: null,
      propertyAdministratorUserId: null,
      profileId: "profile-direct",
    }),
    "profile-direct"
  );
});

test("unknown ids are rejected", () => {
  assert.equal(
    selectAdministratorProfileId({
      roleUserId: null,
      propertyAdministratorUserId: null,
      profileId: null,
    }),
    null
  );
});

test("accept path maps a stored profile id back to user_roles.id", () => {
  assert.equal(
    selectAdministratorRoleId({
      roleIdByPrimaryKey: null,
      roleIdByUserId: "role-admin-1",
    }),
    "role-admin-1"
  );
});
