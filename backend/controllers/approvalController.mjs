import db from '../config/db.mjs';

// ==============================
// Menampilkan semua approval
// ==============================
export const getApprovals = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                a.*,
                p.tujuan,
                p.keperluan,
                u.nama_lengkap,
                m.plat_nomor
            FROM approval a
            JOIN pengajuan_rental p
                ON a.id_pengajuan = p.id_pengajuan
            JOIN users u
                ON p.id_user = u.id_user
            JOIN mobil m
                ON p.id_mobil = m.id_mobil
            ORDER BY a.id_approval DESC
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
// Menampilkan approval berdasarkan ID
// ==============================
export const getApprovalById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                a.*,
                p.tujuan,
                p.keperluan,
                u.nama_lengkap,
                m.plat_nomor
            FROM approval a
            JOIN pengajuan_rental p
                ON a.id_pengajuan = p.id_pengajuan
            JOIN users u
                ON p.id_user = u.id_user
            JOIN mobil m
                ON p.id_mobil = m.id_mobil
            WHERE a.id_approval = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Approval tidak ditemukan"
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


export const createApproval = async (req, res) => {

    try {

        const {
            id_pengajuan,
            id_admin,
            status,
            catatan
        } = req.body;

        // Validasi data wajib
        if (
            !id_pengajuan ||
            !id_admin ||
            !status
        ) {
            return res.status(400).json({
                message: "Data approval belum lengkap"
            });
        }

        // Validasi status
        if (!["Disetujui", "Ditolak"].includes(status)) {
            return res.status(400).json({
                message: "Status harus Disetujui atau Ditolak"
            });
        }

        // Simpan approval
        await db.query(
            `INSERT INTO approval
            (id_pengajuan, id_admin, status, catatan)
            VALUES (?, ?, ?, ?)`,
            [
                id_pengajuan,
                id_admin,
                status,
                catatan
            ]
        );

        // Update status pengajuan
        await db.query(
            `UPDATE pengajuan_rental
             SET status = ?
             WHERE id_pengajuan = ?`,
            [
                status,
                id_pengajuan
            ]
        );

        res.status(201).json({
            message: "Approval berhasil disimpan"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Update approval
// ==============================
export const updateApproval = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            id_pengajuan,
            id_admin,
            status,
            catatan
        } = req.body;

        // Validasi data wajib
        if (
            !id_pengajuan ||
            !id_admin ||
            !status
        ) {
            return res.status(400).json({
                message: "Data approval belum lengkap"
            });
        }

        // Validasi status
        if (!["Disetujui", "Ditolak"].includes(status)) {
            return res.status(400).json({
                message: "Status harus Disetujui atau Ditolak"
            });
        }

        // Update tabel approval
        const [result] = await db.query(
            `UPDATE approval
             SET
                id_pengajuan=?,
                id_admin=?,
                status=?,
                catatan=?
             WHERE id_approval=?`,
            [
                id_pengajuan,
                id_admin,
                status,
                catatan,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Approval tidak ditemukan"
            });
        }

        // Sinkronkan status pada tabel pengajuan
        await db.query(
            `UPDATE pengajuan_rental
             SET status=?
             WHERE id_pengajuan=?`,
            [
                status,
                id_pengajuan
            ]
        );

        res.json({
            message: "Approval berhasil diupdate"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Hapus approval
// ==============================
export const deleteApproval = async (req, res) => {

    try {

        const { id } = req.params;

        // Cari data approval terlebih dahulu
        const [rows] = await db.query(
            "SELECT * FROM approval WHERE id_approval = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Approval tidak ditemukan"
            });
        }

        const approval = rows[0];

        // Hapus approval
        await db.query(
            "DELETE FROM approval WHERE id_approval = ?",
            [id]
        );

        // Kembalikan status pengajuan menjadi Menunggu
        await db.query(
            `UPDATE pengajuan_rental
             SET status='Menunggu'
             WHERE id_pengajuan=?`,
            [approval.id_pengajuan]
        );

        res.json({
            message: "Approval berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};
