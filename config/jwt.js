import config from './env/index.js';
import jwt from 'express-jwt';

const authenticate = jwt({
    secret: config.jwtSecret,
});

export default authenticate;
