import express from 'express';
import userCtrl from '../controllers/userController';
import auth from '../../config/jwt';

const router = express.Router();

router
    .route('/')
    /** GET /api/users - Get list of users */
    .get(auth, userCtrl.list)

    /** POST /api/users - Create new user */
    .post(userCtrl.create);

router
    .route('/:userId')
    /** GET /api/users/:userId - Get user */
    .get(auth, userCtrl.get)

    /** PUT /api/users/:userId - Update user */
    .put(auth, userCtrl.update)

    /** DELETE /api/users/:userId - Delete user */
    .delete(auth, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
