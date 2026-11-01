import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fmtMoney } from "./journalMath.js";
import { mix, s, INNER_BG, INNER_BORDER, BOX_RADIUS } from "./CardHeader.jsx";
import { computeSetupStats, NO_SETUP_ID } from "./setupConfig.js";

// Bagian "Statistik Setup" di dalam kartu Input Transaksi (kartu dalam + tombol emas, seperti Capital Lot Reference
// di kartu Rekomendasi Lot). Hanya tampilan; angka dihitung oleh computeSetupStats (src/setupConfig.js) dari semua bulan.

const pct = (w) => (w === null || w === undefined ? "-" : `${Math.round(w * 100)}%`);
const netColor = (n) => (n > 0 ? "var(--green)" : n < 0 ? "var(--red)" : "var(--text)");
const netText = (n) => `${n > 0 ? "+" : ""}${fmtMoney(n)}`;

function Box({ label, data, tone }) {
  return (
    <div style={{ minWidth: 0, borderRadius: BOX_RADIUS, padding: `${s(12, 6)} ${s(10, 5)}`, background: INNER_BG, border: INNER_BORDER, textAlign: "center" }}>
      <div style={{ fontSize: s(14, 9), color: tone, fontWeight: 700 }}>{label}</div>
      <div className="tj-mono" style={{ fontSize: "max(12px, min(26px, 4.6cqw))", fontWeight: 800, color: netColor(data.net), marginTop: s(6, 3), whiteSpace: "nowrap" }}>{data.days ? netText(data.net) : "-"}</div>
      <div style={{ fontSize: s(12, 8.5), color: "var(--muted)", marginTop: s(4, 2) }}>{data.days} hari · menang {pct(data.winrate)}</div>
    </div>
  );
}

export default function SetupStatsSection({ months, open, onToggle }) {
  const st = computeSetupStats(months);
  // Terlipat: satu baris ringkasan di bawah tombol, supaya hasil terlihat tanpa membuka.
  const summary = st.tagged === 0
    ? "Belum ada hari yang diberi tag."
    : `Sesuai setup ${st.withSetup.days ? netText(st.withSetup.net) : "-"} · Tanpa setup ${st.noSetup.days ? netText(st.noSetup.net) : "-"}`;
  return (
    <div style={{ marginTop: s(10, 5), borderRadius: s(20, 12), padding: s(10, 5), background: INNER_BG, border: INNER_BORDER }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{ width: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: `${s(11, 6)} ${s(40, 24)}`, borderRadius: s(10, 6), border: "1.5px solid var(--gold)", background: open ? mix("var(--gold)", 15) : "transparent", color: "var(--gold)", fontSize: s(15, 9.5), fontWeight: 800, letterSpacing: ".02em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}
      >
        <span>Statistik Setup</span>
        <span style={{ position: "absolute", right: s(16, 8), top: "50%", transform: "translateY(-50%)", display: "inline-flex" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {!open && (
        <div className="tj-mono" style={{ fontSize: s(12, 9), color: "var(--muted)", textAlign: "center", marginTop: s(8, 4) }}>{summary}</div>
      )}
      {open && (
        <div style={{ marginTop: s(10, 5) }}>
          {st.tagged === 0 ? (
            <div style={{ fontSize: s(13, 10), color: "var(--muted)", lineHeight: 1.5, textAlign: "center", padding: `${s(6, 3)} ${s(8, 4)}` }}>
              Belum ada hari yang diberi tag. Pilih tag saat menekan Tambah Transaksi, atau lewat tulisan kecil di bawah tanggal pada tabel.
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: s(10, 5), marginBottom: s(12, 6) }}>
                <Box label="Sesuai setup" data={st.withSetup} tone="var(--green)" />
                <Box label="Tanpa setup" data={st.noSetup} tone="var(--red)" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {st.byTag.filter((t) => t.days > 0).map((t, i) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: s(8, 4), fontSize: s(13, 10), padding: `${s(8, 4)} ${s(4, 2)}`, borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                    <span style={{ flex: "1 1 0", minWidth: 0, fontWeight: 700, color: t.id === NO_SETUP_ID ? "var(--red)" : "var(--text)" }}>{t.label}</span>
                    <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{t.days} hari · {pct(t.winrate)}</span>
                    <span className="tj-mono" style={{ minWidth: 64, textAlign: "right", fontWeight: 700, color: netColor(t.net), whiteSpace: "nowrap" }}>{netText(t.net)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {st.untagged > 0 && (
            <div style={{ fontSize: s(11, 9), color: "var(--muted)", textAlign: "center", marginTop: s(10, 5) }}>
              {st.untagged} hari belum diberi tag dan tidak dihitung.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
