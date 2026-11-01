import React, { useState } from "react";
import { fmtMoney } from "./journalMath.js";
import { s, INNER_BG, INNER_BORDER, CardShell, CardHeader, HeaderBadge, BOX_RADIUS } from "./CardHeader.jsx";
import { computeSetupStats, NO_SETUP_ID } from "./setupConfig.js";

// Kartu "Statistik Setup": membandingkan hasil hari bertag setup dengan hari "Tanpa setup".
// Hanya tampilan; angka dihitung oleh computeSetupStats (src/setupConfig.js) dari semua bulan.

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

export default function SetupStatsCard({ months }) {
  const st = computeSetupStats(months);
  const [open, setOpen] = useState(false);
  // Terlipat: subjudul berisi ringkasan satu baris, supaya hasil terlihat tanpa membuka kartu.
  const summary = st.tagged === 0
    ? "Belum ada hari yang diberi tag."
    : `Sesuai setup ${st.withSetup.days ? netText(st.withSetup.net) : "-"} · Tanpa setup ${st.noSetup.days ? netText(st.noSetup.net) : "-"}`;
  return (
    <CardShell ariaLabel="Statistik Setup">
      <CardHeader
        divider={open}
        icon={
          <svg width="52%" height="52%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }} aria-hidden="true" focusable="false">
            <path d="m4 6 1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M11 6h9M11 12h9M11 18h9" />
          </svg>
        }
        title="Statistik Setup"
        subtitle={open ? "Hasil harian per tag setup." : summary}
        badge={
          <HeaderBadge
            onClick={() => setOpen((v) => !v)}
            active={open}
            ariaExpanded={open}
            ariaLabel="Tampilkan atau sembunyikan rincian statistik setup"
            icon={<svg width={s(18, 10)} height={s(18, 10)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }} aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" style={{ transformOrigin: "center", transform: open ? "rotate(180deg)" : "none" }} /></svg>}
            label="RINCIAN"
          />
        }
      />
      {!open ? null : st.tagged === 0 ? (
        <div style={{ fontSize: s(13, 10), color: "var(--muted)", lineHeight: 1.5, textAlign: "center", padding: `${s(6, 3)} ${s(8, 4)}` }}>
          Belum ada hari yang diberi tag. Pilih tag saat menekan Tambah Transaksi, atau lewat tulisan kecil di bawah tanggal pada tabel.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: s(10, 5), marginBottom: s(12, 6) }}>
            <Box label="Sesuai setup" data={st.withSetup} tone="var(--green)" />
            <Box label="Tanpa setup" data={st.noSetup} tone="var(--red)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: s(6, 3) }}>
            {st.byTag.filter((t) => t.days > 0).map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: s(8, 4), fontSize: s(13, 10), padding: `${s(7, 4)} ${s(10, 5)}`, borderRadius: BOX_RADIUS, background: INNER_BG, border: INNER_BORDER }}>
                <span style={{ flex: "1 1 0", minWidth: 0, fontWeight: 700, color: t.id === NO_SETUP_ID ? "var(--red)" : "var(--text)" }}>{t.label}</span>
                <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{t.days} hari · {pct(t.winrate)}</span>
                <span className="tj-mono" style={{ minWidth: 64, textAlign: "right", fontWeight: 700, color: netColor(t.net), whiteSpace: "nowrap" }}>{netText(t.net)}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {open && st.untagged > 0 && (
        <div style={{ fontSize: s(11, 9), color: "var(--muted)", textAlign: "center", marginTop: s(10, 5) }}>
          {st.untagged} hari belum diberi tag dan tidak dihitung.
        </div>
      )}
    </CardShell>
  );
}
