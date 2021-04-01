import mongoose from 'mongoose';

const OperationSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', index: true },
    description: { type: String, required: false },
    executedAt: { type: Date, required: true },
    amount: { type: Number, required: true },
});

export default mongoose.model('Operation', OperationSchema);
