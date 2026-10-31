# v1.9.98 — Tag setup dan checklist sebelum entry

Baru
- Tombol Tambah Transaksi membuka dialog "Sebelum entry": pilih tag setup, lalu centang checklist.
  Kalau tag "Tanpa setup" dipilih atau checklist belum lengkap, muncul peringatan; menekan tombol sekali lagi ("Tetap lanjut") tetap mencatat apa adanya. Jurnal tidak memblokir pencatatan jujur.
- Tag disimpan di data per hari (field `setup`). Bisa diganti kapan saja lewat tulisan kecil di bawah tanggal pada tabel (entri lama tampil "Tag?").
- Kartu baru "Statistik Setup" di bawah kartu Statistik: hasil bersih (profit - loss - komisi) dan persentase hari menang untuk "Sesuai setup" vs "Tanpa setup", plus rincian per tag. Dihitung dari semua bulan; entri tanpa tag tidak ikut dihitung.
- `src/setupConfig.js`: daftar tag dan isi checklist. Mau ganti nama tag atau isi checklist cukup ubah file ini (id tag yang sudah dipakai jangan diubah).
- Tes baru `tests/setupConfig.test.mjs` (hitungan dicek tangan).

Tidak diubah: logic hitung saldo, Risk Guard, penyimpanan, dan backup. Field `setup` otomatis ikut ekspor/impor backup.
