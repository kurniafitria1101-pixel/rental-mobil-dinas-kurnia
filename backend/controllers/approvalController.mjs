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