import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { quoteIdsWithoutContract, resolveContractAudience } from "./contractAccess";

describe("resolveContractAudience", () => {
  it("no consulta hasta conocer un rol", () => {
    assert.equal(resolveContractAudience(null, [], null), null);
    assert.equal(resolveContractAudience(undefined, [], undefined), null);
  });

  it("usa el rol activo aunque el perfil sea de otro tipo", () => {
    assert.equal(
      resolveContractAudience("service_provider", ["community_member"], "community_member"),
      "provider"
    );
    assert.equal(
      resolveContractAudience("community_member", ["service_provider"], "service_provider"),
      "client"
    );
  });

  it("cae al primer rol verificado y después al tipo de perfil", () => {
    assert.equal(resolveContractAudience(null, ["service_provider"], "particular"), "provider");
    assert.equal(resolveContractAudience(null, [], "service_provider"), "provider");
    assert.equal(resolveContractAudience(null, [], "particular"), "client");
  });
});

describe("quoteIdsWithoutContract", () => {
  it("excluye cotizaciones que ya tienen contrato", () => {
    const quotes = [{ id: "q1" }, { id: "q2" }, { id: "q3" }];
    const available = quoteIdsWithoutContract(quotes, new Set(["q2"]));
    assert.deepEqual(available.map((quote) => quote.id), ["q1", "q3"]);
  });
});
