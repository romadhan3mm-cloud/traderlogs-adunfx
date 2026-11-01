// Max Drawdown: penurunan saldo terbesar dari puncak ke lembah berikutnya, dihitung dari baris hasil computeRows.
// Fungsi murni, terpisah dari journalMath.js. Penarikan (withdraw) tidak dihitung sebagai penurunan karena bukan hasil trading.
// Saldo dihitung per akhir hari (data jurnal per hari), mulai dari saldo awal bulan sebagai puncak pertama.
import { round2 } from "./journalMath.js";

export function computeMaxDrawdown(rows) {
  if (!rows || rows.length === 0) return { hasData: false, amount: 0, pct: 0, peak: 0, trough: 0 };
  let eq = round2(Number(rows[0].start) || 0);
  let peak = eq;
  let best = { amount: 0, peak: eq, trough: eq };
  for (const r of rows) {
    eq = round2(eq + (Number(r.profit) || 0) - (Number(r.loss) || 0) - (Number(r.komisi) || 0));
    if (eq > peak) peak = eq;
    const dd = round2(peak - eq);
    if (dd > best.amount) best = { amount: dd, peak, trough: eq };
  }
  const pct = best.peak > 0 ? round2((best.amount / best.peak) * 100) : 0;
  return { hasData: true, amount: best.amount, pct, peak: best.peak, trough: best.trough };
}
