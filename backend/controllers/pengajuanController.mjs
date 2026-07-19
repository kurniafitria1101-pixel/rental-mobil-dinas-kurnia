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
        if (!id_user || !id_mobil || !tujuan || !keperluan) {
            return res.status(400).json({
                message: "Data belum lengkap"
            });
        }

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
                jumlah_penumpang
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            jumlah_penumpang
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
        } = req.body;

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