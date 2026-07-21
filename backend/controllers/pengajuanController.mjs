import db from '../config/db.mjs';

// ==============================
// Menampilkan semua pengajuan
// ==============================
export const getPengajuans = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                p.*,
                u.nama_lengkap,
                m.plat_nomor,
                m.merk,
                s.nama_sopir
            FROM pengajuan_rental p
            JOIN users u
                ON p.id_user = u.id_user
            JOIN mobil m
                ON p.id_mobil = m.id_mobil
            LEFT JOIN sopir s
                ON p.id_sopir = s.id_sopir
            ORDER BY p.id_pengajuan DESC
        `);

        res.json(rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Menampilkan pengajuan berdasarkan ID
// ==============================
export const getPengajuanById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                p.*,
                u.nama_lengkap,
                m.plat_nomor,
                m.merk,
                s.nama_sopir
            FROM pengajuan_rental p
            JOIN users u
                ON p.id_user = u.id_user
            JOIN mobil m
                ON p.id_mobil = m.id_mobil
            LEFT JOIN sopir s
                ON p.id_sopir = s.id_sopir
            WHERE p.id_pengajuan = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pengajuan tidak ditemukan"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Menambahkan pengajuan
// ==============================
export const createPengajuan = async (req, res) => {

    try {

        const {
            id_user,
            id_mobil,
            unit_kerja,
            butuh_sopir,
            id_sopir,
            tujuan,
            keperluan,
            tanggal_berangkat,
            tanggal_kembali,
            jumlah_penumpang
        } = req.body;
        if (
            !id_user ||
            !id_mobil ||
            !unit_kerja ||
            !tujuan ||
            !keperluan ||
            !tanggal_berangkat ||
            !tanggal_kembali ||
            !jumlah_penumpang
        ) {
            return res.status(400).json({
                message: "Semua data wajib harus diisi"
            });
        }

        if (jumlah_penumpang < 1) {
            return res.status(400).json({
                message: "Jumlah penumpang minimal 1 orang"
            });
        }


        const tglBerangkat = new Date(tanggal_berangkat);
        const tglKembali = new Date(tanggal_kembali);

        if (tglKembali < tglBerangkat) {
            return res.status(400).json({
                message: "Tanggal kembali tidak boleh sebelum tanggal berangkat"
            });
        }

        // Ambil estimasi biaya harian dari tabel mobil
        const [mobil] = await db.query(
            `
    SELECT kapasitas, estimasi_biaya_harian
    FROM mobil
    WHERE id_mobil = ?
    `,
            [id_mobil]
        );

        if (mobil.length === 0) {
            return res.status(404).json({
                message: "Mobil tidak ditemukan"
            });
        }

        // Cek apakah mobil sudah dipakai pada rentang tanggal yang sama
        const [jadwalMobil] = await db.query(
            `
    SELECT id_pengajuan
    FROM pengajuan_rental
    WHERE id_mobil = ?
      AND status IN ('Menunggu', 'Disetujui')
      AND (
            tanggal_berangkat <= ?
        AND tanggal_kembali >= ?
      )
    `,
            [
                id_mobil,
                tanggal_kembali,
                tanggal_berangkat
            ]
        );

        if (jadwalMobil.length > 0) {
            return res.status(400).json({
                message: "Mobil sudah digunakan pada rentang tanggal tersebut"
            });
        }

        // Cek bentrok jadwal sopir
        if (butuh_sopir === "Ya" && id_sopir) {

            const [jadwalSopir] = await db.query(
                `
                    SELECT id_pengajuan
                    FROM pengajuan_rental
                    WHERE id_sopir = ?
                      AND status IN ('Menunggu', 'Disetujui')
                      AND (
                        tanggal_berangkat <= ?
                            AND tanggal_kembali >= ?
                        )
                `,
                [
                    id_sopir,
                    tanggal_kembali,
                    tanggal_berangkat
                ]
            );

            if (jadwalSopir.length > 0) {
                return res.status(400).json({
                    message: "Sopir sudah memiliki jadwal pada rentang tanggal tersebut"
                });
            }
        }

            // Validasi kapasitas mobil
            const kapasitasMobil = mobil[0].kapasitas;

            if (jumlah_penumpang > kapasitasMobil) {
                return res.status(400).json({
                    message: `Jumlah penumpang melebihi kapasitas mobil (${kapasitasMobil} orang)`
                });
            }

        const estimasiBiayaHarian = mobil[0].estimasi_biaya_harian;


        const selisihHari =
            Math.ceil((tglKembali - tglBerangkat) / (1000 * 60 * 60 * 24)) + 1;

        const lama_penggunaan = selisihHari;

// Hitung estimasi biaya
        const estimasi_biaya = lama_penggunaan * estimasiBiayaHarian;

        const sql = `
            INSERT INTO pengajuan_rental
            (
                id_user,
                id_mobil,
                unit_kerja,
                butuh_sopir,
                id_sopir,
                tujuan,
                keperluan,
                tanggal_berangkat,
                tanggal_kembali,
                jumlah_penumpang,
                lama_penggunaan,
                estimasi_biaya
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            id_user,
            id_mobil,
            unit_kerja,
            butuh_sopir,
            id_sopir,
            tujuan,
            keperluan,
            tanggal_berangkat,
            tanggal_kembali,
            jumlah_penumpang,
            lama_penggunaan,
            estimasi_biaya
        ]);

        res.status(201).json({
            message: "Pengajuan berhasil dibuat"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Update pengajuan
// ==============================
export const updatePengajuan = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            id_user,
            id_mobil,
            unit_kerja,
            butuh_sopir,
            id_sopir,
            tujuan,
            keperluan,
            tanggal_berangkat,
            tanggal_kembali,
            jumlah_penumpang,
            status
        } = req.body

        if (!id_user || !id_mobil || !tujuan || !keperluan) {
            return res.status(400).json({
                message: "Data belum lengkap"
            });
        }

        // Ambil estimasi biaya harian mobil
        const [mobil] = await db.query(
            `
            SELECT kapasitas, estimasi_biaya_harian
            FROM mobil
            WHERE id_mobil = ?
            `,
            [id_mobil]
        );

        if (mobil.length === 0) {
            return res.status(404).json({
                message: "Mobil tidak ditemukan"
            });
        }

        if (
            !unit_kerja ||
            !tanggal_berangkat ||
            !tanggal_kembali ||
            !jumlah_penumpang
        ) {
            return res.status(400).json({
                message: "Semua data wajib harus diisi"
            });
        }

        if (jumlah_penumpang < 1) {
            return res.status(400).json({
                message: "Jumlah penumpang minimal 1 orang"
            });
        }

        const tglBerangkat = new Date(tanggal_berangkat);
        const tglKembali = new Date(tanggal_kembali);

        if (tglKembali < tglBerangkat) {
            return res.status(400).json({
                message: "Tanggal kembali tidak boleh sebelum tanggal berangkat"
            });
        }

        // Cek bentrok jadwal mobil
        const [jadwalMobil] = await db.query(
            `
    SELECT id_pengajuan
    FROM pengajuan_rental
    WHERE id_mobil = ?
      AND id_pengajuan <> ?
      AND status IN ('Menunggu','Disetujui')
      AND (
            tanggal_berangkat <= ?
        AND tanggal_kembali >= ?
      )
    `,
            [
                id_mobil,
                id,
                tanggal_kembali,
                tanggal_berangkat
            ]
        );

        if (jadwalMobil.length > 0) {
            return res.status(400).json({
                message: "Mobil sudah digunakan pada rentang tanggal tersebut"
            });
        }


        if (butuh_sopir === "Ya" && id_sopir) {

            const [jadwalSopir] = await db.query(
                `
        SELECT id_pengajuan
        FROM pengajuan_rental
        WHERE id_sopir = ?
          AND id_pengajuan <> ?
          AND status IN ('Menunggu','Disetujui')
          AND (
                tanggal_berangkat <= ?
            AND tanggal_kembali >= ?
          )
        `,
                [
                    id_sopir,
                    id,
                    tanggal_kembali,
                    tanggal_berangkat
                ]
            );

            if (jadwalSopir.length > 0) {
                return res.status(400).json({
                    message: "Sopir sudah memiliki jadwal pada rentang tanggal tersebut"
                });
            }

        }


        const kapasitasMobil = mobil[0].kapasitas;

        if (jumlah_penumpang > kapasitasMobil) {
            return res.status(400).json({
                message: `Jumlah penumpang melebihi kapasitas mobil (${kapasitasMobil} orang)`
            });
        }



        const estimasiBiayaHarian = mobil[0].estimasi_biaya_harian;

// Hitung lama penggunaan
        const lama_penggunaan =
            Math.ceil((tglKembali - tglBerangkat) / (1000 * 60 * 60 * 24)) + 1;

// Hitung estimasi biaya
        const estimasi_biaya =
            lama_penggunaan * estimasiBiayaHarian;

        const [result] = await db.query(
            `UPDATE pengajuan_rental
             SET
                id_user=?,
                id_mobil=?,
                unit_kerja=?,
                butuh_sopir=?,
                id_sopir=?,
                tujuan=?,
                keperluan=?,
                tanggal_berangkat=?,
                tanggal_kembali=?,
                jumlah_penumpang=?,
                lama_penggunaan=?,
                estimasi_biaya=?,
                status=?
             WHERE id_pengajuan=?`,
            [
                id_user,
                id_mobil,
                unit_kerja,
                butuh_sopir,
                id_sopir,
                tujuan,
                keperluan,
                tanggal_berangkat,
                tanggal_kembali,
                jumlah_penumpang,
                lama_penggunaan,
                estimasi_biaya,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Pengajuan tidak ditemukan"
            });
        }

        res.json({
            message: "Pengajuan berhasil diupdate"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Hapus pengajuan
// ==============================
export const deletePengajuan = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM pengajuan_rental WHERE id_pengajuan = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Pengajuan tidak ditemukan"
            });
        }

        res.json({
            message: "Pengajuan berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};