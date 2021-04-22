import httpStatus from 'http-status';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import config from '../../config/env/index.js';

function authenticate(req, res, next) {
    if (!req.body.email && !req.body.password) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: 'Missing email and password',
        });
    }

    const { email, password } = req.body;

    try {
        User.findOne({ email })
            .select('email, password')
            .exec()
            .then(
                (user) => {
                    if (!user) {
                        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unknown email' });
                    }
                    user.comparePassword(password, (e, isMatch) => {
                        if (!isMatch || e) {
                            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Password does not match' });
                        }
                        req.user = user._id;
                        next();
                    });
                },
                (e) => next(e),
            );
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function register(req, res, next) {
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: 'This email is already in use' });
        }
        const user = new User(req.body);

        return user
            .save()
            .then((result) => {
                req.user = result._id;
                next();
            })
            .catch((error) => {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
            });
    });
}

function generateToken(req, res, next) {
    if (!req.user) return next();

    const jwtPayload = {
        id: req.user._id,
    };
    const jwtData = {
        expiresIn: config.jwtDuration,
    };
    const secret = config.jwtSecret;
    req.token = jwt.sign(jwtPayload, secret, jwtData);

    next();
}

function respondJWT(req, res) {
    if (!req.user) {
        res.status(httpStatus.UNAUTHORIZED).json({
            error: 'Unauthorized',
        });
    } else {
        res.status(httpStatus.CREATED).json({
            _id: req.user,
            jwt: req.token,
        });
    }
}

export default { authenticate, generateToken, respondJWT, register };
