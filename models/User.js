import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    forename: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { versionKey: false, collection: 'users'});

export default mongoose.models.User || mongoose.model("User", UserSchema);