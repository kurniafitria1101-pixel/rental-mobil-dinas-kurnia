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