import Wallet from '../models/wallet.js';
import Operation from '../models/operation.js';
import httpStatus from 'http-status';
import Mongoose from 'mongoose';

function list(req, res, next) {
    try {
        const { limit = 50, skip = 0 } = req.query;
        Operation.find()
            .populate([
                {
                    path: 'from',
                    model: 'Wallet',
                    select: 'name',
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
            ])
            .skip(skip)
            .limit(limit)
            .exec()
            .then((op) => {
                return res.status(httpStatus.OK).json(op);
            });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

function get(req, res) {
    const { operationId } = req.params;

    try {
        Operation.findById(operationId).then((response) => {
            return res.status(httpStatus.OK).json(response);
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur de récupération de l'opération" });
    }
}

async function create(req, res, next) {
    try {
        const { params } = req.body;

        const { from, to, amount } = params;

        const walletFrom = await Wallet.findById(Mongoose.Types.ObjectId(from));
        walletFrom.balance = Number(walletFrom.balance) - Number(amount);

        const walletTo = await Wallet.findById(Mongoose.Types.ObjectId(to));
        walletTo.balance = Number(walletTo.balance) + Number(amount);

        const newOp = await Operation.create(params);

        await walletFrom.save();
        await walletTo.save();

        return res.status(httpStatus.OK).json(newOp);
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Error' });
    }
}

export default { list, create, get };
