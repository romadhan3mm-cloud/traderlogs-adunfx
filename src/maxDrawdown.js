// Max Drawdown: penurunan terbesar saldo dari puncak ke lembah berikutnya.
// Fungsi murni, tidak mengubah data atau computeRows/computeStats.
// Memakai hasil bersih trading per hari (profit - loss - komisi). Penarikan (withdraw) sengaja diabaikan,
// sama dengan aturan Risk Guard, supaya menarik uang tidak tampak sebagai penurunan.
// Titik awal = saldo awal periode (rows[0].start) dan dihitung sebagai puncak pertama.
import { round2 } from "./journalMath.js";

export function computeMaxDrawdown(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const startBal = Number(rows[0].start);
  if (!Number.isFinite(startBal)) return null;
  let eq = startBal;
  let peak = startBal;
  let best = { amount: 0, pct: 0, peak: startBal, trough: startBal };
  for (const r of rows) {
    eq = round2(eq + (Number(r.profit) || 0) - (Number(r.loss) || 0) - (Number(r.komisi) || 0));
    if (eq > peak) peak = eq;
    const dd = round2(peak - eq);
    if (dd > best.amount) best = { amount: dd, pct: peak > 0 ? (dd / peak) * 100 : 0, peak, trough: eq };
  }
  return best;
}
