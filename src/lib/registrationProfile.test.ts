import assert from "node:assert/strict";
import test from "node:test";
import { buildRegistrationProfileInsert } from "./registrationProfile.ts";

test("el alta de particular no envía additionalRoles a profiles", () => {
  const payload = buildRegistrationProfileInsert("user-1", "ana@example.com", {
    full_name: "Ana López",
    user_type: "particular",
    phone: "600000000",
    address: "Calle Mayor 1",
    postal_code: "28001",
    city: "Madrid",
    province: "Madrid",
    country: "España",
    additionalRoles: [],
  });

  assert.equal(payload.id, "user-1");
  assert.equal(payload.email, "ana@example.com");
  assert.equal(payload.user_type, "particular");
  assert.equal(payload.full_name, "Ana López");
  assert.equal(payload.city, "Madrid");
  assert.equal("additionalRoles" in payload, false);
  assert.equal("community_code" in payload, false);
});

test("el alta de miembro de comunidad no envía community_code ni additionalRoles", () => {
  const payload = buildRegistrationProfileInsert("user-2", "luis@example.com", {
    full_name: "Luis García",
    user_type: "community_member",
    address: "Avenida del Puerto 4",
    city: "Valencia",
    community_code: "COM-AVENIDADEL-042",
    additionalRoles: [
      { roleType: "particular", roleSpecificData: { full_name: "Luis García" } },
    ],
  });

  assert.equal(payload.user_type, "community_member");
  assert.equal(payload.address, "Avenida del Puerto 4");
  assert.equal("community_code" in payload, false);
  assert.equal("additionalRoles" in payload, false);
  assert.deepEqual(Object.keys(payload).sort(), [
    "address",
    "city",
    "email",
    "full_name",
    "id",
    "user_type",
  ]);
});
