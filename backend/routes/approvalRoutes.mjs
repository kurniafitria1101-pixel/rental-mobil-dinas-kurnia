import express from 'express';

import {
    getApprovals,
    getApprovalById,
    createApproval,
    updateApproval,
    deleteApproval
} from '../controllers/approvalController.mjs';

import { verifyToken } from '../middlewares/authMiddleware.mjs';
import { authorizeRole } from '../middlewares/roleMiddleware.mjs';

const router = express.Router();

// Hanya Pimpinan yang boleh melihat approval
router.get(
    '/',
    verifyToken,
    authorizeRole(3),
    getApprovals
);

router.get(
    '/:id',
    verifyToken,
    authorizeRole(3),
    getApprovalById
);

// Hanya Pimpinan yang boleh membuat approval
router.post(
    '/',
    verifyToken,
    authorizeRole(3),
    createApproval
);

// Hanya Pimpinan yang boleh mengubah approval
router.put(
    '/:id',
    verifyToken,
    authorizeRole(3),
    updateApproval
);

// Hanya Pimpinan yang boleh menghapus approval
router.delete(
    '/:id',
    verifyToken,
    authorizeRole(3),
    deleteApproval
);

export default router;