import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import httpStatus from 'http-status';
import Mongoose from 'mongoose';

async function load(req, res, next) {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        req.user = user;
        return next();
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error getting user' });
    }
}

function get(req, res) {
    const { userId } = req.params;

    try {
        User.findById(userId).then((response) => {
            return res.status(httpStatus.OK).json(response);
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error getting user' });
    }
}

function create(req, res, next) {
    try {
        User.create(req.body).then((savedUser) => {
            return res.status(httpStatus.CREATED).json(savedUser);
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

async function update(req, res, next) {
    const userData = req.body.params;
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error getting user' });
        }

        if (userData.email !== user.email) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                return res.status(httpStatus.CONFLICT).json({ message: 'This email is already in use' });
            }
        }

        user.email = userData.email;
        user.lastname = userData.lastname;
        user.firstname = userData.firstname;
        if (userData.password.length > 0) {
            user.password = userData.password;
        }

        await user.save();

        return res.status(httpStatus.OK).json(user);
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;

    try {
        User.find()
            .skip(skip)
            .limit(limit)
            .exec()
            .then((users) => {
                return res.status(httpStatus.OK).json(users);
            });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function remove(req, res, next) {
    const { userId } = req.params;

    try {
        User.deleteOne({ _id: userId }).then(() => {
            return res.status(httpStatus.OK).json({ message: 'OK' });
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function getWallets(req, res, next) {
    const { userId } = req.params;

    const _id = Mongoose.Types.ObjectId(userId);
    try {
        Wallet.find()
            .where('ownedBy')
            .equals(_id)
            .exec()
            .then((wallets) => {
                return res.status(httpStatus.OK).json(wallets);
            });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

export default { load, get, create, update, list, remove, getWallets };
