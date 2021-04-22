import Wallet from '../models/wallet.js';
import httpStatus from 'http-status';
import Operation from '../models/operation.js';
import Mongoose from 'mongoose';

async function load(req, res, next) {
    const { walletId } = req.params;

    try {
        const wallet = await Wallet.findById(walletId);

        req.wallet = wallet;
        return next();
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erreur de récupération du wallet' });
    }
}
function get(req, res) {
    const { walletId } = req.params;

    try {
        Wallet.findById(walletId).then((response) => {
            return res.status(httpStatus.OK).json(response);
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erreur de récupération du wallet' });
    }
}

function create(req, res, next) {
    try {
        const { params } = req.body;

        Wallet.create(params).then((savedWallet) => {
            return res.status(httpStatus.CREATED).json(savedWallet);
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

async function getOperations(req, res, next) {
    const { walletId } = req.params;

    const _id = Mongoose.Types.ObjectId(walletId);
    try {
        if (!_id) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
        }
        const operations = await Operation.find({
            $or: [{ from: _id }, { to: _id }],
        }).populate([
            {
                path: 'from',
                model: 'Wallet',
                select: 'name ownedBy',
                populate: {
                    path: 'ownedBy',
                    model: 'User',
                },
            },
            {
                path: 'to',
                model: 'Wallet',
                select: 'name ownedBy',
                populate: {
                    path: 'ownedBy',
                    model: 'User',
                },
            },
        ]);

        return res.status(httpStatus.OK).json(operations);
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

async function update(req, res, next) {
    const walletData = req.body.params;
    const { walletId } = req.params;

    try {
        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erreur de récupération du wallet' });
        }

        wallet.name = walletData.name;
        wallet.description = walletData.description;
        wallet.balance = walletData.balance;

        await wallet.save();

        return res.status(httpStatus.OK).json(wallet);
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function list(req, res, next) {
    try {
        const { limit = 50, skip = 0 } = req.query;
        Wallet.find()
            .populate([
                {
                    path: 'ownedBy',
                    model: 'User',
                },
            ])
            .skip(skip)
            .limit(limit)
            .exec()
            .then((wallets) => {
                return res.status(httpStatus.OK).json(wallets);
            });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function remove(req, res, next) {
    const { walletId } = req.params;

    try {
        wallet.deleteOne({ _id: walletId }).then(() => {
            return res.status(httpStatus.OK).json({ message: 'OK' });
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

export default { load, get, create, update, list, remove, getOperations };
