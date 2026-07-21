import db from "../config/db.mjs";

// ==============================
// Dashboard Admin
// ==============================
export const getDashboard = async (req, res) => {

    try {

        // Total mobil
        const [mobil] = await db.query(
            "SELECT COUNT(*) AS total_mobil FROM mobil"
        );

        // Total sopir
        const [sopir] = await db.query(
            "SELECT COUNT(*) AS total_sopir FROM sopir"
        );

        // Total pengajuan
        const [pengajuan] = await db.query(
            "SELECT COUNT(*) AS total_pengajuan FROM pengajuan_rental"
        );

        // Pengajuan menunggu
        const [menunggu] = await db.query(
            "SELECT COUNT(*) AS total FROM pengajuan_rental WHERE status='Menunggu'"
        );

        // Pengajuan disetujui
        const [disetujui] = await db.query(
            "SELECT COUNT(*) AS total FROM pengajuan_rental WHERE status='Disetujui'"
        );

        // Pengajuan ditolak
        const [ditolak] = await db.query(
            "SELECT COUNT(*) AS total FROM pengajuan_rental WHERE status='Ditolak'"
        );

        res.json({

            total_mobil: mobil[0].total_mobil,

            total_sopir: sopir[0].total_sopir,

            total_pengajuan: pengajuan[0].total_pengajuan,

            menunggu: menunggu[0].total,

            disetujui: disetujui[0].total,

            ditolak: ditolak[0].total

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};