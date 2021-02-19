import User from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../../config/env';

function authenticate(req, res, next) {
    const { email, password } = req.body;
    User.findOne({ email })
        .select('email, password')
        .exec()
        .then(
            (user) => {
                if (!user) return next();
                console.log(user);
                user.comparePassword(password, (e, isMatch) => {
                    if (!isMatch || e) {
                        return next(e);
                    }
                    req.user = user;
                    next();
                });
            },
            (e) => next(e),
        );
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
        res.status(401).json({
            error: 'Unauthorized',
        });
    } else {
        res.status(200).json({
            jwt: req.token,
        });
    }
}

export default { authenticate, generateToken, respondJWT };
