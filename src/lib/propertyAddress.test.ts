import assert from "node:assert/strict";
import test from "node:test";
import { resolveStoredPropertyAddress } from "./propertyAddress";

test("keeps the legacy address when street and number were never set", () => {
  const address = resolveStoredPropertyAddress({
    street: null,
    number: null,
    existingAddress: "Calle Mayor 10",
    originalStreet: null,
    originalNumber: null,
  });

  assert.equal(address, "Calle Mayor 10");
});

test("uses street and number when the user fills them in", () => {
  const address = resolveStoredPropertyAddress({
    street: "Gran Vía",
    number: "25",
    existingAddress: "Calle Mayor 10",
    originalStreet: null,
    originalNumber: null,
  });

  assert.equal(address, "Gran Vía 25");
});

test("clears the address when the user removes a previously stored street and number", () => {
  const address = resolveStoredPropertyAddress({
    street: "",
    number: "",
    existingAddress: "Gran Vía 25",
    originalStreet: "Gran Vía",
    originalNumber: "25",
  });

  assert.equal(address, "");
});

test("builds the address for a new property and leaves it empty when both fields are blank", () => {
  assert.equal(
    resolveStoredPropertyAddress({
      street: "Serrano",
      number: "12",
    }),
    "Serrano 12"
  );

  assert.equal(
    resolveStoredPropertyAddress({
      street: "   ",
      number: "",
    }),
    ""
  );
});
