import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    balance: { type: Number, required: true },
    ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    createdAt: { type: Date, required: true },
});

export default mongoose.model('Wallet', WalletSchema);
