import express from 'express';
import operationsCtrl from '../controllers/operationController.js';
import auth from '../../config/jwt.js';

const router = express.Router();

router
    .route('/')
    /** GET /api/operations - Get list of operations */
    .get(auth, operationsCtrl.list)

    /** POST /api/operations - Create new operation */
    .post(auth, operationsCtrl.create);

router
    .route('/:operationId')
    /** GET /api/operations/:operationId - Get operation */
    .get(auth, operationsCtrl.get);

export default router;
