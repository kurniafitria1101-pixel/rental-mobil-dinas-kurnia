import db from '../config/db.mjs';
import bcrypt from 'bcryptjs';//controller ini menggunakan koneksi MySQL

// Menampilkan semua user
export const getUsers = async (req, res) => {
//export const getUsers => fungsi ini bisa dipakai oleh file lain.

    try {

        const [rows] = await db.query(
            "SELECT * FROM users"
        );

        res.json(rows);                                                 //Data dikirim ke browser dalam bentuk JSON.

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// Menampilkan user berdasarkan ID
export const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE id_user = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
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



// ====================================
// Menambahkan user baru
// ====================================
export const createUser = async (req, res) => {

    try {

        const {
            id_role,
            nama_lengkap,
            nip,
            username,
            password,
            email,
            no_hp
        } = req.body;

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (id_role, nama_lengkap, nip, username, password, email, no_hp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            id_role,
            nama_lengkap,
            nip,
            username,
            hashedPassword,
            email,
            no_hp
        ]);

        res.status(201).json({
            message: "User berhasil ditambahkan"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};



// ====================================
// Update user
// ====================================
export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            id_role,
            nama_lengkap,
            nip,
            username,
            password,
            email,
            no_hp,
            status
        } = req.body;

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `UPDATE users
             SET
                id_role=?,
                nama_lengkap=?,
                nip=?,
                username=?,
                password=?,
                email=?,
                no_hp=?,
                status=?
             WHERE id_user=?`,
            [
                id_role,
                nama_lengkap,
                nip,
                username,
                hashedPassword,
                email,
                no_hp,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        res.json({
            message: "User berhasil diupdate"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// Hapus user
export const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM users WHERE id_user = ?",
            [id]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        res.json({
            message: "User berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ====================================
// Update Status User (Aktif / Nonaktif)
// ====================================
export const updateStatusUser = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!["Aktif", "Nonaktif"].includes(status)) {
            return res.status(400).json({
                message: "Status harus Aktif atau Nonaktif"
            });
        }

        const [result] = await db.query(
            `UPDATE users
             SET status = ?
             WHERE id_user = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        res.json({
            message: `Status user berhasil diubah menjadi ${status}`
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};