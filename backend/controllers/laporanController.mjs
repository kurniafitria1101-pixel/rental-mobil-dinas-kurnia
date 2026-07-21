import db from "../config/db.mjs";

// ==========================================
// Menampilkan seluruh laporan rental
// ==========================================
export const getLaporan = async (req, res) => {

    try {
        const {
            status,
            tanggal_awal,
            tanggal_akhir,
            id_user,
            id_mobil
        } = req.query;

        let sql = `
    SELECT
        p.id_pengajuan,
        u.nama_lengkap,
        m.plat_nomor,
        m.merk,
        s.nama_sopir,
        p.unit_kerja,
        p.tujuan,
        p.keperluan,
        DATE_FORMAT(p.tanggal_berangkat, '%Y-%m-%d') AS tanggal_berangkat,
        DATE_FORMAT(p.tanggal_kembali, '%Y-%m-%d') AS tanggal_kembali,
        p.lama_penggunaan,
        p.estimasi_biaya,
        p.status
    FROM pengajuan_rental p
    JOIN users u
        ON p.id_user = u.id_user
    JOIN mobil m
        ON p.id_mobil = m.id_mobil
    LEFT JOIN sopir s
        ON p.id_sopir = s.id_sopir
`;

        const params = [];

        let conditions = [];

        if (status) {
            conditions.push("p.status = ?");
            params.push(status);
        }

        if (tanggal_awal) {
            conditions.push("p.tanggal_berangkat >= ?");
            params.push(tanggal_awal);
        }

        if (tanggal_akhir) {
            conditions.push("p.tanggal_kembali <= ?");
            params.push(tanggal_akhir);
        }

        if (id_user) {
            conditions.push("p.id_user = ?");
            params.push(id_user);
        }

        if (id_mobil) {
            conditions.push("p.id_mobil = ?");
            params.push(id_mobil);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += ` ORDER BY p.id_pengajuan DESC`;

        const [rows] = await db.query(sql, params);


        res.json(rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};