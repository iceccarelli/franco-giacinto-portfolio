import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

/**
 * Guards against the one mistake this repository keeps making.
 *
 * `.gitignore` has listed `*.patch` for some time, and it does not help:
 * uploading a file through the GitHub web UI writes it straight to a commit,
 * and .gitignore only ever applied to files git was not already tracking.
 * Three patch files reached `main` that way, and one of them then collided
 * with the very branch it was meant to deliver — `git am` reported
 * "modify/delete" on three files and left the working tree mid-merge.
 *
 * .gitignore is advice. This is a gate: it reads the git index, so it fails
 * however the file arrived.
 */
describe("repository hygiene", () => {
  /** Everything git is actually tracking, whatever .gitignore says. */
  function trackedFiles(): string[] {
    try {
      return execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(Boolean);
    } catch {
      // No git (a tarball export, a sandboxed CI runner). Nothing to assert.
      return [];
    }
  }

  test("no one-off transport script is left at the repo root", () => {
    // apply-integration.sh and applyintegration.sh both reached main the same
    // way the patches did. A script that exists to apply one specific patch is
    // transport too; scripts that earn a place in the repo live in scripts/.
    const offenders = trackedFiles().filter((f) => /^apply[-_]?\w*\.sh$/i.test(f));
    assert.deepEqual(offenders, [], `One-off scripts at the repo root: ${offenders.join(", ")}`);
  });

  test("no patch or diff file is tracked", () => {
    const offenders = trackedFiles().filter((f) => /\.(patch|diff)$/i.test(f));
    assert.deepEqual(
      offenders,
      [],
      `Patches are transport, not source. Tracked: ${offenders.join(", ")}. ` +
        "Apply with `git am`, then `git rm` the file — do not upload it to a branch.",
    );
  });

  test("no build output, dependency tree or env file is tracked", () => {
    const offenders = trackedFiles().filter(
      (f) =>
        f.startsWith("node_modules/") ||
        f.startsWith(".next/") ||
        f === ".env" ||
        /^\.env\.(local|production|development)/.test(f),
    );
    assert.deepEqual(offenders, [], `Tracked build/secret artefacts: ${offenders.join(", ")}`);
  });

  test(".gitignore still covers patches, so the mistake is caught before commit too", () => {
    assert.ok(existsSync(".gitignore"));
    const ignore = readFileSync(".gitignore", "utf8");
    assert.match(ignore, /^\*\.patch$/m, ".gitignore must ignore *.patch");
  });

  test("every documented stage has an entry in the changelog", () => {
    const log = readFileSync("docs/DOMINATION_CHANGELOG.md", "utf8");
    for (const stage of ["Stage 0", "Stage 1", "Stage 2", "Stage 3"]) {
      assert.ok(log.includes(stage), `${stage} is implemented but absent from the changelog`);
    }
  });

  test("the off-site blockers document exists and names the gating item first", () => {
    const doc = readFileSync("docs/OFFSITE_BLOCKERS.md", "utf8");
    const first = doc.indexOf("## 1.");
    assert.ok(first > -1, "OFFSITE_BLOCKERS.md must be a numbered list of owner actions");
    assert.match(
      doc.slice(first, first + 200),
      /Google Business Profile/,
      "Item 1 must be the GBP claim — nothing else on the list gates the Map Pack",
    );
  });
});
