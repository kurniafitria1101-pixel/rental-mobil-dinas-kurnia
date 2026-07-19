import express from 'express';

import {
    getPengajuans,
    getPengajuanById,
    createPengajuan,
    updatePengajuan,
    deletePengajuan
} from '../controllers/pengajuanController.mjs';

const router = express.Router();

// Menampilkan semua pengajuan
router.get('/', getPengajuans);

// Menampilkan pengajuan berdasarkan ID
router.get('/:id', getPengajuanById);

// Menambahkan pengajuan
router.post('/', createPengajuan);

// Update pengajuan
router.put('/:id', updatePengajuan);

// Hapus pengajuan
router.delete('/:id', deletePengajuan);

export default router;