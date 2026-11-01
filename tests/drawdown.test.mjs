// Tes Max Drawdown (src/drawdown.js). Jalankan: npm test
// Nilai yang diharapkan dihitung tangan.
import test from "node:test";
import assert from "node:assert/strict";
import { computeMaxDrawdown } from "../src/drawdown.js";

test("drawdown: puncak 120 turun ke 112.50 = 7.50 (6.25%)", () => {
  // 100 +20 = 120 (puncak), -7.5 = 112.5 (lembah)
  const d = computeMaxDrawdown([{ start: 100, profit: 20 }, { loss: 7.5 }]);
  assert.deepEqual(d, { hasData: true, amount: 7.5, pct: 6.25, peak: 120, trough: 112.5 });
});

test("drawdown: saldo hanya naik = 0", () => {
  const d = computeMaxDrawdown([{ start: 100, profit: 5 }, { profit: 3 }]);
  assert.equal(d.amount, 0);
  assert.equal(d.pct, 0);
  assert.equal(d.hasData, true);
});

test("drawdown: penarikan tidak dihitung sebagai penurunan", () => {
  // 100 +20 = 120; tarik 50 (diabaikan) tetap 120; -5 = 115 -> turun 5 dari 120 = 4.17%
  const d = computeMaxDrawdown([{ start: 100, profit: 20 }, { withdraw: 50 }, { loss: 5 }]);
  assert.equal(d.amount, 5);
  assert.equal(d.pct, 4.17);
  assert.equal(d.peak, 120);
  assert.equal(d.trough, 115);
});

test("drawdown: komisi ikut mengurangi saldo", () => {
  // 100 +10 -1 = 109 (puncak); -2 -0.5 = 106.5 -> turun 2.5 dari 109 = 2.29%
  const d = computeMaxDrawdown([{ start: 100, profit: 10, komisi: 1 }, { loss: 2, komisi: 0.5 }]);
  assert.equal(d.amount, 2.5);
  assert.equal(d.pct, 2.29);
  assert.equal(d.peak, 109);
});

test("drawdown: yang diambil penurunan terbesar, bukan yang terakhir", () => {
  // 100 -10 = 90 (turun 10 dari 100); +30 = 120; -5 = 115 (turun 5)
  const d = computeMaxDrawdown([{ start: 100, loss: 10 }, { profit: 30 }, { loss: 5 }]);
  assert.equal(d.amount, 10);
  assert.equal(d.pct, 10);
  assert.equal(d.peak, 100);
  assert.equal(d.trough, 90);
});

test("drawdown: tanpa baris atau saldo awal 0", () => {
  assert.equal(computeMaxDrawdown([]).hasData, false);
  assert.equal(computeMaxDrawdown(undefined).amount, 0);
  const z = computeMaxDrawdown([{ start: 0, loss: 3 }]);
  assert.equal(z.pct, 0); // puncak 0: persen tidak terdefinisi, ditampilkan 0
});
