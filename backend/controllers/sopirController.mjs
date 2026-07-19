import db from '../config/db.mjs';

// ==============================
// Menampilkan semua sopir
// ==============================
export const getSopirs = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM sopir"
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
// Menampilkan sopir berdasarkan ID
// ==============================
export const getSopirById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM sopir WHERE id_sopir = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Sopir tidak ditemukan"
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
// Menambahkan sopir
// ==============================
export const createSopir = async (req, res) => {

    try {
        console.log(req.body);

        const {
            nama_sopir,
            no_hp,
            alamat,
            no_sim,
            status
        } = req.body;

        const sql = `
            INSERT INTO sopir
            (nama_sopir, no_hp, alamat, no_sim, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            nama_sopir,
            no_hp,
            alamat,
            no_sim,
            status
        ]);

        res.status(201).json({
            message: "Sopir berhasil ditambahkan"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Update sopir
// ==============================
export const updateSopir = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nama_sopir,
            no_hp,
            alamat,
            no_sim,
            status
        } = req.body;

        const [result] = await db.query(
            `UPDATE sopir
             SET
                nama_sopir=?,
                no_hp=?,
                alamat=?,
                no_sim=?,
                status=?
             WHERE id_sopir=?`,
            [
                nama_sopir,
                no_hp,
                alamat,
                no_sim,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Sopir tidak ditemukan"
            });
        }

        res.json({
            message: "Sopir berhasil diupdate"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// Hapus sopir
// ==============================
export const deleteSopir = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM sopir WHERE id_sopir = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Sopir tidak ditemukan"
            });
        }

        res.json({
            message: "Sopir berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};