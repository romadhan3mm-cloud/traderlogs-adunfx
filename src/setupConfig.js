// Tag setup dan checklist sebelum entry. Mau ganti nama tag atau isi checklist? Ubah dua daftar di bawah ini.
// Catatan: id tag disimpan di data jurnal (field `setup` per hari). Jangan ubah id yang sudah dipakai;
// ubah `label` saja kalau cuma mau mengganti nama tampilan.
import { round2 } from "./journalMath.js";

export const NO_SETUP_ID = "none";

export const SETUP_TAGS = [
  { id: "pullback", label: "Pullback" },
  { id: "breakout", label: "Breakout" },
  { id: "reversal", label: "Reversal" },
  { id: NO_SETUP_ID, label: "Tanpa setup" },
];

export const SETUP_CHECKLIST = [
  "Harga ada di zona yang sudah ditandai",
  "Konfirmasi candle sesuai setup",
  "Stop loss dan lot sesuai batas rugi",
  "Risk reward minimal 1:2",
];

export function setupLabel(id) {
  const t = SETUP_TAGS.find((x) => x.id === id);
  return t ? t.label : "";
}

function emptyBucket() {
  return { days: 0, wins: 0, losses: 0, net: 0 };
}

function addTo(bucket, net) {
  bucket.days += 1;
  if (net > 0) bucket.wins += 1;
  else if (net < 0) bucket.losses += 1;
  bucket.net = round2(bucket.net + net);
}

function finish(bucket) {
  const decided = bucket.wins + bucket.losses;
  return { ...bucket, winrate: decided > 0 ? bucket.wins / decided : null };
}

// Rangkum hasil per tag dari semua bulan. Satu entri = satu hari. Hasil bersih hari itu = profit - loss - komisi
// (penarikan tidak dihitung). Entri tanpa tag (data lama) tidak ikut dihitung, hanya dicacah di `untagged`.
export function computeSetupStats(months) {
  const withSetup = emptyBucket();
  const noSetup = emptyBucket();
  const perTag = new Map(SETUP_TAGS.map((t) => [t.id, emptyBucket()]));
  let untagged = 0;
  Object.values(months || {}).forEach((m) => {
    (m && Array.isArray(m.entries) ? m.entries : []).forEach((e) => {
      const tag = e && e.setup;
      if (!tag || !perTag.has(tag)) { untagged += 1; return; }
      const net = round2((Number(e.profit) || 0) - (Number(e.loss) || 0) - (Number(e.komisi) || 0));
      addTo(perTag.get(tag), net);
      addTo(tag === NO_SETUP_ID ? noSetup : withSetup, net);
    });
  });
  return {
    withSetup: finish(withSetup),
    noSetup: finish(noSetup),
    byTag: SETUP_TAGS.map((t) => ({ id: t.id, label: t.label, ...finish(perTag.get(t.id)) })),
    untagged,
    tagged: withSetup.days + noSetup.days,
  };
}
