import db from '../config/db.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username dan password wajib diisi"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Username tidak ditemukan"
            });
        }

        const user = rows[0];

        if (user.status !== "Aktif") {
            return res.status(403).json({
                message: "Akun Anda belum diaktifkan oleh Admin."
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Password salah"
            });
        }

        const token = jwt.sign(
            {
                id_user: user.id_user,
                id_role: user.id_role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id_user: user.id_user,
                nama: user.nama_lengkap,
                username: user.username,
                role: user.id_role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

/* ================= REGISTER PEGAWAI ================= */

export const register = async (req, res) => {

    try {

        const {
            nama_lengkap,
            nip,
            username,
            password,
            email,
            no_hp
        } = req.body;

        // cek username
        const [cekUsername] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (cekUsername.length > 0) {
            return res.status(400).json({
                message: "Username sudah digunakan"
            });
        }

        // cek NIP
        const [cekNip] = await db.query(
            "SELECT * FROM users WHERE nip = ?",
            [nip]
        );

        if (cekNip.length > 0) {
            return res.status(400).json({
                message: "NIP sudah terdaftar"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users
            (id_role, nama_lengkap, nip, username, password, email, no_hp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                2,
                nama_lengkap,
                nip,
                username,
                hashedPassword,
                email,
                no_hp,
                "Nonaktif"
            ]
        );

        res.status(201).json({
            message: "Registrasi berhasil. Menunggu persetujuan Admin."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};