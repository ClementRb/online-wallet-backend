import express from 'express';
import authCtrl from '../controllers/auth.js';

const router = express.Router();

router.route('/register').post(authCtrl.register, authCtrl.generateToken, authCtrl.respondJWT);

router
    .route('/login')
    /** POST /api/auth/token Get JWT authentication token */
    .post(authCtrl.authenticate, authCtrl.generateToken, authCtrl.respondJWT);

export default router;
