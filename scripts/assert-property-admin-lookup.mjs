#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const liveAdminUiFiles = [
  "src/components/IncidentReportForm.tsx",
  "src/components/CommunityAdministratorAssignment.tsx",
];

const invalidEmbed = "profiles!user_roles_user_id_fkey";

test("live admin pickers do not embed the missing user_roles→profiles FK", () => {
  for (const file of liveAdminUiFiles) {
    const source = readFileSync(file, "utf8");
    assert.equal(
      source.includes(invalidEmbed),
      false,
      `${file} still embeds ${invalidEmbed}`
    );
    assert.match(
      source,
      /loadVerifiedPropertyAdministratorsWithProfiles/,
      `${file} should load administrators via the two-query helper`
    );
  }
});

test("admin lookup queries user_roles and profiles separately", () => {
  const source = readFileSync("src/services/AdministratorRequestService.ts", "utf8");
  const methodStart = source.indexOf("loadVerifiedPropertyAdministratorsWithProfiles");
  assert.notEqual(methodStart, -1, "helper method is missing");
  const methodBody = source.slice(methodStart, methodStart + 2500);
  assert.match(methodBody, /\.from\('user_roles'\)/);
  assert.match(methodBody, /\.from\('profiles'\)/);
  assert.equal(methodBody.includes(invalidEmbed), false);
});
