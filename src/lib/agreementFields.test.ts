import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildStoredContractFields, buildStoredQuoteFields } from "./agreementFields";

describe("buildStoredQuoteFields", () => {
  it("keeps the warranty the provider entered", () => {
    assert.deepEqual(buildStoredQuoteFields({ warranty_period: "24 meses" }), {
      warranty_period: "24 meses",
    });
  });

  it("stores null when the warranty is blank", () => {
    assert.deepEqual(buildStoredQuoteFields({ warranty_period: "   " }), {
      warranty_period: null,
    });
  });
});

describe("buildStoredContractFields", () => {
  it("persists the delivery deadline and the terms the provider entered", () => {
    const stored = buildStoredContractFields({
      title: "Reparación de bajante",
      work_scope: "Sustituir el tramo vertical",
      payment_terms: "50% al inicio, 50% al completar",
      deadline: "2026-11-15",
      warranty_period: "12 meses",
      special_terms: "Acceso por el patio interior",
    });

    assert.equal(stored.work_description, "Reparación de bajante\nSustituir el tramo vertical");
    assert.equal(stored.payment_schedule, "50% al inicio, 50% al completar");
    assert.equal(stored.end_date, "2026-11-15");
    assert.equal(stored.terms, "Garantía: 12 meses\n\nAcceso por el patio interior");
  });

  it("leaves the deadline empty when the provider does not set one", () => {
    const stored = buildStoredContractFields({
      title: "Pintura",
      work_scope: "Pintar el portal",
      deadline: "",
      warranty_period: "",
      special_terms: "",
    });

    assert.equal(stored.end_date, null);
    assert.equal(stored.terms, null);
    assert.equal(stored.work_description, "Pintura\nPintar el portal");
  });

  it("falls back to the quote description when the work scope is empty", () => {
    const stored = buildStoredContractFields({
      fallbackDescription: "Descripción de la cotización",
    });

    assert.equal(stored.work_description, "Descripción de la cotización");
  });
});
