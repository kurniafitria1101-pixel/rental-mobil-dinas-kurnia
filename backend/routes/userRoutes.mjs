import express from 'express';

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateStatusUser
} from '../controllers/userController.mjs';

import { verifyToken } from '../middlewares/authMiddleware.mjs';
import { authorizeRole } from '../middlewares/roleMiddleware.mjs';

const router = express.Router();

// Menampilkan semua user
router.get('/', verifyToken, authorizeRole(1), getUsers);

// Menampilkan user berdasarkan ID
router.get('/:id', verifyToken, authorizeRole(1), getUserById);

// Menambahkan user
router.post('/', verifyToken, authorizeRole(1), createUser);

// Update user
router.put('/:id', verifyToken, authorizeRole(1), updateUser);

// Update status user
router.put('/:id/status', verifyToken, authorizeRole(1), updateStatusUser);

// Hapus user
router.delete('/:id', verifyToken, authorizeRole(1), deleteUser);

export default router;