import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    role: {
        type: String,
        default: 'guest',
        index: true,
        required: true,
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, select: false, required: true },
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) return next(hashErr);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (toCompare, done) {
    bcrypt.compare(toCompare, this.password, done);
};

export default mongoose.model('User', UserSchema);
