// Tes untuk rangkuman tag setup (src/setupConfig.js). Jalankan: npm test
// Nilai yang diharapkan dihitung tangan.
import test from "node:test";
import assert from "node:assert/strict";
import { computeSetupStats, setupLabel, NO_SETUP_ID } from "../src/setupConfig.js";

const d = "2026-10-05T05:00:00.000Z";

test("rangkuman kosong tidak error", () => {
  const r = computeSetupStats(null);
  assert.equal(r.tagged, 0);
  assert.equal(r.untagged, 0);
  assert.equal(r.withSetup.winrate, null);
});

test("hasil per tag dan gabungan sesuai setup vs tanpa setup", () => {
  const months = {
    "2026-10": { entries: [
      { id: "a", date: d, setup: "pullback", profit: "20", loss: "", komisi: "1" },   // +19
      { id: "b", date: d, setup: "breakout", profit: "", loss: "10", komisi: "1" },   // -11
      { id: "c", date: d, setup: NO_SETUP_ID, profit: "", loss: "30", komisi: "2" },  // -32
      { id: "d", date: d, profit: "50", loss: "", komisi: "" },                         // tanpa tag, diabaikan
    ] },
    "2026-11": { entries: [
      { id: "e", date: d, setup: "pullback", profit: "5", loss: "", komisi: "", withdraw: "100" }, // +5, withdraw tidak dihitung
    ] },
  };
  const r = computeSetupStats(months);
  assert.equal(r.untagged, 1);
  assert.equal(r.tagged, 4);
  assert.equal(r.withSetup.days, 3);
  assert.equal(r.withSetup.net, 13);            // 19 - 11 + 5
  assert.equal(r.withSetup.wins, 2);
  assert.equal(r.withSetup.losses, 1);
  assert.equal(r.withSetup.winrate, 2 / 3);
  assert.equal(r.noSetup.days, 1);
  assert.equal(r.noSetup.net, -32);
  assert.equal(r.noSetup.winrate, 0);
  const pull = r.byTag.find((t) => t.id === "pullback");
  assert.equal(pull.days, 2);
  assert.equal(pull.net, 24);
});

test("label tag dikenali, id tak dikenal kosong", () => {
  assert.equal(setupLabel("pullback"), "Pullback");
  assert.equal(setupLabel("xyz"), "");
});
