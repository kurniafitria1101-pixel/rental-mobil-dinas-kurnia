import db from '../config/db.mjs';

// ==============================
// Menampilkan semua mobil
// ==============================
export const getMobils = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM mobil"
        );

        res.json(rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};



// ==============================
// Menampilkan mobil berdasarkan ID
// ==============================
export const getMobilById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM mobil WHERE id_mobil = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Mobil tidak ditemukan"
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
// Menambahkan mobil
// ==============================
export const createMobil = async (req, res) => {

    try {
        console.log(req.body);

        const {
            plat_nomor,
            merk,
            tipe,
            tahun,
            warna,
            kapasitas,
            status,
            foto,
            estimasi_biaya_harian
        } = req.body;

        const sql = `
            INSERT INTO mobil
            (
                plat_nomor,
                merk,
                tipe,
                tahun,
                warna,
                kapasitas,
                status,
                foto,
                estimasi_biaya_harian
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            plat_nomor,
            merk,
            tipe,
            tahun,
            warna,
            kapasitas,
            status,
            foto,
            estimasi_biaya_harian
        ]);

        res.status(201).json({
            message: "Mobil berhasil ditambahkan"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Update mobil
// ==============================
export const updateMobil = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            plat_nomor,
            merk,
            tipe,
            tahun,
            warna,
            kapasitas,
            status,
            foto,
            estimasi_biaya_harian
        } = req.body;

        const [result] = await db.query(
            `UPDATE mobil
             SET
                plat_nomor=?,
                merk=?,
                tipe=?,
                tahun=?,
                warna=?,
                kapasitas=?,
                status=?,
                foto=?,
                estimasi_biaya_harian=?
             WHERE id_mobil=?`,
            [
                plat_nomor,
                merk,
                tipe,
                tahun,
                warna,
                kapasitas,
                status,
                foto,
                estimasi_biaya_harian,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mobil tidak ditemukan"
            });
        }

        res.json({
            message: "Mobil berhasil diupdate"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};



// ==============================
// Hapus mobil
// ==============================
export const deleteMobil = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM mobil WHERE id_mobil = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mobil tidak ditemukan"
            });
        }

        res.json({
            message: "Mobil berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};