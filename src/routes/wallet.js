import express from 'express';
import walletCtrl from '../controllers/walletController.js';
import auth from '../../config/jwt.js';

const router = express.Router();

router
    .route('/')
    /** GET /api/wallets - Get list of wallets */
    .get(auth, walletCtrl.list)

    /** POST /api/wallets - Create new wallet */
    .post(walletCtrl.create);

router
    .route('/:walletId')
    /** GET /api/wallets/:walletId - Get wallet */
    .get(auth, walletCtrl.get)

    /** PUT /api/wallets/:walletId - Update wallet */
    .put(auth, walletCtrl.update)

    /** DELETE /api/wallets/:walletId - Delete wallet */
    .delete(auth, walletCtrl.remove);

router
    .route('/:walletId/operations')
    /** GET /api/wallets/:walletId/operations - Get wallet operations */
    .get(auth, walletCtrl.getOperations);

/** Load wallet when API with walletId route parameter is hit */
router.param('walletId', walletCtrl.load);

export default router;
