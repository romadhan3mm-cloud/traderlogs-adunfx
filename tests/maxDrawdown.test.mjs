// Tes Max Drawdown (src/maxDrawdown.js). Jalankan: npm test. Nilai diharapkan dihitung tangan.
import test from "node:test";
import assert from "node:assert/strict";
import { computeRows } from "../src/journalMath.js";
import { computeMaxDrawdown } from "../src/maxDrawdown.js";

const day = (profit, loss, extra = {}) => ({ profit: String(profit || ""), loss: String(loss || ""), komisi: "", withdraw: "", ...extra });

test("tanpa data mengembalikan null", () => {
  assert.equal(computeMaxDrawdown([]), null);
  assert.equal(computeMaxDrawdown(null), null);
});

test("contoh gambar: 100 -> 120 -> 112.50 -> 134 = turun 7.50 (6.25%)", () => {
  const rows = computeRows([day(20, 0), day(0, 7.5), day(21.5, 0)], 100);
  const r = computeMaxDrawdown(rows);
  assert.equal(r.amount, 7.5);
  assert.equal(r.pct, 6.25);
  assert.equal(r.peak, 120);
  assert.equal(r.trough, 112.5);
});

test("tidak pernah turun dari puncak = 0", () => {
  const rows = computeRows([day(5, 0), day(10, 0)], 100);
  const r = computeMaxDrawdown(rows);
  assert.equal(r.amount, 0);
  assert.equal(r.pct, 0);
});

test("dua penurunan: yang terbesar yang diambil, persen dari puncaknya", () => {
  // 100 -> 90 (turun 10 dari puncak 100) -> 120 -> 114 (turun 6 dari puncak 120)
  const rows = computeRows([day(0, 10), day(30, 0), day(0, 6)], 100);
  const r = computeMaxDrawdown(rows);
  assert.equal(r.amount, 10);
  assert.equal(r.pct, 10);
  assert.equal(r.peak, 100);
  assert.equal(r.trough, 90);
});

test("penarikan dana tidak dihitung sebagai penurunan", () => {
  // 100 -> 120, tarik 50 (saldo 70), lalu rugi 7.5. Drawdown tetap 7.5, bukan 57.5.
  const rows = computeRows([day(20, 0), day(0, 0, { withdraw: "50" }), day(0, 7.5)], 100);
  const r = computeMaxDrawdown(rows);
  assert.equal(r.amount, 7.5);
  assert.equal(r.pct, 6.25);
});

test("komisi ikut mengurangi hasil harian", () => {
  // 100 -> +10 komisi 2 = 108 -> rugi 8 = 100 ; puncak 108, lembah 100 : turun 8
  const rows = computeRows([day(10, 0, { komisi: "2" }), day(0, 8)], 100);
  const r = computeMaxDrawdown(rows);
  assert.equal(r.amount, 8);
  assert.equal(r.peak, 108);
  assert.equal(r.trough, 100);
});
