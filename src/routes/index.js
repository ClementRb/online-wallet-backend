import express from 'express';
import userRoutes from './users.js';
import authRoutes from './auth.js';
import walletRoutes from './wallet.js';
import operationRoutes from './operations.js';

const router = express.Router();

/** GET /api-status - Check service status **/
router.get('/api-status', (req, res) =>
    res.json({
        status: 'ok',
    }),
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallets', walletRoutes);
router.use('/operations', operationRoutes);

export default router;
